const eco = require('../modules/economyUtility');
const validator = require('validator');

module.exports = {
    name: 'assetupdate',
    args: true,
    usage: `[Bank Cash (Copper)] [Wallet Cash (Copper)] [Estimated Equipment Worth] [Estimated Asset Worth]`,
    description: 'Help you do the asset update. Enter in order (Copper only, use convertmoney to help you)',
    execute(message, args) {
        let bank = args[0];
        let wallet = args[1];
        let eq = args[2];
        let ass = args[3];

        if(!bank || !validator.isInt(bank)) return message.channel.send('Bank cash number must be an integer');
        if(!wallet || !validator.isInt(wallet)) return message.channel.send('Wallet cash number must be an integer');
        if(!eq || !validator.isInt(eq)) return message.channel.send('Equipment worth must be an integer');
        if(!ass || !validator.isInt(ass)) return message.channel.send('Asset worth must be an integer');

        bank = Number(bank);
        wallet = Number(wallet);
        eq = Number(eq);
        ass = Number(ass);

        let base = bank + wallet;

        let newEq = base + ass;
        let newAss = base + eq;

        return message.channel.send(`\`\`\`Character Sheet:\nOld Net Worth (Bank + Wallet): ${bank + wallet}\n` +
            `Estimated Equipment Worth: ${eq}\n` +
        `Estimated Asset Worth: ${ass}\n`+
        `New Equipment Fund: ${newEq}\n`+
        `New Asset Fund: ${newAss}\n`+
        `Approved By:`+
        `\`\`\``);
    }
}