export interface MapType {
    name:string;

    playerSlots:string[];

    initialTerrains:{
        terrainName:string;
        coordinates:{
            x:number;
            y:number;
        };
        orientation:number;
        playerSlot:string;
        terrainMods:{[key:string]:any};
    }[];

    initialUnits:{
        unitName:string;
        coordinates:{
            x:number;
            y:number;
        };
        playerSlot:string;
        unitMods:{[key:string]:any};
    }[];
}