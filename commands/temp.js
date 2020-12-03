module.exports = {
    name: 'temp',
    description: 'convert temperature',
    execute(message, args) {
        if (!args.length) {
            message.channel.send(`Syntax: temperature [c/f/celsius/fahrenheit/kelvin/k] [number]`);
        }

        const unit = args[0];
        const temperature = parseFloat(args[1]);

        // Early Returns / Safety Check
        if (Number.isNaN(temperature)) {
            message.reply(`Second argument is not a number`);
            return
        }

        if (unit === 'c' || unit === 'celsius') {
            let kelvin = temperature + 273;
            let fahrenheit = Math.floor(temperature * 9/5 + 32);
            message.channel.send(`${temperature}°C is ${fahrenheit}°F and ${kelvin}°K`);
        }

        else if (unit === 'f' || unit === 'fahrenheit') {
            let celsius = Math.floor((temperature - 32) * 5/9);
            let kelvin = Math.floor((temperature + 459.67) * 5/9);
            message.channel.send(`${temperature}°F is ${celsius}°C and ${kelvin}°K`);
        }

        else if (unit === 'k' || unit === 'kelvin') {
            let celsius = temperature - 273;
            let fahrenheit = Math.floor(temperature * 5/9 - 459.67);
            message.channel.send(`${temperature}°K is ${celsius}°C and ${fahrenheit}°F`);
        }
    }
}

