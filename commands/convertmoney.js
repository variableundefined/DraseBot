const validator = require('validator');
const eco = require('../modules/economyUtility.js');

module.exports = {
    name: 'convertmoney',
    args: true,
    usage: `[copper / gold (if 3)] [silver(optional)] [copper(optional)]`,
    description: 'Take either 1 or 3 arguments. If 1 argument, convert copper amount to Gold Silver Copper, if 2 or 3, convert to just' +
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
            let copper = args[0];
            let gsc = eco.copperToGSC(copper);
            return message.channel.send(`${copper} copper convert to ${gsc.g} gold ${gsc.s} silver ${gsc.c} copper`);
        } else{
            let gold = args[0];
            let silver = args[1];
            let copper = args[2] || 0;
            let newCopper = eco.GSCToCopper(gold, silver, copper);
            return message.channel.send(`${gold} gold ${silver} silver ${copper} copper convert to ${newCopper} copper`);
        }

    }
}