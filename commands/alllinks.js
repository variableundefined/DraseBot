const db = require('../modules/linkDBUtility');

module.exports = {
    name: 'alllinks',
    args: false,
    usage: ``,
    cooldown: 3,
    description: 'Retrieve the name of all links in the database!',
    async execute(message, args) {
        const links = await db.getAllLinks();

        if(!links){
            return message.channel.send(`No links found in the database, chief`);
        }

        const msgArray = [];

        for(const link of links) {
            msgArray.push(`**${link.name}**, `);
        }

        return message.channel.send(`All Links Found: \n ${msgArray.join('')}`);
    }
}