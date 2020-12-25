const Discord = require('discord.js');
const db = require('../modules/dbUtility');
const char = require('../modules/charUtility.js');
const num = require('../modules/numberUtility');
const validator = require('validator');

module.exports = {
    name: 'char',
    args: true,
    cooldown: 1,
    guildOnly: true,
    usage: `[any number of arguments, separated by space. Enclose in quotations like "Don't Split This Argument" if needed]`,
    description: 'Get argument info',
    async execute(message, args) {
        const validSubCommands = ['add', 'del', 'set', 'assoc', 'list', 'profile', 'claim'];
        let subCom = args[0];

        if(!validator.isIn(subCom, validSubCommands)){
            return message.channel.send(`${subCom} is not a valid subcommand, valid subcommands are \`${validSubCommands}\``);
        }

        switch(subCom){
            case 'add':
                return addChar(message, args);
                break;
            case 'del':
                return message.channel.send(`${subCom} has not been implemented yet!`);
                break;
            case 'set':
                return message.channel.send(`${subCom} has not been implemented yet!`);
                break;
            case 'assoc':
                return message.channel.send(`${subCom} has not been implemented yet!`);
                break;
            case 'list':
                return message.channel.send(`${subCom} has not been implemented yet!`);
                break;
            case 'profile':
                return profile(message, args);
                break;
            case 'claim':
                return message.channel.send(`${subCom} has not been implemented yet!`);
                break;
        }
    }
}

async function addChar(message, args){
    let userID, name, EFund, AFund, UsedUP, TotalUP, Occupation, GSheet, Income;
    [,userID, name, EFund, AFund, UsedUP, TotalUP, Occupation, GSheet, Income] = args;

    if(!validator.isInt(userID)) return message.channel.send(`${userID} is not a valid ID!`);

    if(!validator.isLength(name, {min:3, max:50})) return message.channel.send(`Name: **${name}**'s length is below 3 or above 50`);

    if(!validator.isInt(EFund) || !validator.isInt(AFund)) return message.channel.send(`Equipment or Asset fund is not a valid integer!`);

    if(EFund < 0 || EFund > Number.MAX_SAFE_INTEGER || AFund < 0 || AFund > Number.MAX_SAFE_INTEGER){
        return message.channel.send(`Equipment or Asset fund below zero or above ${Number.MAX_SAFE_INTEGER}`);
    }

    if(num.retr_dec(UsedUP) > 1 || num.retr_dec(TotalUP) > 1){
        return message.channel.send(`Used or Total UP have more than one decimal places!`);
    }

    if(!validator.isLength(Occupation, {min:3, max:30})) return message.channel.send(`Occupation: **${Occupation}**'s length is below 3 or above 30`);

    if(!validator.isURL(GSheet)) return message.channel.send(`GSheet: ${GSheet} is not a valid URL!`);

    if(!validator.isInt(Income)) return message.channel.send(`Income: ${Income} is not a valid integer!`);

    if(Income < 0 || Income > Number.MAX_SAFE_INTEGER) {
        return message.channel.send(`Income below zero or above ${Number.MAX_SAFE_INTEGER}`);
    }

    let user = await db.findUser(userID);

    if(!user){
        return message.channel.send(`UserID ${userID} was not found in the database, please create a profile for them before giving them a character.`);
    }

    let character = await char.createCharacter(userID, name, EFund, AFund, UsedUP, TotalUP, Occupation, GSheet, Income);

    console.log(character);

    if(character){
        return message.channel.send(`Character created with \n**CharID:** ${character.id}\n**userID:** ${userID} \n**Name:** ${name}\n` +
            `**Equipment Funds:** ${EFund} \n**Asset Funds:** ${AFund} \n**UP:** ${UsedUP} **|** ${TotalUP} \n` +
            `**Occupation:** ${Occupation} \n**GSheet:** ${GSheet} \n**Income:** ${Income} **C** \n`)
    }else{
        return message.channel.send(`Character creation failed.`);
    }
};

async function profile(message, args, fancy = false){
    let arg1 = args[1];
    let character;

    // If it is a number, attempt to look up the char immediately, if not, look it up by name
    if(validator.isInt(arg1)){
        let charID = Number(arg1);
        character = await char.findCharByID(charID);
        console.log(character);
    } else{
        return message.channel.send(`Searching by character name is not yet implemented.`);
    }

    if(!fancy){
        return message.channel.send(JSON.stringify(character));
    } else{
        const profile = new Discord.MessageEmbed()
            .setColor('#c0d0ff')
            .setTitle(`${message.author.username}`)
            .setDescription('Your roleplay profile.')
            .setThumbnail(pfp)
            .addFields(
                {name: 'ID', value: profileID},
                {name: 'Upgrade Point', value: up, inline: true},
                {name: 'Nitro Boosts', value: np, inline: true},
            );
    }
}