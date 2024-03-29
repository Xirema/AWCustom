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