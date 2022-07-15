export interface TextResource {
    key:string;
    type:string;//unit, weapon, terrain, move, commander, player, setting
    shortName:string;
    longName:string;
    description:string;
}

export interface ImageResource {
    key:string;
    type:string;//unit, terrain, commander, player, setting
    smallImage:string;//BASE64-encoded
    largeImage:string;//BASE64-encoded
}