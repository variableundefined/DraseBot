const Discord = require('discord.js');

async function retrieveUser(message, id){
    try {
        const myUser = await message.client.users.fetch(id)
        return myUser;
    } catch(error){
        return false;}
}

module.exports = {
    retrieveUser,
}
