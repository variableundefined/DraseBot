const commandUtility = require('../modules/commandUtility.js');

module.exports = {
    name: 'rolenumber',
    args: true,
    guildOnly: true,
    usage: '[roleName / roleID]',
    description: 'Get number of people in a role. Case insensitive. Return first role if multiple have the same name.',
    execute(message, args) {
        let roleNumOrName;
        let returnedRole;
        roleNumOrName = args[0];

        // Check if it is an ID

        returnedRole = commandUtility.returnBestRole(roleNumOrName, message.guild);

        if(!returnedRole){
            message.channel.send("Unable to find any role that match. Use the role's ID if possible.");
            return
        }

        let memberSize = returnedRole.members.size;

        message.channel.send(`${returnedRole.name} Number: ${memberSize}`);
    }
}