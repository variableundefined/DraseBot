const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

function reasonUnsafe (reason) {
    if(reason.length > 200){
        return 'Reason too long!';
    }
    return false
}

async function reasonAdd (){
    const reason = await prisma.
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
}