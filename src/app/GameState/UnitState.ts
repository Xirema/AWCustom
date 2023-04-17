export interface UnitState {
    id:string;
    x:number;
    y:number;
    name:string;
    ammo:number;
    fuel:number;
    active:boolean;
    stunned?:number;
    transporting?:string[];
    owner?:string;
    hitPoints?:number;
    realHitPoints?:number;
    stealthed?:boolean;
}