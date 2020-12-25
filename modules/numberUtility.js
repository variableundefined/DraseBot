function retr_dec(num) {
    return (num.split('.')[1] || []).length;
}

module.exports = {
    retr_dec,
}