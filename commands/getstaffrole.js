const Keyv = require('keyv');
const commandUtility = require('../modules/commandUtility');
const staffRole = new Keyv('sqlite://keybase.sqlite', {namespace: 'staffRole'});

module.exports = {
    name: 'getstaffrole',
    cooldown: 5,
    guildOnly: true,
    description: 'Get the staff role\'s ID number and name',
    async execute(message, args) {
        let staffRoleID = await staffRole.get(message.guild.id);
        if(!staffRoleID){
            message.channel.send(`There's no staff role set on the server`);
            return;
        }
        let roleName = message.guild.roles.cache.get(staffRoleID).name;
        message.channel.send(`The staff role is ${roleName}`);
    }
}