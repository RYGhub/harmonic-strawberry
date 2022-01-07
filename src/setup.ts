import {Snowflake} from "discord-api-types"
import {ApplicationCommandPermissions, Collection, Guild, GuildApplicationCommandPermissionData, TextChannel, Webhook} from "discord.js"
import {createEmptyPermission, createRolePermission} from "./slashPermissionsUtils"
import {rest as impressiveRest} from "./impressive"
import {WebhookFull, WebhookKind} from "./types"


export async function setupDiscordWebhook(webhookChannel: TextChannel): Promise<Webhook> {
    console.debug("[Setup/Discord] Creating webhook in guild channel...")
    const result = await webhookChannel.createWebhook("Strawberry")

    console.debug("[Setup/Discord] Successfully created webhook!")
    return result
}

export async function linkImpressiveWebhook(discordWebhook: Webhook): Promise<WebhookFull> {
    console.debug("[Setup/Impressive] Linking webhook to Impressive Strawberry...")
    const response = await impressiveRest.post<WebhookFull>("/api/webhook/v1/", {
        url: discordWebhook.url,
        kind: WebhookKind.DISCORD,
    }, {
        params: {
            "group": discordWebhook.guildId,
        }
    })

    console.debug("[Setup/Impressive] Webhook link successful!")
    return response.data
}

export async function setCommandPermissions(guild: Guild, adminRoleId: Snowflake): Promise<Collection<string, ApplicationCommandPermissions[]>> {
    console.debug("[Setup/Discord] Fetching slash commands...")
    const commands = await guild.commands.fetch()

    console.debug("[Setup/Discord] Setting command permissions for guild...")
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

    console.debug("[Setup/Discord] Successfully set up command permissions!")
    return result
}