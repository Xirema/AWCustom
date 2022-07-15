export interface TerrainType {
    name:string;
    stars:number;
    maxCapturePoints?:number;
    sameAs?:string;
    buildList?:string[];
    income?:number;
    repair?:number;
    repairList?:string[];
    occludesVision?:boolean;
    hitPoints?:number;
    destroyed?:string;
    damagedLike?:string;
}