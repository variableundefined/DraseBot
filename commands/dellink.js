const db = require('../modules/linkDBUtility');
const perm = require('../modules/permissionCheck');

module.exports = {
    name: 'dellink',
    args: true,
    staffOnly: true,
    usage: `[link's name]`,
    cooldown: 3,
    description: 'Delete a link from the link repository',
    async execute(message, args) {

        const name = args[0];

        let deleted = await db.deleteLink(name);

        if(deleted) {
            return message.channel.send(`Link ${name} has been deleted`);
        } else {
            return message.channel.send(`Link ${name} does not exists`);
        }
    }

}