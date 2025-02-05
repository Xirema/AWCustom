export interface GameState {
    id:string;
    day:number;
    playerTurn:number;
    playerOrder:string[];
    variant:string;
    variantStart?:string;
    active:boolean;
    hash:string;
}