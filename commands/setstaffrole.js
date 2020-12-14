const Keyv = require('keyv');
const commandUtility = require('../modules/commandUtility');
const staffRole = new Keyv('sqlite://keybase.sqlite', {namespace: 'staffRole'});

module.exports = {
    name: 'setstaffrole',
    cooldown: 5,
    args: true,
    usage:'[targetRole\'s ID]',
    guildOnly: true,
    ownerOnly: true,
    description: 'Set the staff role on the server',
    async execute(message, args) {
        const targetRole = args[0];

        if(isNaN(targetRole)){
            message.channel.send('This command only accept role ID as an input.');
            return;
        }

        let returnedRole = commandUtility.returnBestRole(targetRole, message.guild);

        if(!returnedRole){
            message.channel.send(`Role not found, please make sure you are passing in the exact Role ID`);
            return;
        }

        else{
            let success = (async () => {
                return await staffRole.set(message.guild.id, targetRole);
            });
            let success2 = await success();
            if(success2){
                message.channel.send(`Successfully set staff role to ${returnedRole.name}`);
                message.channel.send(`The staff role is ${await staffRole.get(message.guild.id)}`);
            } else{
                message.channel.send(`I was unable to set the target role for some reason.`);
            }

        }
    }
}