import {REST} from "@discordjs/rest"
import {env} from "./env"
import {Client, Intents} from "discord.js"
import {registerGuild, registerGlobal} from "./slashRegistration"
import {handleCommand} from "./slashHandling"


export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
    ]
})

export const rest = new REST({version: "9"}).setToken(env.DISCORD_TOKEN)
export const run = async () => client.login(env.DISCORD_TOKEN)

client.on("ready", async () => {
    console.info("[Discord] Client connected successfully and is ready!")
})

client.once("ready", async () => {
    if(env.HS_REGISTER_COMMANDS === "guild") {
        console.info("[Discord] Registering slash commands for guild ", env.DISCORD_GUILD_ID, "...")
        await registerGuild(rest, env.DISCORD_APP_ID, env.DISCORD_GUILD_ID)
        console.info("[Discord] Slash commands registered successfully!")
    }
    else if(env.HS_REGISTER_COMMANDS === "global") {
        console.info("[Discord] Registering slash commands globally...")
        await registerGlobal(rest, env.DISCORD_APP_ID)
        console.info("[Discord] Slash commands registered successfully!")
    }
    else {
        console.info("[Discord] Not registering slash commands.")
    }
})

client.on("interactionCreate", async interaction => {
    if (interaction.isCommand()) {
        await handleCommand(interaction)
    }
})

