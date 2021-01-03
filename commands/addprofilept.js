const db = require('../modules/userUtility');
const validator = require('validator');

module.exports = {
    name: 'addprofilept',
    cooldown: 3,
    staffOnly: true,
    args: true,
    usage: "[UserID (Integer)] [np/up] [value]",
    description: 'Add or subtract a certain amount of up / nitro boost from a profile. Cannot be reduced beyond zero.',
    async execute(message, args) {
        const MAXIMUM_UP_VALUE = 500;
        const MAXIMUM_NP_VALUE = 30;
        let id = args[0];
        let pointType = args[1];
        let value = args[2];
        let returnMessage;

        // Safety Check
        if(!validator.isInt(id)){
            return message.channel.send('First argument must be an ID and an integer.');
        }
        if(!['up', 'np'].includes(pointType)){
            return message.channel.send('Second argument must be either up or np');
        }
        if(!validator.isNumeric(value)){
            return message.channel.send('Third argument must be a number');
        }

        let user = await db.findUser(id);

        if(!user){
            return message.channel.send('User ID not found in database');
        }

        if(pointType === 'up'){
            value = parseFloat(args[2]);
            let finalUP = value + user.up;
            if(finalUP >= 0 && finalUP <= MAXIMUM_UP_VALUE){
                let newUser = await db.updateUser(id, 'up', value, true);
                returnMessage = `Upgrade Points for profile ${user.id} has been changed from ${user.up} to ${newUser.up}`;
            } else {
                returnMessage = `Final UP value was below 0 or exceed ${MAXIMUM_UP_VALUE}`;
            }
        } else if(pointType === 'np'){
            value = parseInt(args[2]);
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