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
        client.commands.get('argsinfo').execute(message, args)
    }

    else if (command === 'temperature' || command === 'temp') {
        if (!args.length) {
            return message.channel.send(`Syntax: ${prefix}temperature [c/f/celsius/fahrenheit/kelvin/k] [number]`);
        }

        if (Number.isNaN(args[1])) {
            return message.reply(`Second argument is not a number`);
        }

        const temperature = parseFloat(args[1]);
        const unit = args[0];

        if (unit === 'c' || unit === 'celsius') {
            let kelvin = temperature + 273;
            let fahrenheit = Math.floor(temperature * 9/5 + 32);
            return message.channel.send(`${temperature}°C is ${fahrenheit}°F and ${kelvin}°K`);
        }

        else if (unit === 'f' || unit === 'fahrenheit') {
            let celsius = Math.floor((temperature - 32) * 5/9);
            let kelvin = Math.floor((temperature + 459.67) * 5/9);
            return message.channel.send(`${temperature}°F is ${celsius}°C and ${kelvin}°K`);
        }

        else if (unit === 'k' || unit === 'kelvin') {
            let celsius = temperature - 273;
            let fahrenheit = Math.floor(temperature * 5/9 - 459.67);
            return message.channel.send(`${temperature}°K is ${celsius}°C and ${fahrenheit}°F`);
        }
    }


    else if(message.content.startsWith(`${prefix}oshi`)) {
        message.channel.send('https://i.imgur.com/TgJ20vR.png');
    }

    else if(message.content.startsWith(`${prefix}server`)) {
        message.channel.send(`This server's name is: ${message.guild.name}\nTotal Members: ${message.guild.memberCount}`);
    }

    else if(message.content.startsWith(`${prefix}role`)) {
            client.commands.get('role').execute(message, args);
    }

    else if (message.content === `${prefix}user-info`) {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    }
});

client.login();