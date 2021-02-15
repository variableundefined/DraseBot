const validator = require('validator');
const MAX_UP = 500;

function retr_dec(num) {
    num = num + '';
    return (num.split('.')[1] || []).length;
}

function fundSafe(num, allow_negative = false){
    if(!num && num !== 0){
        return false;
    }
    num = num + '';
    if(!validator.isInt(num)){
        return false;
    }
    if(num > Number.MAX_SAFE_INTEGER){
        return false;
    }
    if(!allow_negative && (num < 0)){
        return false;
    }
    return true
}

function upSafe(num, allow_negative = false){
    console.log(`Internal Value ${num}`);
    if(!num && num !== 0){
        return false;
    }

    num = num + '';

    if(!validator.isInt(num)){
        return false;
    }

    if(num > 500){
        return false;
    }

    if(!allow_negative && num < 0){
        return false;
    }
    return true
}

module.exports = {
    retr_dec,
    fundSafe,
    upSafe,
}