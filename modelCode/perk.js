const MAX_STR = 10;
const MAX_DEX = 10;
const MAX_CON = 10;
const MAX_MAG = 20;
const MAX_COM = 10;

class Perk{
    constructor(name, desc, upScale, minLv, lpStr, lpDex, lpCon, lpMag, lpCom, efStat, setMaxLevel = 0) {
        this.name = name;
        this.desc = desc;
        this.upScale = upScale;
        this.minLv = minLv;
        this.lpStr = lpStr;
        this.lpDex = lpDex;
        this.lpCon = lpCon;
        this.lpMag = lpMag;
        this.lpCom = lpCom;
        this.efStat = efStat;
        this.setMaxLevel = setMaxLevel;
    }
    maxLevel(){
        return this.setMaxLevel || this.minLv + this.lpStr * MAX_STR + this.lpDex * MAX_DEX + this.lpCon * MAX_CON + this.lpMag * MAX_MAG + this.lpCom * MAX_COM;
    }
    lvCost(level){
        for (const a of this.upScale){
            if(level < a.Lv){
                return a.Cost;
            }
        }
        return 0;
    }
}


let perkStrong = new Perk("Strong", "Your body is stronger. You can lift more, you hit harder.",
    [{Lv: 15, Cost: 2}, {Lv: 33, Cost: 3}], 3, 3, 0, 0, 0, 0, {Str: 1}, false);

console.log(perkStrong.maxLevel());
console.log(perkStrong.lvCost(34));



module.exports = {
    Perk,
}