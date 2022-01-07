import {CommandInteraction} from "discord.js"


export function handleCommand(interaction: CommandInteraction): void {
    switch(interaction.commandName) {
        case "setup": handleSetup(interaction); break;
        case "list": handleList(interaction); break;
        case "create": handleCreate(interaction); break;
        case "edit": handleEdit(interaction); break;
        case "delete": handleDelete(interaction); break;
        case "view": handleView(interaction); break;
        case "unlock": handleUnlock(interaction); break;
        case "relock": handleRelock(interaction); break;
    }
}

function handleSetup(interaction: CommandInteraction): void {
    
}

function handleList(interaction: CommandInteraction): void {

}

function handleCreate(interaction: CommandInteraction): void {

}

function handleEdit(interaction: CommandInteraction): void {

}

function handleDelete(interaction: CommandInteraction): void {

}

function handleView(interaction: CommandInteraction): void {

}

function handleUnlock(interaction: CommandInteraction): void {

}

function handleRelock(interaction: CommandInteraction): void {

}
