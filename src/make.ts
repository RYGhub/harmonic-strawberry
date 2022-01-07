import {AxiosResponse} from "axios"
import {Interaction} from "discord.js"
import {rest as impressiveRest} from "./impressive"
import {GroupFull, UserFull} from "./types"


export async function makeGuildGroup(interaction: Interaction): Promise<GroupFull> {
    console.debug("[Make/GuildGroup] Getting Impressive group for guild:", interaction.guildId)
    let groupResponse: AxiosResponse<GroupFull>

    try {
        groupResponse = await impressiveRest.get<GroupFull>(`/api/group/v1/${interaction.guildId}`)
    }
    catch(_) {
        console.debug("[Make/GuildGroup] Group does not exist, creating one now...")
        groupResponse = await impressiveRest.post<GroupFull>(`/api/group/v1/`, {
            crystal: interaction.guildId,
        })
    }

    const group = groupResponse.data
    console.debug("[Make/GuildGroup] Created group with uuid:", group.id)

    return group
}


export async function makeUserUser(interaction: Interaction): Promise<UserFull> {
    console.debug("[Make/UserUser] Getting Impressive user for user:", interaction.user.id)
    let userResponse: AxiosResponse<UserFull>

    try {
        userResponse = await impressiveRest.get<UserFull>(`/api/user/v1/${interaction.user.id}`)
    }
    catch(_) {
        console.debug("[Make/UserUser] User does not exist, creating one now...")
        userResponse = await impressiveRest.post<UserFull>(`/api/user/v1/`, {
            crystal: interaction.guildId,
        })
    }

    const user = userResponse.data
    console.debug("[Make/UserUser] Created user with uuid:", user.id)

    return user
}
