module.exports = {
    name: 'convert',
    args: true,
    usage: `[number] [unit]`,
    cooldown: 5,
    description: '',
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