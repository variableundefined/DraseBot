const Discord = require('discord.js');
const char = require('../modules/charUtility.js');
const num = require('../modules/numberUtility');
const eco = require('../modules/economyUtility');
const perm = require('../modules/permissionCheck');
const validator = require('validator');

module.exports = {
    name: 'char',
    args: true,
    cooldown: 1,
    approvedOnly: true,
    guildOnly: true,
    usage: `[subcommand] [remaining arguments] \nAvailable Subcommands:` +
        `\nset [charID] [name/Occupation/GSheet] [value]` +
        `\nprofile [charID]` +
        `\nprofilef [charID]` +
        `\naddfund [charID] [a/e] [value]` +
        `\naddincome [charID] [value]` +
        `\naddup [charID] [value]` +
        `\nuseup [charID] [value]`,
    description: 'Get argument info',
    async execute(message, args) {
        const validSubCommands = ['del', 'set', 'assoc', 'profile', 'profilef', 'addfund', 'addup', 'useup', 'addincome'];
        let subCom = args[0];
        let charStr = args[1];


        if(!validator.isIn(subCom, validSubCommands)){
            return message.channel.send(`${subCom} is not a valid subcommand, valid subcommands are \`${validSubCommands}\``);
        }

        if(!validator.isInt(charStr) && (charStr.length < 3 || charStr.length > 50)){
            return message.channel.send(`CharID must be either a name between 3 to 50 chars in length, or an integer!`);
        }

        let character = await char.resolveChar(charStr);

        if(!character || character.length === 0){
            return message.channel.send(`Character with ID/Name ${charStr} not found`);
        }else if(Array.isArray(character)) {
            if (character.length > 1) {
                return message.channel.send(char.disambiguateChars(character));
            } else {
                character = character[0];
            }
        }

        if((message.author.id !== character.userID) && !(await perm.isStaff(message))){
            return message.channel.send(`Only staff can modify other people's character!`);
        }

        switch(subCom){
            case 'del':
                return message.channel.send(`${subCom} has not been implemented yet!`);
                break;
            case 'set':
                return setChar(message, character, args[2], args[3]);
                break;
            case 'assoc':
                return message.channel.send(`${subCom} has not been implemented yet!`);
                break;
            case 'addup':
                return addNumber(message, character, args[2], 'TotalUP');
                break;
            case 'useup':
                return addNumber(message, character, args[2], 'UsedUP');
                break;
            case 'addfund':
                switch(args[2]){
                    case 'a':
                        return addNumber(message, character, args[3], 'AFund');
                        break;
                    case 'e':
                        return addNumber(message, character, args[3], 'EFund');
                        break;
                    default:
                        return message.channel.send(`Acceptable 2nd argument are: a, e`);
                }
                return
                break;
            case 'addincome':
                return addNumber(message, character, args[2], 'Income');
                break;
            case 'profile':
                return profile(message, character);
                break;
            case 'profilef':
                return profile(message, character, true);
                break;
            case 'claim':
                return message.channel.send(`${subCom} has not been implemented yet!`);
                break;
        }
    }
}

async function profile(message, character, fancy = false){
    let a = eco.copperToGSC(character.AFund);
    let e = eco.copperToGSC(character.EFund);

    let aStr = `${a.g} G ${a.s} S`;
    let eStr = `${e.g} G ${e.s} S`;
    let inStr = `${eco.copperToSilver(character.Income)} S`

    if(!fancy){
        return message.channel.send(`**CharID:** ${character.id}\n**userID:** ${character.userID} \n**Name:** ${character.name}\n` +
            `**Equipment Funds:** ${eStr} \n**Asset Funds:** ${aStr} \n**UP:** ${character.UsedUP} **|** ${character.TotalUP} \n` +
            `**Occupation:** ${character.Occupation} \n**GSheet:** ${character.GSheet} \n**Income:** ${inStr}\n`);
    } else{
        const profile = new Discord.MessageEmbed()
            .setColor('#c0d0ff')
            .setTitle(`${character.name}`)
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(`${character.name}'s wallet & profile!`)
            .addFields(
                {name: 'Owned by:', value: character.userID},
                {name: 'EFund', value: eStr, inline: true},
                {name: 'AFund', value: aStr, inline: true},
                {name: 'UPs:', value: `${character.UsedUP} / ${character.TotalUP}`},
                {name: 'Occupation:', value: `${character.Occupation}`, inline: true},
                {name: 'Income:', value: `${inStr}`, inline: true},
                {name: 'Google Sheet:', value: `${character.GSheet}`},
            );
        return message.channel.send(profile);
    }
}

async function setChar(message, oldCharacter, field, value){
    const validFields = ['name', 'Occupation', 'GSheet'];


    if(!field || !validator.isIn(field, validFields)){
        return message.channel.send(`Argument ${field} invalid. Allowed arguments are ${validFields}`);
    }

    if(!value){
        return message.channel.send(`No value provided`);
    }

    let charID = oldCharacter.id;

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

async function addNumber(message, oldCharacter, value, field){
    const validFields = ['Income', 'AFund', 'EFund', 'UsedUP', 'TotalUP'];

    let charID = oldCharacter.id;

    if(!validator.isIn(field, validFields)){
        return message.channel.send('Field invalid');
    }

    if(validator.isIn(field, ['UsedUP', 'TotalUP'])){
        if(!num.upSafe(value, true)){
            return message.channel.send(`UP number does not meet constraints`);
        }
    } else {
        if (!num.fundSafe(value, true)) {
            return message.channel.send(`Fund/Income number does not meet constraints`);
        }
    }

    value = Number(value);

    switch(field){
        case 'AFund':
            if(!num.fundSafe(oldCharacter.AFund + value)) {
                return message.channel.send(`New AFund invalid`);
            }
            let character = await char.updateCharNumber(charID, field, value, true);
            if(character){
                return message.channel.send(`${character.name}'s AFund has been changed from ${oldCharacter.AFund} to ${character.AFund}`);
            } else{
                return message.channel.send(`I was unable to update the AFund for some reason`);
            }
        break;
        case 'EFund':
            if(!num.fundSafe(oldCharacter.EFund + value)) {
                return message.channel.send(`New EFund invalid`);
            }
            let char2 = await char.updateCharNumber(charID, field, value, true);
            if(char2){
                return message.channel.send(`${char2.name}'s EFund has been changed from ${oldCharacter.EFund} to ${char2.EFund}`);
            } else{
                return message.channel.send(`I was unable to update the EFund for some reason`);
            }
        break;
        case 'Income':
            if(!num.fundSafe(oldCharacter.Income + value)) {
                return message.channel.send(`New Income invalid`);
            }
            let char3 = await char.updateCharNumber(charID, field, value, true);
            if(char3){
                return message.channel.send(`${char3.name}'s Income has been changed from ${oldCharacter.Income} to ${char3.Income}`);
            } else{
                return message.channel.send(`I was unable to update the EFund for some reason`);
            }
            break;
        case 'UsedUP':
            if(!num.upSafe(oldCharacter.UsedUP + value)) {
                return message.channel.send(`New Used UP invalid`);
            }
            let char4 = await char.updateCharNumber(charID, field, value, true);
            if(char4){
                return message.channel.send(`${char4.name}'s Used UP has been changed from ${oldCharacter.UsedUP} to ${char4.UsedUP}`);
            } else{
                return message.channel.send(`I was unable to update the used UP for some reason`);
            }
            break;
        case 'TotalUP':
            if(!num.upSafe(oldCharacter.TotalUP + value)) {
                return message.channel.send(`New Total UP invalid`);
            }
            let char5 = await char.updateCharNumber(charID, field, value, true);
            if(char5){
                return message.channel.send(`${char5.name}'s Total UP has been changed from ${oldCharacter.TotalUP} to ${char5.TotalUP}`);
            } else{
                return message.channel.send(`I was unable to update the Total UP for some reason`);
            }
            break;
    }
}