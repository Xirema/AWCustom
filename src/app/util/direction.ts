import { Coord } from "./coord";

export enum Direction {
    Up,
    Down,
    Left,
    Right
}


export function getDelta(direction:Direction):Coord {
    switch(direction) {
        case Direction.Up: return {x:0, y:-1};
        case Direction.Down: return {x:0, y:1};
        case Direction.Left: return {x:-1, y:0};
        case Direction.Right: return {x:1, y:0};
    }
}

export function getDirection(a:Coord, b:Coord):Direction | undefined {
    if(b.x - a.x === 1 && b.y === a.y) return Direction.Right;
    if(a.x - b.x === 1 && b.y === a.y) return Direction.Left;
    if(b.y - a.y === 1 && b.x === a.x) return Direction.Down;
    if(a.y - b.y === 1 && b.x === a.x) return Direction.Up;
    return undefined;
}

export function getArrowName(direction:Direction):string {
    switch(direction) {
        case Direction.Up: return "arrow-up";
        case Direction.Down: return "arrow-down";
        case Direction.Left: return "arrow-left";
        case Direction.Right: return "arrow-right";
    }
}

export function oppositeDirection(d:Direction):Direction {
    switch(d) {
        case Direction.Up: return Direction.Down;
        case Direction.Down: return Direction.Up;
        case Direction.Left: return Direction.Right;
        case Direction.Right: return Direction.Left;
    }
}

export function clockwiseDirection(d:Direction):Direction {
    switch(d) {
        case Direction.Up: return Direction.Right;
        case Direction.Down: return Direction.Left;
        case Direction.Left: return Direction.Up;
        case Direction.Right: return Direction.Down;
    }
}

export function counterClockwiseDirection(d:Direction):Direction {
    switch(d) {
        case Direction.Up: return Direction.Left;
        case Direction.Down: return Direction.Right;
        case Direction.Left: return Direction.Down;
        case Direction.Right: return Direction.Up;
    }
}



export function getNeighbors(location:Coord):Coord[] {
    let directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
    let deltas = directions.map(d => getDelta(d));
    return deltas.map(d => {
        return {x:d.x + location.x, y:d.y + location.y}
    });
}