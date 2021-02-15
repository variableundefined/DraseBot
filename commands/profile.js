const Discord = require('discord.js');
const db = require('../modules/userUtility');
const eco = require('../modules/economyUtility');
const char = require('../modules/charUtility');
const du = require('../modules/discordUtility');
const validator = require('validator');

module.exports = {
    name: 'profile',
    cooldown: 5,
    guildOnly: true,
    approvedOnly: true,
    usage: "[User ID (Optional)]",
    description: 'If used with no argument, it give you your own profile and register one for you if you have none, ' +
        'If used with one argument (A User ID), it give you their profile, if they have one',
    async execute(message, args) {
        let np, up = "NOT FOUND";
        let profileID;
        let pfp;
        let name = 'User not found';

        // The user did not give any argument
        if(!args[0]){
            profileID = message.author.id;
            let user = await db.findUser(profileID);
            if(!user){
                user = await db.createUser(profileID);
            }
            name = message.author.username;
            pfp = message.author.displayAvatarURL();
            np = user.np;
            up = user.up;
        } else {
            let usrID = args[0];

            let myUser = await du.retrieveUser(message, usrID);
            if(!myUser){
                return message.channel.send("Unable to find a user with this ID on Discord!")
            }

            let user = await db.findUser(myUser.id)
            if(!user){
                message.channel.send("Unable to find user in database. Creating a profile for them.");
                user = await db.createUser(myUser.id);
            }

            name = myUser.username;
            profileID = user.id;
            np = user.np;
            up = user.up;

            pfp = myUser.displayAvatarURL();

        }

        const profile = new Discord.MessageEmbed()
            .setColor('#c0d0ff')
            .setTitle(`${name}`)
            .setDescription(`${name}'s profile and characters!`)
            .setThumbnail(pfp)
            .addFields(
                {name: 'ID', value: profileID},
                {name: 'Upgrade Point', value: up, inline: true},
                {name: 'Nitro Boosts', value: np, inline: true},
                {name: '\u200B', value: '\u200B', inline: true},
            );

        const charCount = await char.userCharCount(profileID);
        const allChars = await char.allUserChars(profileID);

        let charNames = `\u200B`;
        let charUP = `\u200B`;
        let charMoney = `\u200B`;

        if(allChars){
            allChars.forEach((char, index) => {
                charNames += `**(#${char.id})** ${char.name}\n`
                charUP += `${char.UsedUP} / ${char.TotalUP}\n`

                let EO = eco.silverToGS(char.EFund);
                let AO = eco.silverToGS(char.AFund);

                let EFundString = `${EO.g} G`
                let AFundString = `${AO.g} G`

                charMoney += `${EFundString} | ${AFundString} \n`
            })
        }

        profile.addField('Character Limit', `${charCount} / 12`);
        if(charCount){
            profile.addField('Char Name & ID', `${charNames}`, true);
            profile.addField(`UP`, `${charUP}`, true);
            profile.addField(`Approx. Fund (E|A)`, `${charMoney}`, true);
        }

        message.channel.send(profile);
    }
}
