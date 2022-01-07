import {AxiosResponse} from "axios"
import {Snowflake} from "discord-api-types/v9"
import {ApplicationCommandPermissions, Collection, CommandInteraction, Guild, GuildApplicationCommandPermissionData, Interaction, Permissions, TextChannel, Webhook} from "discord.js"
import {ApplicationCommandPermissionTypes} from "discord.js/typings/enums"
import {api as isapi} from "./impressive"
import {renderAchievement} from "./msgrender"
import {AchievementFull, GroupFull, WebhookFull, WebhookKind} from "./types"
import {rest as dsapi, client as dsclient} from "./discord"
import exp = require("constants")


const HANDLERS = {
    "setup": handleSetup,
    "list": handleList,
    "create": handleCreate,
    "edit": handleEdit,
    "delete": handleDelete,
    "view": handleView,
    "unlock": handleUnlock,
    "relock": handleRelock,
}


export async function handleCommand(interaction: CommandInteraction): Promise<void> {
    try {
        await HANDLERS[interaction.commandName](interaction)
    }
    catch (e) {
        if(e.response?.data?.reason) {
            await interaction.reply(`:warning: ${e.response.data.reason}`)
        }
        else {
            console.error(e)
        }
    }
}

async function findGuildGroup(interaction: Interaction): Promise<GroupFull> {
    console.debug("Finding the Strawberry group of guild", interaction.guildId)
    let groupResponse: AxiosResponse<GroupFull>

    try {
        groupResponse = await isapi.get<GroupFull>(`/api/group/v1/${interaction.guildId}`)
    }
    catch(_) {
        console.debug("Group does not exist, creating it now")
        groupResponse = await isapi.post<GroupFull>(`/api/group/v1/`, {
            crystal: interaction.guildId,
        })
    }

    const group = groupResponse.data
    console.debug("Group has uuid", group.id)

    return group
}

async function findTargetChannel(interaction: CommandInteraction): Promise<TextChannel> {
    return await dsclient.channels.fetch(interaction.options.get("channel").channel.id) as TextChannel
}

async function setupDiscordWebhook(channel: TextChannel): Promise<Webhook> {
    console.debug("Creating webhook in", channel.id, "in guild", channel.guildId)
    const result = await channel.createWebhook("Strawberry")
    console.debug("Successfully created webhook!")

    return result
}

async function setupImpressiveWebhook(webhook: Webhook): Promise<WebhookFull> {
    console.debug("Linking webhook to Impressive Strawberry with url ", webhook.url)
    const response = await isapi.post<WebhookFull>("/api/webhook/v1/", {
        url: webhook.url,
        kind: WebhookKind.DISCORD,
    }, {
        params: {
            "group": webhook.guildId,
        }
    })
    console.debug("Webhook link successful!")

    return response.data
}

function createEmptyPermission(cmdId: Snowflake): GuildApplicationCommandPermissionData {
    return {
        id: cmdId,
        permissions: [],
    }
}

function createRolePermission(cmdId: Snowflake, roleId: Snowflake): GuildApplicationCommandPermissionData {
    return {
        id: cmdId,
        permissions: [
            {
                id: roleId,
                type: ApplicationCommandPermissionTypes.ROLE,
                permission: true,
            },
        ],
    }
}

async function setupCommandPermissions(guild: Guild, adminRoleId: Snowflake): Promise<Collection<string, ApplicationCommandPermissions[]>> {
    const commands = await guild.commands.fetch()
    const fullPermissions = commands.map<GuildApplicationCommandPermissionData>(cmd => {
        if(["list", "view"].includes(cmd.name)) {
            return createRolePermission(cmd.id, guild.id)
        }
        else if(["create", "edit", "delete", "unlock", "relock"].includes(cmd.name)) {
            return createRolePermission(cmd.id, adminRoleId)
        }
        else {
            return createEmptyPermission(cmd.id)
        }
    })
    const result = await guild.commands.permissions.set({fullPermissions})
    return result
}

async function handleSetup(interaction: CommandInteraction): Promise<void> {
    const guild = await interaction.guild.fetch()
    const member = await guild.members.fetch(interaction.user.id)
    if(!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        await interaction.reply({
            content: ":warning: You do not have the required permissions to setup the bot. To do that, you need the `Administrator` permission.",
            ephemeral: true,
        })
        return
    }

    const group = findGuildGroup(interaction)
    const channel = await findTargetChannel(interaction)
    const dsWebhook = await setupDiscordWebhook(channel)
    const isWebhook = await setupImpressiveWebhook(dsWebhook)
    const permissions = await setupCommandPermissions(guild, interaction.options.get("role").role.id)

    await interaction.reply({
        content: `:hammer: Set up achievements in channel <#${channel.id}> and enabled the other Strawberry commands!`,
        ephemeral: true,
    })
}

async function handleList(interaction: CommandInteraction): Promise<void> {
    const response = await isapi.get<AchievementFull[]>("/api/achievement/v1/", {
        params: {
            group: interaction.guildId,
        }
    })

    const achievements = response.data
    const embeds = achievements.map(ach => renderAchievement(ach, true))

    const expectedMessages = Math.ceil(embeds.length / 10)
    for(let msgNo = 0; msgNo < expectedMessages; msgNo++) {
        const msgEmbeds = embeds.slice(msgNo * 10, msgNo * 10 + 10)
        if(msgNo === 0) {
            await interaction.reply({
                embeds: msgEmbeds,
                ephemeral: true,
            })
        }
        else {
            await interaction.followUp({
                embeds: msgEmbeds,
                ephemeral: true,
            })
        }
    }
}

async function handleCreate(interaction: CommandInteraction): Promise<void> {
    const response = await isapi.post<AchievementFull>("/api/achievement/v1/", {
        name: interaction.options.get("name").value,
        description: interaction.options.get("description").value,
        alloy: interaction.options.get("alloy").value,
        secret: interaction.options.get("secret").value,
        repeatable: interaction.options.get("repeatable").value ?? false,
        crystal: interaction.options.get("crystal").value,
    }, {
        params: {
            group: interaction.guildId
        }
    })

    const achievement = response.data
    await interaction.reply({
        content: `:sparkles: Created achievement \`${achievement.crystal}\`!`,
        embeds: [renderAchievement(achievement, true)],
        ephemeral: true,
    })
}

async function handleEdit(interaction: CommandInteraction): Promise<void> {
    const crystal = interaction.options.get("crystal").value
    const getResponse = await isapi.get<AchievementFull>(`/api/achievement/v1/${crystal}`, {
        params: {
            group: interaction.guildId
        }
    })
    const getAchievement = getResponse.data

    const putResponse = await isapi.put<AchievementFull>(`/api/achievement/v1/${crystal}`, {
        name: interaction.options.get("name")?.value ?? getAchievement.name,
        description: interaction.options.get("description")?.value ?? getAchievement.description,
        alloy: interaction.options.get("alloy")?.value ?? getAchievement.alloy,
        secret: interaction.options.get("secret")?.value ?? getAchievement.secret,
        repeatable: interaction.options.get("repeatable")?.value ?? getAchievement.repeatable,
        crystal: crystal,
    }, {
        params: {
            group: interaction.guildId,
        }
    })

    const putAchievement = putResponse.data
    await interaction.reply({
        content: `:pencil2: Edited achievement \`${getAchievement.crystal}\`!`,
        embeds: [renderAchievement(putAchievement, true)],
        ephemeral: true,
    })
}

async function handleDelete(interaction: CommandInteraction): Promise<void> {
    const crystal = interaction.options.get("crystal").value
    const response = await isapi.delete(`/api/achievement/v1/${crystal}`, {
        params: {
            group: interaction.guildId,
        }
    })

    await interaction.reply({
        content: `:wastebasket: Deleted achievement \`${crystal}\`!`,
        ephemeral: true,
    })
}

async function handleView(interaction: CommandInteraction): Promise<void> {

}

async function handleUnlock(interaction: CommandInteraction): Promise<void> {

}

async function handleRelock(interaction: CommandInteraction): Promise<void> {

}
