export interface UnitType {
    name:string;
    cost:number;
    maxFuel:number;
    maxAmmo:number;
    visionRange:number;
    movementRange:number;
    movementClass:string;
    classifications:string[];

    fuelPerDay:number;
    fuelPerDayStealth:number;
    weapons:string[];
    supplyRepair:number;
    transportCapacity:number;
    transportList:string[];
    hitPoints:number;
    captureSpeed:number;
    ignoresVisionOcclusion:boolean;
    stealthType:string;
}

export interface WeaponType {
    name:string;
    ammoConsumed:number;
    baseDamage:{[k:string]:number};
    maxRange:number;
    minRange:number;
    selfTarget:boolean;
    affectedByLuck:boolean;
    nonLethal:boolean;
    areaOfEffect:number;
    targetsStealth:string[];
    flatDamage:number;
}

export class Unit {
    public unitType:string;
    public coordinate:[number, number];
    public ownerId:string;
    public damage:number;
    public fuel:number;
    public ammo:number;
    public active:boolean;
    public transporting:Unit[];

    constructor(
        unitType:UnitType,
        coordinate:[number,number],
        ownerId:string
    ) {
        this.unitType = unitType.name;
        this.coordinate = coordinate;
        this.ownerId = ownerId;
        this.damage = 0;
        this.fuel = unitType.maxFuel;
        this.ammo = unitType.maxAmmo;
        this.active = false;
        this.transporting = [];
    }

}