const db = require('../modules/linkDBUtility');
const perm = require('../modules/permissionCheck');

module.exports = {
    name: 'link',
    args: true,
    usage: `[name] [link]`,
    cooldown: 3,
    description: 'Add and search for a link to the link repository!',
    async execute(message, args) {

        const name = args[0];
        const newLink = args[1];

        let alreadyExists = await db.findLink(name);

        if(!alreadyExists) {
            if(!(await perm.isStaff(message))){
                return message.channel.send(`Only staff can add link.`);
            }

            if(!newLink){
                return message.channel.send(`Please add a URL as the second argument.`);
            }

            let success = await db.createLink(name, newLink);

            if(success){
                return message.channel.send(`Link ${name} created successfully: ${newLink}`)
            }
        }

        if(alreadyExists && newLink){
            if(!(await perm.isStaff(message))){
                return message.channel.send(`Only staff can update link`);
            }

            let success = await db.updateLink(name, newLink)

            if(success){
                return message.channel.send(`Link **${name}** already exists. Link updated from: ${alreadyExists.link}
            **to** ${newLink}`)
            } else{
                return message.channel.send(`Link **${name}** already exists, but I've failed to update the link for some reason!.`)
            }
        } else {
            return message.channel.send(`Link **${alreadyExists.name}**: \n ${alreadyExists.link}`)
        }

    }
}