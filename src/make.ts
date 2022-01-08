import {AxiosResponse} from "axios"
import {Snowflake} from "discord-api-types/v9"
import {Interaction} from "discord.js"
import {rest as impressiveRest} from "./impressive"
import {GroupFull, UserFull} from "./types"


export async function makeGroup(guildId: Snowflake): Promise<GroupFull> {
    console.debug("[Make/GuildGroup] Getting Impressive group for guild:", guildId)
    let groupResponse: AxiosResponse<GroupFull>

    try {
        groupResponse = await impressiveRest.get<GroupFull>(`/api/group/v1/${guildId}`)
    }
    catch(_) {
        console.debug("[Make/GuildGroup] Group does not exist, creating one now...")
        groupResponse = await impressiveRest.post<GroupFull>(`/api/group/v1/`, {
            crystal: guildId,
        })
    }

    const group = groupResponse.data
    console.debug("[Make/GuildGroup] Created group with uuid:", group.id)

    return group
}


export async function makeUser(userId: Snowflake): Promise<UserFull> {
    console.debug("[Make/UserUser] Getting Impressive user for user:", userId)
    let userResponse: AxiosResponse<UserFull>

    try {
        userResponse = await impressiveRest.get<UserFull>(`/api/user/v1/${userId}`)
    }
    catch(_) {
        console.debug("[Make/UserUser] User does not exist, creating one now...")
        userResponse = await impressiveRest.post<UserFull>(`/api/user/v1/`, {
            crystal: userId,
        })
    }

    const user = userResponse.data
    console.debug("[Make/UserUser] Created user with uuid:", user.id)

    return user
}
