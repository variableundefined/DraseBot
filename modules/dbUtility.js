const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

/**
*  Check if a userID exist in the database. If not, register them
*  @param {Guild} guild The guild
 * @param {number} id The id of the user
 * return {number} id The id of the user
 * */

async function findUser(id){
    try {
        const user = await prisma.users.findUnique({
            where: {id:
                id},
        })
        if(user){
            return {
                userID: user.id,
                up: user.up,
                np: user.np
            };
        } else{
            return null;
        }
    } catch(err){
        console.log('error', err)
    }
}

/**
 *  Update one parameter of a user
 *  @param {id} int ID number of the user you want to update
 *  @param {target} string The parameter you want to modify. Acceptable: up / np
 *  @param {point} number Number of point to set to or increment by
 *  @param {isIncrement} boolean Whether to increment the number or set it. Default: False.
 * */
async function updateUser(id, target, point, isIncrement = false){
    if(!['up', 'np'].includes(target)){
        throw 'Invalid arguments for update type';
    }
    try {
        let user;
        user = await prisma.users.update({
            where: {id: id},
            data: {[target]: (isIncrement ? {increment : point} : {set : point})},
        })
        return user;
    }
    catch(err){
        console.log(err);
        throw 'No user with this ID exists in the database.'
    }
}

async function createUser(id, up = 0, nitro = 0){
    const user = await prisma.users.create({
        data: {id: id, up: up, np: nitro},
    })
    console.log(`User with ${id} created with ${up} upgrade points and ${nitro} nitro boosts`);
    return user;
}

module.exports = {
    findUser,
    updateUser,
    createUser
}