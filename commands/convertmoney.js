const validator = require('validator');
const eco = require('../modules/economyUtility.js');

module.exports = {
    name: 'convertmoney',
    args: true,
    usage: `[copper / gold (if 3)] [silver(optional)] [copper(optional)]`,
    description: 'Take either 1 or 3 arguments. If 1 argument, convert copper amount to Gold Silver Copper, if 3, convert to just' +
        ' copper from gold silver copper.',
    async execute(message, args) {

        if(args.length > 3){
            return message.channel.send('Too many arguments.');
        }

        args.forEach(element => {
                if(!validator.isInt(element))
                    return message.channel.send('One or more of the argument is not an integer.');
                if(element > Number.MAX_SAFE_INTEGER)
                    return message.channel.send('One or more of the argument is too big.');
        })

        if(args.length === 1){
            return message.channel.send(eco.copperToGSC(args[0]));
        } else{
            return message.channel.send(eco.GSCToCopper(args[0], args[1], args[2]));
        }

    }
}