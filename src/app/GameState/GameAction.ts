import { Coord } from "../util/coord";

export interface Move {
    type:string;
    from?:Coord;
    to?:Coord;
}

export interface GameAction {
    currentGameHash:string;
    actionType:string;
    sourceType:number; //0 == Unit, 1 == Terrain, 2 == Player
    targetType?:number;
    sourceId:string;
    targetId?:string;
    moves:Move[];
}

export interface MoveResult {
    type:string;
    from?:Coord;
    to?:Coord;
    damage?:number;
}

export interface GameActionResult {
    result:string;
    moves?:MoveResult[];
    newGameHash?:string;
}