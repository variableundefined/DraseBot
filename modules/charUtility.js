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
    if(!validator.isIn(target, valid)){
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

async function updateCharField(id, target, value){
    const valid = ['name', 'Occupation', 'GSheet', 'Thumbnail'];
    if(!validator.isIn(target, valid)){
        throw 'Invalid arguments for update type';
    }
    console.log(`${id} + ${target} + ${value}`);
    try {
        let character;
        character = await prisma.character.update({
            where: {id: id},
            data: {[target]: value},
        })
        return character;
    }
    catch(err){
        console.log(err);
        throw 'No character with this ID exists in the database.'
    }
}

async function allUserChars(id){
    const chars = await prisma.character.findMany({
        where: { userID: id},
        orderBy: { id: 'asc' },
    })
    return chars;
}

async function allNameMatchChars(name){
    const chars = await prisma.character.findMany({
        where: { name: {contains: name, mode: "insensitive"}},
        orderBy: { id: 'asc' },
    })
    return chars;
}

async function userCharCount(id){
    const result = await prisma.character.count({
        where: { userID: id},
    })
    return result;
}

async function resolveChar(charName){
    if(!charName) return false;
    if(validator.isInt(charName)){
        return await findCharByID(Number(charName));
    } else{
        return await allNameMatchChars(charName);
    }
}

function disambiguateChars(chars){
    let message = 'More than one character found. Available options include. (Get them by exact name or ID): '
    for(const character of chars){
        message += `"#${character.id}:${character.name}", `;
    }
    if(message.length > 1600){
        message = `Way too many characters were found matching your name. Please narrow down the search.`
    };
    return message;
}

async function retrieveAllIncome(){
    let idIncome = await prisma.character.findMany({
        select: {Income: true, id: true, AFund: true, EFund: true},
    })
    for (let c of idIncome){
        console.log(`New AFund: ${c.AFund} -> ${c.AFund + c.Income}, New EFund: ${c.EFund} -> ${c.EFund + c.Income}`)
        
    }
}


module.exports = {
    findFirstCharByName,
    disambiguateChars,
    createCharacter,
    findCharByID,
    updateCharField,
    updateCharNumber,
    allUserChars,
    allNameMatchChars,
    userCharCount,
    resolveChar,
    disambiguateChars,
}

async function test(){
    await retrieveAllIncome();
}

test();