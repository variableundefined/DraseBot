const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

/**
*  Check if a userID exist in the database. If not, register them
*  @param {Guild} guild The guild
 * @param {number} id The id of the user
 * return {number} id The id of the user
 * */

async function returnOrInsertUserID(id){
    if(await findUser(id)){
        return id;
    } else {
        const user = await createUser(id)
        console.log(`User with ID ${id} was not found in database. Creating user.`);
        if(!user){
            console.log(`Failed to create user`);
            return
        }
        return user.userID;
    }
}

async function findUser(id){
    try {
        const user = await prisma.users.findUnique({
            where: {id:
                id},
        })
        return {
            userID: user.id,
            up: user.upgradePoints,
            np: user.nitroBoost
        };
    } catch(err){
        console.log('error', err)
    }
}

async function createUser(id, up = 0, nitro = 0){
    const user = await prisma.users.create({
        data: {id: id, upgradePoints: up, nitroBoost: nitro},
    })
    console.log(`User with ${id} created with ${up} upgrade points and ${nitro} nitro boosts`);
    return user;
}

module.exports = {
    returnOrInsertUserID,
    findUser
}