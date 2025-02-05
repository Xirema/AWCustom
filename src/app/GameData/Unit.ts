export interface UnitType {
    name:string;
    cost:number;
    maxFuel:number;
    maxAmmo:number;
    visionRange:number;
    movementRange:number;
    movementClass:string;
    classifications:string[];

    fuelPerDay?:number;
    fuelPerDayStealth?:number;
    weapons?:string[];
    supplyRepair?:number;
    transportCapacity?:number;
    transportList?:string[];
    hitPoints?:number;
    captureSpeed?:number;
    ignoresVisionOcclusion?:boolean;
    stealthType?:string;
    stationaryFire?:boolean;
}

export interface WeaponType {
    name:string;
    ammoConsumed:number;
    baseDamage?:{[k:string]:number};
    maxRange:number;
    minRange?:number;
    selfTarget?:boolean;
    affectedByLuck?:boolean;
    nonLethal?:boolean;
    areaOfEffect?:number;
    targetsStealth?:string[];
    flatDamage?:number;
}