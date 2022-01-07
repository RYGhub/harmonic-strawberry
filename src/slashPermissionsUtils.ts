import {Snowflake} from "discord-api-types"
import {GuildApplicationCommandPermissionData} from "discord.js"
import {ApplicationCommandPermissionTypes} from "discord.js/typings/enums"


export function createEmptyPermission(cmdId: Snowflake): GuildApplicationCommandPermissionData {
    return {
        id: cmdId,
        permissions: [],
    }
}

export function createRolePermission(cmdId: Snowflake, roleId: Snowflake): GuildApplicationCommandPermissionData {
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