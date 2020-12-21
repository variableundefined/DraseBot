const fs = require('fs');
const Discord = require('discord.js');
const Keyv = require('keyv');
const commandUtility = require('./modules/commandUtility');
const db = require('./modules/dbUtility');

const staffRole = new Keyv('sqlite://keybase.sqlite', {namespace: 'staffRole'});

staffRole.on('error', err => console.error('Keyv connection error:', err));

require('dotenv').config();

const prefix = process.env.PREFIX;

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();


client.once('ready', () => {
    console.log('Ready!');
});

client.on('message',async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = commandUtility.splitString(message.content.slice(prefix.length).trim());
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // Check emptiness

    if(!command) return;

    // Check if guild only

    if (command.guildOnly && message.channel.type === `dm`){
        return message.reply('I can\'t execute that command inside DMs!').catch((error) => {
            console.error(error);
        });;
    }

    // Check for allowed role ID

    if(command.allowedRoleIDs){
        let mayExecute = false;
        command.allowedRoleIDs.forEach(roleID => {
            if(message.member.roles.cache.some(role => role.id === roleID)){
            mayExecute = true;
        }});
            if(!mayExecute){
                return message.reply('You do not have permission to execute that command.');
            }
    }

    // Check for owner only
    let isOwner = message.author.id === message.guild.ownerID;
    if(command.ownerOnly){
        if(!isOwner){
            return message.reply('This command can only be used by the owner of the server.');
        }
    }

    // Check for staff only

    if(command.staffOnly) {
        let staffRoleID = await staffRole.get(message.guild.id);
        if (!staffRoleID) {
            return message.channel.send(`This command can only be used by staff. And there's no staff role set on server.`);
        } else if(!message.member.roles.cache.some(role => role.id === staffRoleID)){
            return message.channel.send(`This message can only be used by staff`);
        };
    }

    // Check for arguments length. No argument = usage

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nUsage:\`\`\` ${prefix}${command.name} ${command.usage}\`\`\``
        }

        return message.channel.send(reply).catch((error) => {
            console.error(error);
        });
    }

    // This block set up for cooldowns on command. Default 3s.

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)}  more second(s) before reusing the
             \`${command.name}\` command.`).catch((error) => {
                    console.error(error);
                });;
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Catch all for errors.
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!').catch((error) => {
            console.error(error);
        });
    }
});

client.login();