import {REST} from "@discordjs/rest"
import {Routes, Snowflake} from "discord-api-types/v9"
import {ApplicationCommand} from "discord.js"
import {default as cmdList} from "./cmddfn"


export async function registerGuild(rest: REST, applicationId: Snowflake, guildId: Snowflake): Promise<ApplicationCommand[]> {
    console.info("Registering commands as **guild** for", applicationId, "in guild", guildId)

    const result = await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
        body: cmdList.map(cmd => cmd.toJSON()),
    }) as ApplicationCommand[]

    console.info("Registration complete!")

    return result
}

export async function registerGlobal(rest: REST, applicationId: Snowflake): Promise<ApplicationCommand[]> {
    console.info("Registering commands as **global** for", applicationId)

    const result = await rest.put(Routes.applicationCommands(applicationId), {
        body: cmdList.map(cmd => cmd.toJSON()),
    }) as ApplicationCommand[]

    console.info("Registration complete!")

    return result
}
