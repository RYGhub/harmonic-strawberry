import {AxiosError} from "axios"
import {CommandInteraction, Permissions, TextChannel} from "discord.js"
import {makeGuildGroup} from "./make"
import {renderAchievementEmbed, renderImpressiveError} from "./render"
import {linkImpressiveWebhook, setCommandPermissions, setupDiscordWebhook} from "./setup"
import {AchievementFull} from "./types"
import {client as dsclient} from "./discord"
import {editResource, rest as impressiveRest} from "./impressive"


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
    console.debug("[Handler/Command] Handling a command interaction:", interaction)
    try {
        await HANDLERS[interaction.commandName](interaction)
    }
    catch (error) {
        console.error("[Handler/Command] Error:", error)
        await handleImpressiveError(interaction, error)
    }
}


async function handleImpressiveError(interaction: CommandInteraction, error: AxiosError): Promise<void> {
    console.debug("[Handler/Command/ImpressiveError] Trying to reply to the interaction with the error...")
    const errorMessage = renderImpressiveError(error)
    try {
        await interaction.reply(errorMessage)
    }
    catch(_) {
        console.debug("[Handler/Command/ImpressiveError] Cannot reply with the error, trying to follow up...")
        try {
            await interaction.followUp(errorMessage)
        }
        catch(_) {
            console.warn("[Handler/Command/ImpressiveError] Cannot follow up with the error, giving up...")
        }
    }
}


async function findTargetChannel(interaction: CommandInteraction): Promise<TextChannel> {
    return await dsclient.channels.fetch(interaction.options.get("channel").channel.id) as TextChannel
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

    const group = await makeGuildGroup(interaction)
    const channel = await findTargetChannel(interaction)
    const dsWebhook = await setupDiscordWebhook(channel)
    const isWebhook = await linkImpressiveWebhook(dsWebhook)
    const permissions = await setCommandPermissions(guild, interaction.options.get("role").role.id)

    await interaction.reply({
        content: `:hammer: Set up achievements in channel <#${channel.id}> and enabled the other Strawberry commands!`,
        ephemeral: true,
    })
}

async function handleList(interaction: CommandInteraction): Promise<void> {
    const response = await impressiveRest.get<AchievementFull[]>("/api/achievement/v1/", {
        params: {
            group: interaction.guildId,
        }
    })

    const achievements = response.data
    const embeds = achievements.map(ach => renderAchievementEmbed(ach, true))

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
    const response = await impressiveRest.post<AchievementFull>("/api/achievement/v1/", {
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
        embeds: [renderAchievementEmbed(achievement, true)],
        ephemeral: true,
    })
}

async function handleEdit(interaction: CommandInteraction): Promise<void> {
    const crystal = interaction.options.get("crystal").value
    const response = await editResource<AchievementFull>(`/api/achievement/v1/${crystal}`, {
        name: interaction.options.get("name")?.value,
        description: interaction.options.get("description")?.value,
        alloy: interaction.options.get("alloy")?.value,
        secret: interaction.options.get("secret")?.value,
        repeatable: interaction.options.get("repeatable")?.value,
    }, {
        params: {
            group: interaction.guildId,
        }
    })

    const achievement = response.data
    await interaction.reply({
        content: `:pencil2: Edited achievement \`${achievement.crystal}\`!`,
        embeds: [renderAchievementEmbed(achievement, true)],
        ephemeral: true,
    })
}

async function handleDelete(interaction: CommandInteraction): Promise<void> {
    const crystal = interaction.options.get("crystal").value
    const response = await impressiveRest.delete(`/api/achievement/v1/${crystal}`, {
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
