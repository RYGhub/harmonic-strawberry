import {AxiosResponse} from "axios"
import {CommandInteraction, CommandInteractionOption, Interaction, Role, TextBasedChannel, TextChannel, Webhook} from "discord.js"
import {api as isapi} from "./impressive"
import {GroupFull, WebhookFull, WebhookKind} from "./types"
import {rest as dsapi, client as dsclient} from "./discord"


export async function handleCommand(interaction: CommandInteraction): Promise<void> {
    switch(interaction.commandName) {
        case "setup":
            await handleSetup(interaction);
            break;
        case "list":
            await handleList(interaction);
            break;
        case "create":
            await handleCreate(interaction);
            break;
        case "edit":
            await handleEdit(interaction);
            break;
        case "delete":
            await handleDelete(interaction);
            break;
        case "view":
            await handleView(interaction);
            break;
        case "unlock":
            await handleUnlock(interaction);
            break;
        case "relock":
            await handleRelock(interaction);
            break;
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

async function handleSetup(interaction: CommandInteraction): Promise<void> {
    const group = findGuildGroup(interaction)
    const channel = await findTargetChannel(interaction)
    const dsWebhook = await setupDiscordWebhook(channel)
    const isWebhook = await setupImpressiveWebhook(dsWebhook)

    const role = interaction.options.get("role").role.id

    await interaction.reply("kind of done")
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
