const Keyv = require('keyv');
const commandUtility = require('../modules/commandUtility');
const validator = require('validator');

const staffRole = new Keyv('sqlite://keybase.sqlite', {namespace: 'staffRole'});
const approvedRole = new Keyv('sqlite://keybase.sqlite', {namespace: 'approvedRole'});


module.exports = {
    name: 'role',
    cooldown: 1,
    args: true,
    usage: '[set/get] [approved/staff] [roleID (Only for set)]',
    guildOnly: true,
    ownerOnly: true,
    description: 'Set the staff role on the server',
    async execute(message, args) {
        let command = args[0].toLowerCase();
        if(!args[1]){
            return message.channel.send('2nd argument missing!');
        }
        let role = args[1].toLowerCase();;
        let roleID = args[2];

        if (!validator.isIn(command, ['set', 'get'])) return message.channel.send('1st argument must be get or set');
        if (!validator.isIn(role, ['approved', 'staff'])) return message.channel.send('1st argument must be Approved or Staff');

        switch(command){
            case 'get':
                return message.channel.send(await getRole(role, message));
                break;
            case 'set':
                return message.channel.send(await setRole(role, message, roleID));
                break;
        }
    }
}

async function getRole(role, message){
    switch(role){
        case 'approved':
            let approvedRoleID = await approvedRole.get(message.guild.id);
            if(!approvedRoleID){
                return (`There's no approved role set on the server`);
            }
            let approvedRoleName = message.guild.roles.cache.get(approvedRoleID).name;
            return (`The approved role is ${approvedRoleName}`);
            break;
        case 'staff':
            let staffRoleID = await staffRole.get(message.guild.id);
            if(!staffRoleID){
                return (`There's no staff role set on the server`);
            }
            let staffRoleName = message.guild.roles.cache.get(staffRoleID).name;
            return (`The staff role is ${staffRoleName}`);
    }
}

async function setRole(role, message, roleID) {
    if (isNaN(roleID)) {
        return ('This command only accept role ID as an input.');
    }

    let returnedRole = commandUtility.returnBestRole(roleID, message.guild);

    if (!returnedRole) {
        return (`Role not found, please make sure you are passing in the exact Role ID`);
    }

    let success;

    switch (role) {
        case 'approved':
            success = await approvedRole.set(message.guild.id, roleID);
            if (success) {
                return `Successfully set approved role to ${returnedRole.name}` +
                    `\nThe approved role is ${await approvedRole.get(message.guild.id)}`;
            }
            break;
        case 'staff':
            success = await staffRole.set(message.guild.id, roleID);
            if (success) {
                return `Successfully set staff role to ${returnedRole.name}` +
                    `\nThe staff role is ${await staffRole.get(message.guild.id)}`;
            }
            break;
        return `I was unable to set the role correctly for some reason.`;
    }
}