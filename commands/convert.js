const conversion = require('../modules/conversions.js');

module.exports = {
    name: 'convert',
    args: true,
    usage: `[number] [unit]`,
    cooldown: 5,
    description: 'Convert between units. Insert the type of measurement, and then the unit. Directly utilize the ' +
        'convert-units library. For all valid unit, check it out on: https://www.npmjs.com/package/convert-units. ' +
        'It directly outputs a list of all valid units it can be converted to',
    execute(message, args) {

        const number = args[0];
        const unit = args[1];

        let data = [];

        if (Number.isNaN(number)) {
            message.reply(`second argument is missing or not a number.`);
            return
        }

        data = conversion.convertList(number, unit);
        message.channel.send(data);
        }
}