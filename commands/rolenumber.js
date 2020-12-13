const _ = require('lodash');

module.exports = {
    name: 'rolenumber',
    args: true,
    usage: '[roleName / roleID]',
    description: 'Get number of people in a role. Case insensitive. Return first role if multiple have the same name.',
    execute(message, args) {
        let roleNumOrName;
        let returnedRole;
        roleNumOrName = args[0];

        // Check if it is an ID first

        if(!isNaN(roleNumOrName)){
            returnedRole = message.guild.roles.cache.get(roleNumOrName)
            if(!returnedRole){
                message.channel.send("A role with that ID does not exists in this guild. Please send the role's ID");
                return;
            }
        }

        // If not a number, then probably string, try to find it
        else{
            let regExp = new RegExp(_.escapeRegExp(roleNumOrName));
            returnedRole = message.guild.roles.cache.find(role => regExp.test(role.name));
            if(!returnedRole){
                message.channel.send("Input was not a roleID but no role with that name was found.");
                return;
            }
        }
        
        let memberSize = returnedRole.members.size;

        message.channel.send(`${returnedRole.name} Number: ${memberSize}`);
    }
}