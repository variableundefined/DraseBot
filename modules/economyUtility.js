const validator = require('validator');

// Currency Constant
const silverValue = 10;
const goldValue = 100 * silverValue;

function copperToGSC(iCopper){
    iCopper = iCopper + '';
    if(!validator.isInt(iCopper)){
        return 'You can only convert an integer!';
    }

    let gold, silver = 0;
    let copper = iCopper;

    gold = Math.floor(copper / goldValue);
    copper = copper % goldValue;

    silver = Math.floor(copper / silverValue);
    copper = copper % silverValue;

    return {g: gold, s: silver, c: copper};
}

function GSCToCopper(g = '0', s = '0', c = '0'){
    g = g + '';
    s = s + '';
    c = c + '';

    if(!validator.isInt(g)){
        return 'Gold is not an integer!';
    }

    if(!validator.isInt(s)){
        return 'Silver is not an integer!';
    }

    if(!validator.isInt(c)){
        return 'Copper is not an integer!';
    }

    g = Number(g);
    s = Number(s);
    c = Number(c);

    let newC = g * goldValue + s * silverValue + c;

    return newC;
}

module.exports = {
    copperToGSC,
    GSCToCopper
}