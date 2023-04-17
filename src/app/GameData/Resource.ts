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
    smallImage:string;//BASE64-encoded
    largeImage:string;//BASE64-encoded
    armyColor?:string;
    orientation?:number;
    variant?:string;
}