import {AxiosResponse} from "axios"
import {Snowflake} from "discord-api-types/v9"
import {ApplicationCommandPermissions, Collection, CommandInteraction, Guild, GuildApplicationCommandPermissionData, Interaction, Permissions, TextChannel, Webhook} from "discord.js"
import {ApplicationCommandPermissionTypes} from "discord.js/typings/enums"
import {api as isapi} from "./impressive"
import {GroupFull, WebhookFull, WebhookKind} from "./types"
import {rest as dsapi, client as dsclient} from "./discord"


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
    await HANDLERS[interaction.commandName](interaction)
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

    await interaction.reply(`:hammer: Set up achievements in channel <#${channel.id}> and enabled the other Strawberry commands!`)
}

async function handleList(interaction: CommandInteraction): Promise<void> {

}

async function handleCreate(interaction: CommandInteraction): Promise<void> {

}

async function handleEdit(interaction: CommandInteraction): Promise<void> {

}

async function handleDelete(interaction: CommandInteraction): Promise<void> {

}

async function handleView(interaction: CommandInteraction): Promise<void> {

}

async function handleUnlock(interaction: CommandInteraction): Promise<void> {

}

async function handleRelock(interaction: CommandInteraction): Promise<void> {

}
