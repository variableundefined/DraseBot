const Discord = require('discord.js');
const db = require('../modules/dbUtility');
const char = require('../modules/charUtility.js');
const num = require('../modules/numberUtility');
const validator = require('validator');

module.exports = {
    name: 'char',
    args: true,
    cooldown: 1,
    approvedOnly: true,
    guildOnly: true,
    usage: `[subcommand] [remaining arguments] \nAvailable Subcommands:` +
        `\nadd [userID] [name] [EFund] [AFund] [UsedUP] [TotalUP] [Occupation] [GSheet Link] [Income]`+
        `\nset [charID] [name/Occupation/GSheet] [value]` +
        `\nprofile [charID]` +
        `\nprofilef [charID]` +
        `\naddmoney [charID] [a/e/b] [value]` +
        `\naddincome [charID] [value]` +
        `\naddup [charID] [value]` +
        `\nuseup [charID] [value]` +
        `\nlist [playerID]`,
    description: 'Get argument info',
    async execute(message, args) {
        const validSubCommands = ['add', 'del', 'set', 'assoc', 'list', 'profile', 'profilef', 'addmoney', 'addup', 'useup', 'addincome', 'claim'];
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
                return setChar(message, args[1], args[2], args[3]);
                break;
            case 'assoc':
                return message.channel.send(`${subCom} has not been implemented yet!`);
                break;
            case 'addup':
                return message.channel.send(`${subCom} has not been implemented yet!`);
                break;
            case 'addmoney':
                return message.channel.send(`${subCom} has not been implemented yet!`);
                break;
            case 'addincome':
                return message.channel.send(`${subCom} has not been implemented yet!`);
                break;
            case 'list':
                return message.channel.send(`${subCom} has not been implemented yet!`);
                break;
            case 'profile':
                return profile(message, args);
                break;
            case 'profilef':
                return profile(message, args, true);
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
    } else{
        return message.channel.send(`Searching by character name is not yet implemented.`);
    }

    if(!character){
        return message.channel.send(`Sorry, there's no character in the database with the name or ID of ${arg1}`);
    }

    if(!fancy){
        return message.channel.send(`**CharID:** ${character.id}\n**userID:** ${character.userID} \n**Name:** ${character.name}\n` +
            `**Equipment Funds:** ${character.EFund} \n**Asset Funds:** ${character.AFund} \n**UP:** ${character.UsedUP} **|** ${character.TotalUP} \n` +
            `**Occupation:** ${character.Occupation} \n**GSheet:** ${character.GSheet} \n**Income:** ${character.Income} **C** \n`);
    } else{
        const profile = new Discord.MessageEmbed()
            .setColor('#c0d0ff')
            .setTitle(`${character.name}`)
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(`${character.name}'s wallet & profile!`)
            .addFields(
                {name: 'Owned by:', value: character.userID},
                {name: 'EFund', value: character.EFund, inline: true},
                {name: 'AFund', value: character.AFund, inline: true},
                {name: 'UPs:', value: `${character.UsedUP} / ${character.TotalUP}`},
                {name: 'Occupation:', value: `${character.Occupation}`, inline: true},
                {name: 'Income:', value: `${character.Income}`, inline: true},
                {name: 'Google Sheet:', value: `${character.GSheet}`},
            );
        return message.channel.send(profile);
    }
}

async function setChar(message, charID, field, value){
    const validFields = ['name', 'Occupation', 'GSheet'];

    if(!validator.isIn(field, validFields)){
        return message.channel.send(`Argument ${field} invalid. Allowed arguments are ${validFields}`);
    }

    if(!validator.isInt(charID)){
        return message.channel.send(`${charID} is not a valid ID!`);
    }
    charID = Number(charID);

    let oldCharacter = await char.findCharByID(charID);

    if(!oldCharacter){
        return message.channel.send(`No character with this ID ${charID} found`);
    }

    message.channel.send(`Attempting to modify ${charID}'s ${field} to ${value}`);

    switch(field){
        case 'name':
            if(!validator.isLength(value, {min:3, max:50})) return message.channel.send(`Name: **${name}**'s length is below 3 or above 50`);
            let character = await char.updateCharField(charID, field, value);
            if(!character){
                return message.channel.send(`Unable to update character`);
            } else{
                return message.channel.send(`${oldCharacter.name}'s name has been changed to ${character.name}`);;
            }
            break;
        case 'Occupation':
            if(!validator.isLength(value, {min:3, max:30})) return message.channel.send(`Occupation: **${value}**'s length is below 3 or above 30`);
            let character2 = await char.updateCharField(charID, field, value);
            if(!character2){
                return message.channel.send(`Unable to update character`);
            } else{
                return message.channel.send(`${oldCharacter.name}'s occupation has been changed from ${oldCharacter.Occupation} to ${character2.Occupation}`);;
            }
            break;
        case 'GSheet':
            if(!validator.isURL(value)) return message.channel.send(`GSheet: ${value} is not a valid URL!`);
            let character3 = await char.updateCharField(charID, field, value);
            if(!character3){
                return message.channel.send(`Unable to update character`);
            } else{
                return message.channel.send(`${oldCharacter.name}'s google sheet has been changed from ${oldCharacter.GSheet} to ${character3.GSheet}`);;
            }
            break;
    }
}