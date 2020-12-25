const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const validator = require('validator');

async function findFirstCharByName(name){
    try {
        const character = await prisma.character.findFirst({
            where: {contains: name},
        })
        if(character){
            return character;
        } else{
            return null;
        }
    } catch(err){
        console.log('error', err)
    }
}

async function findCharByID(id){
    try {
        const character = await prisma.character.findUnique({
            where: {id: id},
        })
        if(character){
            return character;
        } else{
            return null;
        }
    } catch(err){
        console.log('error', err)
    }
}

async function createCharacter(userID, name, EFund, AFund, UsedUP, TotalUP, Occupation, GSheet, Income){
    const character = await prisma.character.create({
        data: {Users: {connect: {id: userID}},
            name: name,
            EFund: Number(EFund),
            AFund: Number(AFund),
            UsedUP: Number(UsedUP),
            TotalUP: Number(TotalUP),
            Occupation: Occupation,
            GSheet: GSheet,
            Income: Number(Income)},
    })
    console.log(`Character created with \n**userID:** ${userID} \n**Name:** ${name}\n` +
        `**Equipment Funds:** ${EFund} \n**Asset Funds:** ${AFund} \n**UP:** ${UsedUP} **|** ${TotalUP} \n` +
        `**Occupation:** ${Occupation} \n**GSheet:** ${GSheet} \n**Income:** ${Income} **C** \n`);
    return character;
}

async function updateCharNumber(id, target, point, isIncrement = false){
    const valid = ['EFund', 'AFund', 'UsedUP', 'TotalUP', 'Income'];
    if(validator.isIn(target, valid)){
        throw 'Invalid arguments for update type';
    }
    try {
        let character;
        character = await prisma.character.update({
            where: {id: id},
            data: {[target]: (isIncrement ? {increment : point} : {set : point})},
        })
        return character;
    }
    catch(err){
        console.log(err);
        throw 'No character with this ID exists in the database.'
    }
}

module.exports = {
    findFirstCharByName,
    createCharacter,
    findCharByID,
}