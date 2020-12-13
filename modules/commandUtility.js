const _ = require('lodash');
module.exports = {
    splitString: function splitString(input) {
        const myRegExp = /"[^"]*"|[^ ]+/gm;
        let args = input.match(myRegExp);
        args = args.map(argument => argument.replace(/["]/g, ""));
        return args
    },

    returnBestRole: function returnBestRole (roleNumOrName, targetGuild) {
        let returnedRole

        if(!isNaN(roleNumOrName)){
            returnedRole = targetGuild.roles.cache.get(roleNumOrName)
            if(!returnedRole){
                return false;
            }
        }

        // If not a number, then probably string, try to find it
        else{
            let regExp = new RegExp(_.escapeRegExp(roleNumOrName));
            returnedRole = targetGuild.roles.cache.find(role => regExp.test(role.name));
            if(!returnedRole){
                return false;
            }
        }
        return returnedRole
    }
}


