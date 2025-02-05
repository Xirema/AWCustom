export interface Coord {
    x:number;
    y:number;
}

export function coordEquals(a:Coord, b:Coord):boolean {
    return a.x === b.x && a.y === b.y;
}

export function coordAdd(a:Coord, b:Coord):Coord {
    return {x:a.x + b.x, y:a.y + b.y};
}

export function coordNegate(a:Coord,):Coord {
    return {x:-a.x, y:-a.y};
}

export function coordSubtract(a:Coord, b:Coord):Coord {
    return coordAdd(a, coordNegate(b));
}

export function coordHash(a:Coord):number {
    return a.x * 1109 + a.y;
}

export function coordIdentity(a:Coord):Coord {
    return a;
}