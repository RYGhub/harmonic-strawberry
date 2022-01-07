"use strict";
exports.__esModule = true;
exports.relock = exports.unlock = exports.view = exports.delete_ = exports.edit = exports.create = exports.list = exports.setup = void 0;
var builders_1 = require("@discordjs/builders");
exports.setup = new builders_1.SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the Strawberry webhook for this Server.")
    .setDefaultPermission(true)
    .addChannelOption(function (option) { return option
    .setName("channel")
    .setDescription("The channel where achievement notifications should be sent in.")
    .setRequired(true)
    .addChannelType(0 /* GuildText */)
    .addChannelType(5 /* GuildNews */); })
    .addRoleOption(function (option) { return option
    .setName("role")
    .setDescription("The role that users must have to administrate achievements.")
    .setRequired(true); });
exports.list = new builders_1.SlashCommandBuilder()
    .setName("list")
    .setDescription("List all achievements.")
    .setDefaultPermission(false);
exports.create = new builders_1.SlashCommandBuilder()
    .setName("create")
    .setDescription("Create a new achievement.")
    .setDefaultPermission(false)
    .addStringOption(function (option) { return option
    .setName("crystal")
    .setDescription("The ID of the achievement. Must be unique on this server.")
    .setRequired(true); })
    .addStringOption(function (option) { return option
    .setName("name")
    .setDescription("The name of the achievement.")
    .setRequired(true); })
    .addStringOption(function (option) { return option
    .setName("description")
    .setDescription("A long form description of the achievement.")
    .setRequired(true); })
    .addStringOption(function (option) { return option
    .setName("alloy")
    .setDescription("The importance of the achievement.")
    .setRequired(true)
    .setChoices([
    ["🥉 Bronze", "BRONZE"],
    ["🥈 Silver", "SILVER"],
    ["🥇 Gold", "GOLD"]
]); })
    .addBooleanOption(function (option) { return option
    .setName("secret")
    .setDescription("Whether the achievement description should be spoiler-tagged or not.")
    .setRequired(true); })
    .addBooleanOption(function (option) { return option
    .setName("repeatable")
    .setDescription("Whether the achievement can be repeatedly unlocked or not.")
    .setRequired(true); });
exports.edit = new builders_1.SlashCommandBuilder()
    .setName("edit")
    .setDescription("Edit an existing achievement.")
    .setDefaultPermission(false)
    .addStringOption(function (option) { return option
    .setName("crystal")
    .setDescription("The ID of the achievement to edit.")
    .setRequired(true); })
    .addStringOption(function (option) { return option
    .setName("name")
    .setDescription("The new name of the achievement.")
    .setRequired(false); })
    .addStringOption(function (option) { return option
    .setName("description")
    .setDescription("The new description of the achievement.")
    .setRequired(false); })
    .addStringOption(function (option) { return option
    .setName("alloy")
    .setDescription("The new alloy of the achievement.")
    .setRequired(false)
    .setChoices([
    ["🥉 Bronze", "BRONZE"],
    ["🥈 Silver", "SILVER"],
    ["🥇 Gold", "GOLD"]
]); })
    .addBooleanOption(function (option) { return option
    .setName("secret")
    .setDescription("The new secrecy value of the achievement.")
    .setRequired(false); })
    .addBooleanOption(function (option) { return option
    .setName("repeatable")
    .setDescription("The new repeatability value of the achievement. (Previous unlocks won't be reversed.)")
    .setRequired(true); });
exports.delete_ = new builders_1.SlashCommandBuilder()
    .setName("delete")
    .setDescription("Delete an existing achievement, and all its associated unlocks.")
    .setDefaultPermission(false)
    .addStringOption(function (option) { return option
    .setName("crystal")
    .setDescription("The ID of the achievement to delete.")
    .setRequired(true); });
exports.view = new builders_1.SlashCommandBuilder()
    .setName("view")
    .setDescription("View all unlocks of a certain user, or your own if no user is specified.")
    .setDefaultPermission(false)
    .addUserOption(function (option) { return option
    .setName("user")
    .setDescription("The user to view the unlocks of.")
    .setRequired(false); });
exports.unlock = new builders_1.SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock an achievement for an user.")
    .setDefaultPermission(false)
    .addUserOption(function (option) { return option
    .setName("user")
    .setDescription("The user that should unlock the achievement.")
    .setRequired(true); })
    .addStringOption(function (option) { return option
    .setName("crystal")
    .setDescription("The ID of the achievement to unlock.")
    .setRequired(true); });
exports.relock = new builders_1.SlashCommandBuilder()
    .setName("relock")
    .setDescription("Undo the latest unlock of an achievement for an user.")
    .setDefaultPermission(false)
    .addUserOption(function (option) { return option
    .setName("user")
    .setDescription("The user to undo the unlock of.")
    .setRequired(true); })
    .addStringOption(function (option) { return option
    .setName("crystal")
    .setDescription("The ID of the unlocked achievement.")
    .setRequired(true); });
exports["default"] = [
    exports.setup,
    exports.list,
    exports.create,
    exports.edit,
    exports.delete_,
    exports.view,
    exports.unlock,
    exports.relock,
];
