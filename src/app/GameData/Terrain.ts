export interface TerrainType {
    name:string;
    stars:number;
    maxCapturePoints:number;
    sameAs:string;
    buildList:string[];
    income:number;
    repair:number;
    repairList:string[];
    occludesVision:boolean;
    hitPoints:number;
    destroyed:string;
    damagedLike:string;
    // constructor(
    //     name:string,
    //     stars:number,
    //     maxCapturePoints?:number,
    //     sameAs?:string,
    //     buildList?:string[],
    //     income?:number,
    //     repair?:number,
    //     repairList?:string[]
    // ) {
    //     this.name = name;
    //     this.stars = stars;
    //     this.maxCapturePoints = maxCapturePoints ?? null;
    //     this.sameAs = sameAs ?? null;
    //     this.buildList = buildList ?? [];
    //     this.income = income ?? null;
    //     this.repair = repair ?? null;
    //     this.repairList = repairList ?? [];
    // }
}

export class Terrain {
    public terrainType:string;
    public coordinate: [number, number];
    public ownerId:string;
    public captureProgress:number;
    constructor(
        terrainType:TerrainType,
        coordinate:[number, number],
        ownerId?:string,
    ) {
        this.terrainType = terrainType.name;
        this.coordinate = coordinate;
        this.ownerId = ownerId ?? null;
        this.captureProgress = 0;
    }
}