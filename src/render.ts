import {AxiosError} from "axios"
import {ColorResolvable, MessageEmbed} from "discord.js"
import {AchievementRead, UnlockFull, Alloy} from "./types"

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

export function renderStrawberryTimestamp(timestamp: number, style: string = "f"): string {
    return `<t:${Math.floor(timestamp)}:${style}>`
}

export function renderMultilineSpoiler(str: string): string {
    return str.split("\n").map(line => `||${line}||`).join("\n")
}

export function renderMultilineDescription(description: string, secret: boolean): string {
    if(secret) {
        return renderMultilineSpoiler(description)
    }
    else {
        return description
    }
}

export function renderMultilineCode(text: string, language: string = ""): string {
    return `\`\`\`${language}\n${text}\n\`\`\``
}

export function renderCrystalField(crystal: string): string {
    return `:crystal_ball: \`${crystal}\``
}

export function renderAlloyField(alloy: Alloy): string {
    return `${ALLOY_EMOJIS[alloy]} ${ALLOY_NAMES[alloy]}`
}

export function renderRepeatableField(repeatable: boolean): string {
    if(repeatable) {
        return ":repeat_one: Yes"
    }
    else {
        return ":one: No"
    }
}

export function renderSecretField(secret: boolean): string {
    if(secret) {
        return ":key: Yes"
    }
    else {
        return ":newspaper: No"
    }
}

export function renderAchievementEmbed(achievement: AchievementRead, full: boolean): MessageEmbed {
    let embed = new MessageEmbed()

    embed = embed.setTitle(achievement.name)
    embed = embed.setColor(ALLOY_COLORS[achievement.alloy])
    embed = embed.setDescription(renderMultilineDescription(achievement.description, achievement.secret))

    if(full) {
        embed = embed.addField("Crystal", renderCrystalField(achievement.crystal), true)
        embed = embed.addField("Alloy", renderAlloyField(achievement.alloy), true)
        embed = embed.addField("Repeatable", renderRepeatableField(achievement.repeatable), true)
        embed = embed.addField("Secret", renderSecretField(achievement.secret), true)
    }

    return embed
}


export function renderUnlockEmbed(unlock: UnlockFull) {
    const achievement = unlock.achievement

    let embed = renderAchievementEmbed(achievement, false)

    embed.addField("Unlocked by", `:bust_in_silhouette: <@${unlock.user.crystal}>`, true)
    embed.addField("Unlocked on", `:clock3: ${renderStrawberryTimestamp(unlock.timestamp, "d")}`, true)

    return embed
}


export function renderImpressiveError(error: AxiosError): string {
    console.warn(`[Render/ImpressiveError] Error: ${error}`)
    return `:warning: ${error}`
}
