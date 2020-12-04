const convert = require('convert-units');

module.exports = {
    convertList: function convertList(number, from){
        const allowed = convert().possibilities();

        if(!allowed.includes(from)){
            return "One or more of the unit is not available!"
        }

        let mayConvert = [...convert().from(from).possibilities()];

        const origIndex = mayConvert.indexOf(from)
        mayConvert.splice(origIndex, 1)

        let returnString = []

        returnString.push(`${number} ${from} equals:`);
        mayConvert.forEach(element => returnString.push(`${convert(number).from(from).to(element).toLocaleString()} ${element}`)
        );

        return returnString
    }
}
