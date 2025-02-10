export interface Settings {
    name:string;
    startingFunds?:number;
    incomeMultiplier?:number;
    fogOfWar?:boolean;
    variant?:{[k:string]:number};
    coPowers?:boolean;
    teams?:boolean;
    unitLimit?:number;
    captureLimit?:number;
    dayLimit?:number;
    coMeterSize?:number;
    coMeterMultiplier?:number;
}

export interface Config {
    minTerrainStars?:number;
    unlimitedUnload?:boolean;
    terrainDefenseScalesWithHitpoints?:boolean;
    terrainFirepowerScalesWithHitpoints?:boolean;
}