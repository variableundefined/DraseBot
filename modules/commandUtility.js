module.exports = {
    splitString: function splitString(input) {
        const myRegExp = /"[^"]*"|[^ ]+/gm;
        let args = input.match(myRegExp);
        args = args.map(argument => argument.replace(/["]/g, ""));
        return args
    }
}


