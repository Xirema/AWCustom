export interface TerrainState {
    id:string;
    x:number;
    y:number;
    name:string;
    orientation?:number;
    capturePoints?:number;
    owner?:string;
    activationCount?:number;
    hitPoints?:number;
}