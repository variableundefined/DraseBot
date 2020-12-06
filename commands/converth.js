const convert = require('convert-units');

module.exports = {
    name: 'converth',
    args: true,
    usage: `[ftin / m] [number 1 (ft, or m)] [number 2 (in, if ftin)]`,
    cooldown: 3,
    description: 'Special command for converting between the foot-inch customary height unit in US, and meter used ' +
        'everywhere else. Ftin means converting FROM ftin, and takes two number argument, m means converting FROM m' +
    'and takes one argument',
    execute(message, args) {

        const from = args[0];
        const num1 = args[1];
        const num2 = args[2];

        let data = [];

        if (from !== 'ftin' && from !== 'm') {
            message.reply(`First argument invalid.`);
            return
        }

        if (Number.isNaN(num1)) {
            message.reply(`First argument is missing or not a number.`);
            return
        }

        if (from === 'ftin') {
            if(Number.isNaN(num2)){
                message.reply(`Second argument is missing or not a number.`);
            }
            else{
                let meter1 = convert(num1).from('ft').to('m');
                let meter2 = convert(num2).from('in').to('m');
                let finalMeter = meter1 + meter2;
                finalMeter = finalMeter.toLocaleString();
                message.channel.send(`${num1} ft ${num2} in = ${finalMeter} m`);
            }
        }

        else if (from === 'm') {
            let foot = convert(num1).from('m').to('ft');
            let remainFoot = foot - Math.floor(foot);
            foot = Math.floor(foot);
            let inch = convert(remainFoot).from('ft').to('in');
            foot = foot.toLocaleString();
            inch = Math.round(inch);
            inch = inch.toLocaleString();
            message.channel.send(`${num1}m = ${foot} ft ${inch} in`);
        }
    }
}