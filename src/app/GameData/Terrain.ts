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
}

export class Terrain {
    public terrainType:string;
    public coordinate:{x:number; y:number};
    public playerId:string;
    public captureProgress:number;
    public orientation:number;
    constructor(
        terrainType:TerrainType,
        coordinate:{x:number; y:number},
        orientation?:number,
        playerId?:string
    ) {
        this.terrainType = terrainType.name;
        this.coordinate = coordinate;
        this.playerId = playerId ?? null;
        this.captureProgress = 0;
        this.orientation = orientation ?? 0;
    }
}