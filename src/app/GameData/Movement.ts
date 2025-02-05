export interface MovementRule {
    name:string;
    type:string;
    maxRepeat:number;
    confirmType:string;
    stopIfUsed:boolean;
}

export interface MovementClass {
    name:string;
    movementCosts:{[k:string]:number};
    variantMods?:{[k:string]:{[k:string]:number}};
    movementRules:string[];
}