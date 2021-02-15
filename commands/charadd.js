const db = require('../modules/userUtility');
const char = require('../modules/charUtility.js');
const num = require('../modules/numberUtility');
const perm = require('../modules/permissionCheck');
const dis = require('../modules/discordUtility');
const validator = require('validator');

module.exports = {
    name: 'charadd',
    args: true,
    cooldown: 5,
    approvedOnly: true,
    guildOnly: true,
    usage: `\n [userID] [name] [EFund] [AFund] [UsedUP] [TotalUP] [Occupation] [GSheet Link] [Income]`,
    description: 'Get argument info',
    async execute(message, args) {
        let target = await dis.retrieveUser(message, args[0]);

        if(!target){
            return message.channel.send("User ID / Mention invalid!");
        }

        let isStaff = await perm.isStaff(message);
        if(!perm.isSameUser(message, target.id)){
            if(!isStaff){
                return message.channel.send(`Only staff are allowed to add characters to someone else`);
            }
        }
        return addChar(message, target.id, args[1], args[2],
            args[3], args[4], args[5], args[6], args[7], args[8]);
    }
}


async function addChar(message, userID, name, EFund, AFund, UsedUP, TotalUP, Occupation, GSheet, Income){
    // let userID, name, EFund, AFund, UsedUP, TotalUP, Occupation, GSheet, Income;
    // [userID, name, EFund, AFund, UsedUP, TotalUP, Occupation, GSheet, Income] = args;

    if(!userID || !validator.isInt(userID)) return message.channel.send(`${userID} is not a valid ID!`);

    if(!name || !validator.isLength(name, {min:3, max:50})) return message.channel.send(`Name: **${name}**'s length is below 3 or above 50`);

    if(!num.fundSafe(EFund) || !num.fundSafe(AFund)){
        return message.channel.send(`Fund must be an integer above 0 and below ${Number.MAX_SAFE_INTEGER}`);
    }

    if(!num.upSafe(UsedUP) || !num.upSafe(TotalUP)){
        return message.channel.send(`UP must be above 0, below 500 and an integer.`);
    }

    if(!Occupation || !validator.isLength(Occupation, {min:3, max:30})) return message.channel.send(`Occupation: **${Occupation}**'s length is below 3 or above 30`);

    if(!GSheet || !validator.isURL(GSheet)) return message.channel.send(`GSheet: ${GSheet} is not a valid URL!`);

    if(!num.fundSafe(Income)) return message.channel.send(`Income must be an integer above 0 and below ${Number.MAX_SAFE_INTEGER}`);

    let user = await db.findUser(userID);

    if(!user){
        return message.channel.send(`UserID ${userID} was not found in the database, please create a profile for them before giving them a character.`);
    }

    if(await char.userCharCount(userID) >= 12){
        return message.channel.send(`User has more than 12 characters. You may not add another.`);
    }

    let character = await char.createCharacter(userID, name, EFund, AFund, UsedUP, TotalUP, Occupation, GSheet, Income);

    console.log(character);

    if(character){
        return message.channel.send(`Character created with \n**CharID:** ${character.id}\n**userID:** ${userID} \n**Name:** ${name}\n` +
            `**Equipment Funds:** ${EFund} \n**Asset Funds:** ${AFund} \n**UP:** ${UsedUP} **|** ${TotalUP} \n` +
            `**Occupation:** ${Occupation} \n**GSheet:** ${GSheet} \n**Income:** ${Income} **S** \n`)
    }else{
        return message.channel.send(`Character creation failed.`);
    }
};