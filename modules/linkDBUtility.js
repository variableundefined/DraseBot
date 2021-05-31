const { PrismaClient } = require ('@prisma/client');

const prisma = new PrismaClient()

async function findLink(name){
    try {
        const link = await prisma.link.findUnique({
            where: {name:
                name},
        })
        if(link){
            return link;
        } else{
            return null;
        }
    } catch(err){
        console.log('error', err)
    }
}

async function updateLink(name, newLink){
    try {
        let link;
        link = await prisma.link.update({
            where: {name: name},
            data: {link: newLink}
        })
        return link;
    }
    catch(err){
        console.log(err);
        throw 'No link with this name exists in the database.'
    }
}

async function createLink(name, newLink){
    const link = await prisma.link.create({
        data: {name: name, link: newLink},
    })
    console.log(`Link created with ${name} and ${newLink}`);
    return link;
}

async function deleteLink(name){
    try {
        let link;
        link = await prisma.link.delete({
            where: {name: name}
        })
        return link;
    }
    catch(err){
        console.log(err);
        throw 'No link with this name exists in the database.'
    }
}

module.exports = {
    findLink,
    updateLink,
    createLink,
    deleteLink
}