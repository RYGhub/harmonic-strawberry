import {REST} from "@discordjs/rest"
import {Routes, Snowflake} from "discord-api-types/v9"
import {default as cmdList} from "./cmddfn"


async function registerGuild(rest: REST, applicationId: Snowflake, guildId: Snowflake): Promise<void> {
    await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
        body: cmdList.map(cmd => cmd.toJSON()),
    })
}

async function registerGlobal(rest: REST, applicationId: Snowflake): Promise<void> {
    await rest.put(Routes.applicationCommands(applicationId), {
        body: cmdList.map(cmd => cmd.toJSON()),
    })
}
