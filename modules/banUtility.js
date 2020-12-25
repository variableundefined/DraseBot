const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function ban(id){
    try {
        const ban = await prisma.botban.create({
            data: {id: id},
        })
        console.log(`User ${id} has been banned from using the bot`);
        return ban;
    } catch (err) {
        console.log('error', err)
    }
}

async function unban(id){
    try {
        const ban = await prisma.botban.delete({
            where: {id: id},
        })
        console.log(`User ${id} has been unbanned from using the bot`);
        return ban;
    } catch (err) {
        console.log('error', err)
    }
}

async function isBanned(id){
    const isBanned = await prisma.botban.findUnique({
        where: {id: id},
    })
    return isBanned;
}

module.exports = {
    ban,
    unban,
    isBanned,
}
