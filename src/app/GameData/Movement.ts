export interface MovementClass {
    name:string;
    movementCosts:{[k:string]:number};
    variant:string;
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