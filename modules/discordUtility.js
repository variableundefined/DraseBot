const Discord = require('discord.js');

async function retrieveUser(message, id){


    await message.client.users.fetch(id).then(myUser => {
        return myUser
    }).catch((error) => {
        throw "Unable to find a user with this ID";
    });
}