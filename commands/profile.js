const Discord = require('discord.js');
const db = require('../modules/dbUtility');

module.exports = {
    name: 'profile',
    cooldown: 5,
    description: 'Return your roleplay profile. If none, it register one for you.',
    async execute(message, args) {
        let parsedID = parseInt(message.author.id);
        let trueID = await db.returnOrInsertUserID(parsedID);
        const {userID, np, up} = await db.findUser(trueID);

        const profile = new Discord.MessageEmbed()
            .setColor('#c0d0ff')
            .setTitle(`${message.author.username}`)
            .setDescription('Your roleplay profile')
            .setThumbnail(`${message.author.avatarURL()}`)
            .addFields(
                {name: 'ID', value: message.author.id},
                {name: 'Upgrade Point', value: up, inline: true},
                {name: 'Nitro Boosts', value: np, inline: true},
            );

        message.channel.send(profile);
    }
}