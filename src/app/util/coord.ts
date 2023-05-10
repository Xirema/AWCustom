export interface Coord {
    // constructor(
    //     public x:number,
    //     public y:number
    // ) {

    // }
    x:number;
    y:number;

    // public equals(o:Coord):boolean {
    //     return this.x === o.x && this.y === o.y;
    // }

    // public add(o:Coord):Coord {
    //     return new Coord(this.x + o.x, this.y + o.y);
    // }

    // public negate():Coord {
    //     return new Coord(-this.x, -this.y);
    // }

    // public subtract(o:Coord):Coord {
    //     return this.add(o.negate());
    // }
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