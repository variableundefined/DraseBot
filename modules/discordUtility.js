const Discord = require('discord.js');

async function retrieveUser(message, usr){
    let id = extractUser(usr);
    if(!id){
        return false;
    }
    try {
        const myUser = await message.client.users.fetch(id)
        return myUser;
    } catch(error){
        return false;}
}



function extractUser(msg){
    let found = msg.match(/<?@?!?(\d{17,19})>?/);
    if(found){
        return found[1];
    } return false;
}


module.exports = {
    retrieveUser,
}

