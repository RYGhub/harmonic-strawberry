import {AxiosError} from "axios"
import {ColorResolvable, MessageEmbed} from "discord.js"
import {AchievementFull} from "./types"

const ALLOY_EMOJIS = {
    "BRONZE": ":third_place:",
    "SILVER": ":second_place:",
    "GOLD": ":first_place:",
}

const ALLOY_NAMES = {
    "BRONZE": "Bronze",
    "SILVER": "Silver",
    "GOLD": "Gold",
}

const ALLOY_COLORS: {[_: string]: ColorResolvable} = {
    "BRONZE": "#ff8a3b",
    "SILVER": "#ccd6dd",
    "GOLD": "#ffac33",
}

export function renderAchievementEmbed(achievement: AchievementFull, full: boolean): MessageEmbed {
    let embed = new MessageEmbed()

    embed = embed.setTitle(achievement.name)

    if(achievement.secret) {
        embed = embed.setDescription(achievement.description.split("\n").map(line => `||${line}||`).join("\n"))
    }
    else {
        embed = embed.setDescription(achievement.description)
    }

    embed = embed.setColor(ALLOY_COLORS[achievement.alloy])

    if(full) {
        embed = embed.addField("Crystal", `:crystal_ball: \`${achievement.crystal}\``, true)

        embed = embed.addField("Alloy", `${ALLOY_EMOJIS[achievement.alloy]} ${ALLOY_NAMES[achievement.alloy]}`, true)

        if(achievement.repeatable) {
            embed = embed.addField("Repeatable", ":repeat_one: Yes", true)
        }
        else {
            embed = embed.addField("Repeatable", ":one: No", true)
        }

        if(achievement.secret) {
            embed = embed.addField("Secret", ":key: Yes", true)
        }
        else {
            embed = embed.addField("Secret", ":newspaper: No", true)
        }
    }

    return embed
}

export function renderImpressiveError(error: AxiosError): string {
    return `:warning: ${error.response.data.reason}`
}
