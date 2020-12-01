module.exports = {
    name: 'role',
    description: 'Get role info',
    execute(message, args) {
        let roleNum;
        roleNum = parseInt(args[0]);

        // This is a safety check to ensure that it is in fact, a proper number
        // However, Discord get function function as a String, not as a parse, but the string must be formatted as a
        // Integer, so the original args is parsed in instead.

        if(isNaN(roleNum)){
            message.channel.send("Invalid role number");
            return;
        }

        let returnedRole = message.guild.roles.cache.get(args[0])

        if(!returnedRole){
            message.channel.send("A role with that ID does not exists in this guild. Please send the role's ID");
            return;
        }

        let memberSize = returnedRole.members.size;

        message.channel.send(`${returnedRole.name} Number: ${memberSize}`);
    }
}