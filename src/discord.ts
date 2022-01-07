import {REST} from "@discordjs/rest"
import {env} from "./env"
import {Client, Intents} from "discord.js"
import {registerGuild} from "./cmdregister"


const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
    ]
})

const rest = new REST({version: "9"}).setToken(env.DISCORD_TOKEN)
export const connect = async () => client.login(env.DISCORD_TOKEN)


client.on("ready", async () => {
    console.info("Client connected to Discord successfully!")
    await registerGuild(rest, env.DISCORD_APP_ID, env.DISCORD_GUILD_ID)
})

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;
    await interaction.reply("sì")
})

