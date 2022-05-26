export interface MovementClass {
    name:string;
    movementCosts?:{[k:string]:number};
    variantMods?:{[k:string]:{[k:string]:number}};
    // constructor(
    //     name:string,
    //     movementCosts:any,
    //     variant?:string
    // ) {
    //     this.name = name;
    //     this.movementCosts = movementCosts;
    //     this.variant = variant;
    // }
}