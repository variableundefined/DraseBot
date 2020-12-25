const Keyv = require('keyv');

const staffRole = new Keyv('sqlite://keybase.sqlite', {namespace: 'staffRole'});

module.exports ={
    isStaff,
    isOwner,
    isApproved,
}

async function isStaff(message){
    let staffRoleID = await staffRole.get(message.guild.id);
    if (!staffRoleID) {
        return false;
    } else if(!message.member.roles.cache.some(role => role.id === staffRoleID)){
        return false;
    };
    return true;
}

async function isApproved(message){
    let approvedRoleID = await staffRole.get(message.guild.id);
    if (!approvedRoleID) {
        return false;
    } else if(!message.member.roles.cache.some(role => role.id === approvedRoleID)){
        return false;
    };
    return true;
}

function isOwner(message){
    let isOwner = message.author.id === message.guild.ownerID;
    return isOwner;
}

