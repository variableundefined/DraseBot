const db = require('../modules/dbUtility');

module.exports = {
    name: 'addprofilept',
    cooldown: 1,
    args: true,
    usage: "[User ID] [np/up] [value]",
    description: 'Add or subtract a certain amount of up / nitro boost from a profile. Cannot be reduced beyond zero.',
    async execute(message, args) {
        const MAXIMUM_UP_VALUE = 500;
        const MAXIMUM_NP_VALUE = 30;
        let id = parseInt(args[0]);
        let pt = args[1];
        let value = parseFloat(args[2]);
        let returnMessage;

        if(!id){
            return message.channel.send('ID Invalid');
        }
        if(!['up', 'np'].includes(pt)){
            return message.channel.send('Second argument must be either up or np');
        }
        if(isNaN(value)){
            return message.channel.send('Value must be a number');
        }

        let user = await db.findUser(id);

        if(!user){
            return message.channel.send('User ID not found in database');
        }

        if(pt === 'up'){
            let finalUP = value + user.up;
            if(finalUP >= 0 && finalUP <= MAXIMUM_UP_VALUE){
                let newUser = await db.updateUser(id, 'up', value, true);
                returnMessage = `Upgrade Points for profile ${user.userID} has been changed from ${user.up} to ${newUser.up}`;
            } else {
                returnMessage = `Final UP value was below 0 or exceed ${MAXIMUM_UP_VALUE}`;
            }
        } else if(pt === 'np'){
            let finalNP = value + user.np;
            if(finalNP >= 0 && finalNP <= MAXIMUM_NP_VALUE) {
                let newUser = await db.updateUser(id, 'np', value, true);
                returnMessage = `Nitro Boost has been changed from ${user.np} to ${newUser.np}`;
            } else {
                returnMessage = `Final NP value was below 0 or exceed ${MAXIMUM_NP_VALUE}`;
            }
        }
        return message.channel.send(returnMessage);
    }
}