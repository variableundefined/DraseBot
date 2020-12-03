const convert = require('convert-units');

module.exports = {
    convertTemp: function convertTemp(unit, number){
    unit = unit.toUpperCase();
    const valid = ['C', 'F', 'K', 'R'];
    if (!valid.includes(unit)) {
        throw 'Unit is not a valid temperature! Accepted temperature units are c, f, k and r'
    }

    let remainTemp = [...valid];
    const origTempIndex = remainTemp.indexOf(unit)
    remainTemp.splice(origTempIndex, 1)


    let returnString = []

    returnString.push(`${number} ${unit} equals:`);
    remainTemp.forEach(element => returnString.push(`${convert(number).from(unit).to(element)} ${element}`)
    );

    return returnString
}
}
