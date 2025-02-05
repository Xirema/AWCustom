export interface MapType {
    name:string;

    playerSlots?:string[];

    initialTerrains:{
        terrainName:string;
        x:number;
        y:number;
        orientation?:number;
        playerSlot?:string;
        terrainMods?:{[key:string]:number};
    }[];

    initialUnits?:{
        unitName:string;
        x:number;
        y:number;
        playerSlot?:string;
        unitMods?:{[key:string]:number};
    }[];
}