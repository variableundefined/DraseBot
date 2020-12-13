module.exports = {
    name: 'argsinfo',
    args: true,
    usage: `[any number of arguments, separated by space. Enclose in quotations like "Don't Split This Argument" if needed]`,
    description: 'Get argument info',
    execute(message, args) {
        message.channel.send(`Arguments: ${args}\nArgument length:${args.length}`);
    }
}