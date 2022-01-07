import {REST} from "@discordjs/rest"
import {Routes, Snowflake} from "discord-api-types/v9"
import {default as cmdList} from "./cmddfn"


async function registerGuild(rest: REST, applicationId: Snowflake, guildId: Snowflake): Promise<void> {
    console.info("Registering commands as **guild** for", applicationId, "in guild", guildId)

    await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
        body: cmdList.map(cmd => cmd.toJSON()),
    })

    console.info("Registration complete!")
}

async function registerGlobal(rest: REST, applicationId: Snowflake): Promise<void> {
    console.info("Registering commands as **global** for", applicationId)

    await rest.put(Routes.applicationCommands(applicationId), {
        body: cmdList.map(cmd => cmd.toJSON()),
    })

    console.info("Registration complete!")
}
