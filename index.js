const fs = require('fs');
const Discord = require('discord.js');

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

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        client.commands.get('ping').execute(message, args);
    }

    else if (command === 'args-info') {
        client.commands.get('argsinfo').execute(message, args);
    }

    else if (command === 'temperature' || command === 'temp') {
        client.commands.get('temp').execute(message, args);
    }

    else if(command == 'oshi') {
        client.commands.get('oshi').execute(message, args);
    }
});

client.login();