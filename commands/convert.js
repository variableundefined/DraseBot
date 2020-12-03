const conversion = require('../modules/conversions.js');

module.exports = {
    name: 'convert',
    args: true,
    usage: `[unit-type] [number] [unit]`,
    description: 'Convert between units. Insert the type of measurement, and then the unit',
    execute(message, args) {

        const unitType = args[0];
        const number = args[1];
        const unit = args[2];

        let data = [];

        if (Number.isNaN(number)) {
            message.reply(`second argument is missing or not a number.`);
            return
        }

        if(unitType === 'temperature'){
            const temperature = ['c', 'k', 'f', 'r']
            if(temperature.includes(unit)){
                data = conversion.convertTemp(unit, number);
                message.channel.send(data);
            } else {
                message.channel.send(`Unit not found!`);
            }
        }
    }
}