module.exports = {
    name: 'argsinfo',
    description: 'Get argument info',
    execute(message, args) {
        message.channel.send(`Arguments: ${args}\nArgument length:${args.length}`);
    }
}