export interface PackMetadata {
    name:string;
    version:string;
    created?:string;
    packId?:string;
}

export interface ResourcePack {
    packMetadata:PackMetadata;
    textResources:TextResource[];
    imageResources:ImageResource[];
}

export interface TextResource {
    key:string;
    type:string;//unit, weapon, terrain, move, commander, player, setting, interface
    shortName:string;
    longName:string;
    description:string;
    language?:string;
}

export interface ImageResource {
    key:string;
    type:string;//unit, terrain, commander, player, setting, interface
    smallImage:string;
    largeImage:string;
    armyColor?:string;
    orientation?:number;
    variant?:string;
}

export interface ImageResource2 {
    key:string;
    type:string;//unit, terrain, commander, player, setting, interface
    smallImage:Blob;
    largeImage:Blob;
    armyColor?:string;
    orientation?:number;
    variant?:string;
}