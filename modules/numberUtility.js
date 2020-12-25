const validator = require('validator');
const MAX_UP = 500;

function retr_dec(num) {
    return (num.split('.')[1] || []).length;
}

function fundSafe(num){
    if(!validator.isInt(num)){
        return false;
    }
    if(num < 0 || num > Number.MAX_SAFE_INTEGER){
        return false;
    }
    return true
}

function upSafe(num){
    if(retr_dec(num) > 1){
        return false;
    }

    if(num < 0 || num > 500){
        return false;
    }
    return true
}

module.exports = {
    retr_dec,
    fundSafe,
    upSafe,
}