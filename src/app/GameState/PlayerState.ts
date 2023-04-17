export interface PlayerState {
    id:string;
    owner:string;
    commanderName:string;
    funds:number;
    powerCharge:number;
    armyColor:string;
    alive:boolean;
    totalPowerUses:number;
    unitFacing:number;
    team?:string;
    powerActive?:string;
    powerActiveDay?:number;
    bannedUnits?:string[];
    incomeMultiplier?:number;
    coMeterMultiplier?:number;
}