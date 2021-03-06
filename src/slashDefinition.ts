import {SlashCommandBuilder} from "@discordjs/builders"


export const setup = new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the Strawberry webhook for this Server.")
    .setDefaultPermission(true)
    .addChannelOption(option => option
        .setName("channel")
        .setDescription("The channel where achievement notifications should be sent in.")
        .setRequired(true)
        .addChannelType(0)
        .addChannelType(5)
    )
    .addRoleOption(option => option
        .setName("role")
        .setDescription("The role that users must have to administrate achievements.")
        .setRequired(true)
    )


export const list = new SlashCommandBuilder()
    .setName("list")
    .setDescription("List all achievements.")
    .setDefaultPermission(false)


export const create = new SlashCommandBuilder()
    .setName("create")
    .setDescription("Create a new achievement.")
    .setDefaultPermission(false)
    .addStringOption(option => option
        .setName("crystal")
        .setDescription("The ID of the achievement. Must be unique on this server.")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("name")
        .setDescription("The name of the achievement.")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("description")
        .setDescription("A long form description of the achievement.")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("alloy")
        .setDescription("The importance of the achievement.")
        .setRequired(true)
        .setChoices([
            ["🥉 Bronze", "BRONZE"],
            ["🥈 Silver", "SILVER"],
            ["🥇 Gold", "GOLD"]
        ])
    )
    .addBooleanOption(option => option
        .setName("secret")
        .setDescription("Whether the achievement description should be spoiler-tagged or not.")
        .setRequired(true)
    )
    .addBooleanOption(option => option
        .setName("repeatable")
        .setDescription("Whether the achievement can be repeatedly unlocked or not.")
        .setRequired(true)
    )


export const edit = new SlashCommandBuilder()
    .setName("edit")
    .setDescription("Edit an existing achievement.")
    .setDefaultPermission(false)
    .addStringOption(option => option
        .setName("crystal")
        .setDescription("The ID of the achievement to edit.")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("name")
        .setDescription("The new name of the achievement.")
        .setRequired(false)
    )
    .addStringOption(option => option
        .setName("description")
        .setDescription("The new description of the achievement.")
        .setRequired(false)
    )
    .addStringOption(option => option
        .setName("alloy")
        .setDescription("The new alloy of the achievement.")
        .setRequired(false)
        .setChoices([
            ["🥉 Bronze", "BRONZE"],
            ["🥈 Silver", "SILVER"],
            ["🥇 Gold", "GOLD"]
        ])
    )
    .addBooleanOption(option => option
        .setName("secret")
        .setDescription("The new secrecy value of the achievement.")
        .setRequired(false)
    )
    .addBooleanOption(option => option
        .setName("repeatable")
        .setDescription("The new repeatability value of the achievement. (Previous unlocks won't be reversed.)")
        .setRequired(false)
    )


export const delete_ = new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Delete an existing achievement, and all its associated unlocks.")
    .setDefaultPermission(false)
    .addStringOption(option => option
        .setName("crystal")
        .setDescription("The ID of the achievement to delete.")
        .setRequired(true)
    )


export const view = new SlashCommandBuilder()
    .setName("view")
    .setDescription("View all unlocks of a certain user, or your own if no user is specified.")
    .setDefaultPermission(false)
    .addUserOption(option => option
        .setName("user")
        .setDescription("The user to view the unlocks of.")
        .setRequired(false)
    )


export const unlock = new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock an achievement for an user.")
    .setDefaultPermission(false)
    .addUserOption(option => option
        .setName("user")
        .setDescription("The user that should unlock the achievement.")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("crystal")
        .setDescription("The ID of the achievement to unlock.")
        .setRequired(true)
    )


export default [
    setup,
    list,
    create,
    edit,
    delete_,
    view,
    unlock,
]
