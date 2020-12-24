const Discord = require('discord.js');
const db = require('../modules/dbUtility');

module.exports = {
    name: 'profile',
    cooldown: 5,
    usage: "[User ID (Optional)]",
    description: 'If used with no argument, it give you your own profile and register one for you if you have none, ' +
        'If used with one argument (A User ID), it give you their profile, if they have one',
    async execute(message, args) {
        let np, up = "NOT FOUND";
        let profileID = message.author.id;
        let pfp;

        // The user did not give any argument
        if(!args[0]){
            let parsedID = parseInt(message.author.id);
            let user = await db.findUser(parsedID);
            if(!user){
                user = await db.createUser(parsedID);
            }
            pfp = message.author.displayAvatarURL();
            np = user.np;
            up = user.up;
        } else {
            let parsedID = parseInt(args[0]);

            if (!parsedID) {
                return message.channel.send("The first argument is not a valid user ID!");
            }

            const user = await db.findUser(parsedID)

            if (!user) {
                return message.channel.send("Unable to find a user with this ID in the database");
            }
            profileID = user.userID;
            np = user.np;
            up = user.up;

            await message.client.users.fetch(args[0]).then(myUser => {
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
            );

        message.channel.send(profile);
    }
}
