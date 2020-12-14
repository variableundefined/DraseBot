module.exports = {
    name: 'isowner',
    cooldown: 5,
    guildOnly: true,
    staffOnly: true,
    description: 'Check if the message sender is owner',
    execute(message, args) {
        const sender = message.author.id;
        const owner = message.guild.ownerID;
        const isOwner = sender === owner;
        message.channel.send(`The sender of this message ${isOwner ? 'is' : 'is NOT'} the owner`);
    }
}