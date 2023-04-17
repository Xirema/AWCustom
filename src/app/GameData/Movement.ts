export interface MovementClass {
    name:string;
    movementCosts:{[k:string]:number};
    variantMods?:{[k:string]:{[k:string]:number}};
}