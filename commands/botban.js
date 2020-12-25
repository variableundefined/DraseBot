const validator = require('validator');
const ban = require('../modules/banUtility');
const perm = require('../modules/permissionCheck');

module.exports = {
    name: 'botban',
    args: true,
    staffOnly: true,
    guildOnly: true,
    usage: `[ban/unban/isbanned] [userID]`,
    description: 'Ban, Unban or check if a user is banned from using the bot',
    async execute(message, args) {
        const validSubCommands = ['ban', 'unban', 'isbanned'];

        let subCom = args[0].toLowerCase();
        let userID = args[1];

        if(!validator.isIn(subCom, validSubCommands)){
            return message.channel.send(`Valid arguments are ${validSubCommands}`);
        }

        if(!userID) return message.channel.send(`An ID is required!`);

        if(!validator.isInt(userID)) return message.channel.send(`${userID} is not a valid ID!`);

        switch(subCom){
            case 'ban':
                if(perm.isBotOwner(userID)){
                    return message.channel.send(`Nice try.`);
                }

                if(await ban.isBanned(userID)) return message.channel.send(`User ${userID} is already banned!`);
                let banSuccess = await ban.ban(userID);
                if(banSuccess){
                    return message.channel.send(`User ${userID} is now banned!`);
                } else{
                    return message.channel.send(`I was unable to ban user ${userID}`);
                }
                break;
            case 'unban':
                if(!await ban.isBanned(userID)) return message.channel.send(`User ${userID} is not banned!`);
                let unbanSuccess = await ban.unban(userID);
                if(unbanSuccess){
                    return message.channel.send(`User ${userID} is now unbanned!`);
                } else{
                    return message.channel.send(`I was unable to unban user ${userID}`);
                }
                break;
            case 'isbanned':
                let isBanned = await ban.isBanned(userID);
                return message.channel.send(`User ${userID} is ${isBanned ? 'banned': 'not banned!'}`)
                break;
        }



    }
}