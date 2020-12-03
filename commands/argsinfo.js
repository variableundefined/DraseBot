module.exports = {
    name: 'argsinfo',
    args: true,
    usage: `[any number of arguments, separated by space]`,
    description: 'Get argument info',
    execute(message, args) {
        message.channel.send(`Arguments: ${args}\nArgument length:${args.length}`);
    }
}