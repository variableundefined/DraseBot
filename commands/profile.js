const Discord = require('discord.js');
const db = require('../modules/userUtility');
const eco = require('../modules/economyUtility');
const char = require('../modules/charUtility');
const validator = require('validator');

module.exports = {
    name: 'profile',
    cooldown: 5,
    guildOnly: true,
    usage: "[User ID (Optional)]",
    description: 'If used with no argument, it give you your own profile and register one for you if you have none, ' +
        'If used with one argument (A User ID), it give you their profile, if they have one',
    async execute(message, args) {
        let np, up = "NOT FOUND";
        let profileID;
        let pfp;

        // The user did not give any argument
        if(!args[0]){
            profileID = message.author.id;
            let user = await db.findUser(profileID);
            if(!user){
                user = await db.createUser(profileID);
            }
            pfp = message.author.displayAvatarURL();
            np = user.np;
            up = user.up;
        } else {
            if (!validator.isInt(args[0])) {
                return message.channel.send("The first argument is not a valid user ID!");
            }

            profileID = args[0];

            const user = await db.findUser(profileID)

            if (!user) {
                return message.channel.send("Unable to find a user with this ID in the database. Ensure they create a" +
                    " profile by using the profile command themselves first.");
            }
            profileID = user.id;
            np = user.np;
            up = user.up;

            await message.client.users.fetch(profileID).then(myUser => {
                pfp = myUser.displayAvatarURL();
            }).catch((error) => {
                return message.channel.send("Unable to find a user with this ID");
            });
        }

        const profile = new Discord.MessageEmbed()
            .setColor('#c0d0ff')
            .setTitle(`${message.author.username}`)
            .setDescription('Your roleplay profile.')
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

                let EO = eco.copperToGSC(char.EFund);
                let AO = eco.copperToGSC(char.AFund);

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
