export interface SettingsState {
    id:string;
    startingFunds:number;
    incomeMultiplier:number;
    fogOfWar:boolean;
    variant:{[k:string]:number};
    coPowers:boolean;
    teams:boolean;
    modId:string;
    coMeterSize:number;
    coMeterMultiplier:number;
    unitLimit?:number;
    captureLimit?:number;
    dayLimit?:number;
}