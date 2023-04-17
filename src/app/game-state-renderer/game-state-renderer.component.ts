import { preserveWhitespacesDefault } from '@angular/compiler';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { GameDataService } from '../game-data.service';
import { GameStateService } from '../game-state.service';
import { MovementClass } from '../GameData/Movement';
import { ImageResource, TextResource } from '../GameData/Resource';
import { TerrainType } from '../GameData/Terrain';
import { UnitType } from '../GameData/Unit';
import { GameState } from '../GameState/GameState';
import { PlayerState } from '../GameState/PlayerState';
import { SettingsState } from '../GameState/SettingsState';
import { TerrainState } from '../GameState/TerrainState';
import { UnitState } from '../GameState/UnitState';
import { PriorityQueue } from '../util/priority-queue';
// import * as fs from 'fs';

let unknownTerrain = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSoVBzuIiGSoThZERRxLFYtgobQVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6OSk6CIl/i8ptIjx4Lgf7+497t4BQqPCVLNrElA1y0jFY2I2tyoGXhHAKPwQ0CsxU0+kFzPwHF/38PH1LsKzvM/9OfqVvMkAn0gcZbphEW8Qz25aOud94hArSQrxOfGEQRckfuS67PIb56LDAs8MGZnUPHGIWCx2sNzBrGSoxDPEYUXVKF/Iuqxw3uKsVmqsdU/+wmBeW0lzneYI4lhCAkmIkFFDGRVYiNCqkWIiRfsxD/+w40+SSyZXGYwcC6hCheT4wf/gd7dmYXrKTQrGgO4X2/4YAwK7QLNu29/Htt08AfzPwJXW9lcbwNwn6fW2Fj4CBraBi+u2Ju8BlzvA0JMuGZIj+WkKhQLwfkbflAMGb4G+Nbe31j5OH4AMdbV8AxwcAuNFyl73eHdPZ2//nmn19wMPIXJ/CIVbwwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YHHwAcF9M3EXwAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAcklEQVQoz92SMQ7AIAhFv6238S46MZh4O9mcvIy3IenQxoWkVMcyASGB9/kuxgiAiAC01sz8wGK4WiuAUoo5mlLa2XCKyBgj52yOikgIwd8FM0+43vu8QUN73ZpBRFqrdZX0H95PWt7wB4bHS198uslwAaIwWpgXE5uNAAAAAElFTkSuQmCC';
let unknownUnit = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSoVBzuIiGSoThZERRxLFYtgobQVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6OSk6CIl/i8ptIjx4Lgf7+497t4BQqPCVLNrElA1y0jFY2I2tyoGXhHAKPwQ0CsxU0+kFzPwHF/38PH1LsKzvM/9OfqVvMkAn0gcZbphEW8Qz25aOud94hArSQrxOfGEQRckfuS67PIb56LDAs8MGZnUPHGIWCx2sNzBrGSoxDPEYUXVKF/Iuqxw3uKsVmqsdU/+wmBeW0lzneYI4lhCAkmIkFFDGRVYiNCqkWIiRfsxD/+w40+SSyZXGYwcC6hCheT4wf/gd7dmYXrKTQrGgO4X2/4YAwK7QLNu29/Htt08AfzPwJXW9lcbwNwn6fW2Fj4CBraBi+u2Ju8BlzvA0JMuGZIj+WkKhQLwfkbflAMGb4G+Nbe31j5OH4AMdbV8AxwcAuNFyl73eHdPZ2//nmn19wMPIXJ/CIVbwwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YHHwAaM7luUisAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAeUlEQVQoz8VSOQ7AIAwzFe+DiY3fkS0TP+zgCnEIaFnqKVEiG+MY5xyAEAIAVd3WFz7CpJQAxBjZi0jHnXPmyHt/omDJVxRUdXw3cejB1hyk6TzU4r94KJ9IFKJpDgs0ObBZQEQehfqWZjqk446dDUbTTQ5v7vQwhxs8GFX1XCGuBAAAAABJRU5ErkJggg==';



enum Direction {
    Up,
    Down,
    Left,
    Right
}

@Component({
    selector: 'app-game-state-renderer',
    templateUrl: './game-state-renderer.component.html',
    styleUrls: ['./game-state-renderer.component.scss']
})
export class GameStateRendererComponent implements OnInit, AfterViewInit {

    gameId?:string;
    gameState?:GameState;
    unitStates?:UnitState[];
    terrainStates?:TerrainState[];
    playerStates?:PlayerState[];
    settingState?:SettingsState;
    movementClasses?:MovementClass[];

    imageResources?:ImageResource[];
    textResources?:TextResource[];
    terrainData?:TerrainType[];
    unitData?:UnitType[];

    selectedUnit?:UnitState;
    selectedTerrain?:TerrainState;
    hoveredUnit?:UnitState;
    hoveredTerrain?:TerrainState;
    cursorLocation?:{x:number, y:number};
    selectedLocation?:{x:number, y:number};
    selectedUnitDistanceMap?:number[][];

    movementChain?:InterfaceState[];
    movementRange?:InterfaceState[];

    //@ViewChild('gameCanvas', {static:false}) gameCanvas:ElementRef<HTMLCanvasElement> = {} as ElementRef<HTMLCanvasElement>;
    //context?:CanvasRenderingContext2D;
    mapStyle:string = '';
    mapContainerStyle:string = '';
    scalingFactor = 2;
    public mapDim:{width:number, height:number} = {width:0, height:0};

    constructor(private gameStateService:GameStateService, private activatedRoute:ActivatedRoute, private gameDataService:GameDataService) {}
    ngAfterViewInit(): void {
        //this.context = this.gameCanvas?.nativeElement?.getContext('2d') ?? undefined;
    }

    public pqTestResults:string = '';
    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe({next : params => {
            this.gameId = params['id'];
            this.updateStates();
        }});
        let pqTest = new PriorityQueue<number>();
        let numbers = [20, 5, 3, 7, 13, 19, 12, 11, 10, 9, 1, 2, 4, 6, 8, 14, 15, 18, 17, 16, 12];
        for(let val of numbers) {
            pqTest.push(val);
        }
        let numbersOut = [];
        while(!pqTest.isEmpty()) {
            numbersOut.push(pqTest.pop());
        }
        this.pqTestResults = numbersOut.join(',');
    }

    updateStates():void {
        if(this.gameId == null) 
            return;
        this.gameStateService.getGameState(this.gameId).subscribe({next: state => this.gameState = state});
        this.gameStateService.getUnitStates(this.gameId).subscribe({next: state => this.unitStates = state});
        this.gameStateService.getTerrainStates(this.gameId).subscribe({
            next: state => {
                this.terrainStates = state;
                let minxy = this.terrainStates
                .map(state => {
                    return {x:state.x, y:state.y};
                })
                .reduce((prev, current, index, arr) => {
                    return {
                        x:prev.x < current.x ? prev.x : current.x,
                        y:prev.y < current.y ? prev.y : current.y
                    };
                });
                let maxxy = this.terrainStates
                .map(state => {
                    return {x:state.x, y:state.y};
                })
                .reduce((prev, current, index, arr) => {
                    return {
                        x:prev.x > current.x ? prev.x : current.x,
                        y:prev.y > current.y ? prev.y : current.y
                    };
                });
                maxxy.x++;
                maxxy.y++;
                this.mapStyle = `transform: scale(${this.scalingFactor});`;
                this.mapDim.width = (maxxy.x - minxy.x)*16;
                this.mapDim.height = (maxxy.y - minxy.y)*16;
                this.mapContainerStyle = `width:${this.mapDim.width}px; height:${this.mapDim.height}px; overflow:visible;`;
            }
        });
        this.gameStateService.getPlayerStates(this.gameId).subscribe({
            next: state => {
                this.playerStates = state;
            }
        });
        this.gameStateService.getSettingState(this.gameId).subscribe({
            next: state => {
                this.settingState = state;
                this.getGameData(this.settingState.modId);
            }
        });
    }

    public getGameData(modId:string) {
        this.gameDataService.getImageResources(modId).subscribe({
            next: list => {
                this.imageResources = list;
            }
        });
        this.gameDataService.getTextResources(modId).subscribe({
            next: list => {
                this.textResources = list;
            }
        });
        this.gameDataService.getUnitTypes(modId).subscribe({
            next: list => {
                this.unitData = list;
            }
        });
        this.gameDataService.getTerrainTypes(modId).subscribe({
            next: list => {
                this.terrainData = list;
            }
        });
        this.gameDataService.getMovementClasses(modId).subscribe({
            next: list => {
                this.movementClasses = list;
            }
        });
    }

    public onHover(position:{x:number, y:number}) {
        this.hoveredTerrain = this.terrainStates?.find(t => t.x === position.x && t.y === position.y);
        this.hoveredUnit = this.unitStates?.find(u => u.x === position.x && u.y === position.y);
        if(this.cursorLocation?.x !== position.x || this.cursorLocation.y !== position.y) {
            this.cursorLocation = position;
            this.calculateMovementChain();
        }
    }

    getDelta(direction:Direction):{x:number, y:number} {
        switch(direction) {
            case Direction.Up: return {x:0, y:-1};
            case Direction.Down: return {x:0, y:1};
            case Direction.Left: return {x:-1, y:0};
            case Direction.Right: return {x:1, y:0};
        }
    }

    getDirection(a:{x:number, y:number}, b:{x:number, y:number}):Direction | undefined {
        if(b.x - a.x === 1 && b.y === a.y) return Direction.Right;
        if(a.x - b.x === 1 && b.y === a.y) return Direction.Left;
        if(b.y - a.y === 1 && b.x === a.x) return Direction.Down;
        if(a.y - b.y === 1 && b.x === a.x) return Direction.Up;
        return undefined;
    }

    getArrowName(direction:Direction):string {
        switch(direction) {
            case Direction.Up: return "arrow-up";
            case Direction.Down: return "arrow-down";
            case Direction.Left: return "arrow-left";
            case Direction.Right: return "arrow-right";
        }
    }

    oppositeDirection(d:Direction):Direction {
        switch(d) {
            case Direction.Up: return Direction.Down;
            case Direction.Down: return Direction.Up;
            case Direction.Left: return Direction.Right;
            case Direction.Right: return Direction.Left;
        }
    }

    clockwiseDirection(d:Direction):Direction {
        switch(d) {
            case Direction.Up: return Direction.Right;
            case Direction.Down: return Direction.Left;
            case Direction.Left: return Direction.Up;
            case Direction.Right: return Direction.Down;
        }
    }

    counterClockwiseDirection(d:Direction):Direction {
        switch(d) {
            case Direction.Up: return Direction.Left;
            case Direction.Down: return Direction.Right;
            case Direction.Left: return Direction.Down;
            case Direction.Right: return Direction.Up;
        }
    }

    private calculateMovementChain() {
        //PRECONDITIONS
        //console.debug('Checking Preconditions');
        if(!this.selectedUnit) {
            this.movementChain = undefined;
            console.debug('No selected unit!');
            return;
        }
        let selectedUnitData = this.unitData?.find(u => u.name === this.selectedUnit?.name);
        if(!selectedUnitData) {
            this.movementChain = undefined;
            console.debug('Could not find unit data for selected unit!');
            return;
        }
        let selectedMovementClass = this.movementClasses?.find(m => m.name === selectedUnitData?.movementClass);
        if(!selectedMovementClass) {
            this.movementChain = undefined;
            console.debug('Could not find Movement Class for selected unit!');
            return;
        }
        if(!this.cursorLocation) {
            this.movementChain = undefined;
            console.debug('Could not find Cursor!');
            return;
        }
        if(this.cursorLocation.x === this.selectedUnit.x && this.cursorLocation.y === this.selectedUnit.y) {
            this.movementChain = undefined;
            console.debug('Cursor was on Selected Unit!');
            return;
        }
        let costToEnter = this.costToMoveInto(this.cursorLocation, selectedMovementClass);
        if(costToEnter == null) {
            this.movementChain = undefined;
            console.debug('Unit unable to enter targeted location');
            return;
        }
        if(this.cursorLocation.x === this.movementChain?.at(-1)?.x && this.cursorLocation.y === this.movementChain?.at(-1)?.y) {
            //We shouldn't recalculate for the same location
            console.debug('Cursor already on last point in chain');
            return;
        }

        //console.debug('Preconditions met!');
        //Check if the currently calculated move is valid
        let lastMove:InterfaceState | undefined = undefined;
        let totalMove:number | undefined = undefined;
        if(this.movementChain) {
            totalMove = this.pathCost(this.movementChain, selectedMovementClass);
            if(totalMove == null) {
                console.debug('Existing path is invalid! (should never happen...?)');
                this.movementChain = undefined;
                this.calculateMovementChain();
                return;
            }
            lastMove = this.movementChain.at(-1);
        }

        if(lastMove && this.movementChain) {
            //let newInterfaceState:InterfaceState | undefined = undefined;
            let direction = this.getDirection(lastMove, this.cursorLocation);
            if(direction == null) {
                console.debug('Cursor location isn\'t adjacent to last position');
                console.debug('lastMove', lastMove);
                console.debug('this.cursorLocation', this.cursorLocation);
                this.movementChain = undefined;
                this.calculateMovementChain();
                return;
            }
            let arrowName = this.getArrowName(direction);
            let newInterfaceState = new InterfaceState(arrowName, this.cursorLocation.x, this.cursorLocation.y);
            let existingInterfaceState = this.movementChain.find(i => i.x === newInterfaceState.x && i.y === newInterfaceState.y);
            if(existingInterfaceState) {
                //console.log('Attempting rollback');
                while(
                    this.movementChain.length > 0 &&
                    (
                        this.movementChain.at(-1)?.x !== existingInterfaceState.x 
                        || this.movementChain.at(-1)?.y !== existingInterfaceState.y
                    )
                ) {
                    this.movementChain.pop();
                }
                this.movementChain = this.reifyMovementChain(this.movementChain);
                return;
            }
            let currentMove = this.costToMoveInto(newInterfaceState, selectedMovementClass);
            if(currentMove == null) {
                console.debug('Unable to move into terrain at', newInterfaceState.x, newInterfaceState.y);
                this.movementChain = undefined;
                this.calculateMovementChain();
                return;
            }
            totalMove ??= 0;
            totalMove += currentMove;
            if(totalMove > selectedUnitData.movementRange) {
                console.debug('Too expensive to move into terrain at', newInterfaceState.x, newInterfaceState.y);
                this.movementChain = undefined;
                this.calculateMovementChain();
                return;
            }
            this.movementChain.push(newInterfaceState);
            this.movementChain = this.reifyMovementChain(this.movementChain);
            return;
        }

        //If we've gotten here then we need to calculate a completely new path
        console.debug('starting new path');
        this.movementChain = [];
        totalMove = 0;

        let direction = this.getDirection(this.selectedUnit, this.cursorLocation);
        if(direction != null) {
            let arrowName = this.getArrowName(direction);

            let newInterfaceState = new InterfaceState(arrowName, this.cursorLocation.x, this.cursorLocation.y);

            let currentMove = this.costToMoveInto(newInterfaceState, selectedMovementClass);
            if(currentMove == null) {
                console.debug('Unable to move into terrain at', newInterfaceState.x, newInterfaceState.y);
                this.movementChain = undefined;
                return;
            }
            totalMove += currentMove;
            if(totalMove > selectedUnitData.movementRange) {
                console.debug('Too expensive to move into terrain at', newInterfaceState.x, newInterfaceState.y);
                this.movementChain = undefined;
                return;
            }
            this.movementChain.push(newInterfaceState);
            this.movementChain = this.reifyMovementChain(this.movementChain);
            return;
        }

        let min = this.terrainStates?.map(t => {return {x:t.x, y:t.y};})?.reduce(
            (previous, next, index, arr) => {
                return {x:Math.min(previous.x, next.x), y:Math.min(previous.y, next.y)};
            }
        );

        let max = this.terrainStates?.map(t => {return {x:t.x, y:t.y};})?.reduce(
            (previous, next, index, arr) => {
                return {x:Math.max(previous.x, next.x), y:Math.max(previous.y, next.y)};
            }
        );

        if(!min || !max) {
            console.error('Unable to calculate minimum and maximum sizes of map!');
            return;
        }

        if(!this.selectedUnitDistanceMap) {
            console.error('Distance Map wasn\'t calculated for selected unit!');
            return;
        }

        let possibleShortestPath = this.getShortestPath(
            this.selectedUnitDistanceMap,
            this.cursorLocation,
            min,
            max
        );
        if(!possibleShortestPath) {
            this.movementChain = undefined;
            return;
        }
        this.movementChain = this.reifyMovementChain(possibleShortestPath);
    }

    private printMap(map:number[][]):void {
        for(let j = 0; j < map.length; j++) {
            let line = '';
            for(let i = 0; i < map[j].length; i++) {
                let val = map[j][i];
                if(val === Infinity) {
                    line += 'INF';
                } else {
                    line += val;
                }
                while(line.length % 4 != 0) {
                    line += ' ';
                }
            }
            console.debug(line);
        }
    }

    private printMapBool(map:boolean[][]):void {
        for(let j = 0; j < map.length; j++) {
            let line = '';
            for(let i = 0; i < map[j].length; i++) {
                let val = map[j][i];
                if(val) {
                    line += '1';
                } else {
                    line += '0';
                }
                while(line.length % 4 != 0) {
                    line += ' ';
                }
            }
            console.debug(line);
        }
    }

    private calculateDistanceMap(
        unit:UnitState,
        unitData:UnitType,
        terrains:TerrainState[],
        movementClass:MovementClass
    ): number[][] {
        let terrainCosts:{x:number, y:number, cost?:number}[] = terrains.map(t => {
            let cost = this.costToMoveInto(t, movementClass);
            return {x:t.x, y:t.y, cost};
        });
        let min:{x:number, y:number} = terrains.map(t => {return {x:t.x, y:t.y};}).reduce(
            (prevPoint, currentPoint, index, arr) => {
                return {x:Math.min(prevPoint.x, currentPoint.x), y:Math.min(prevPoint.y, currentPoint.y)};
            }
        );
        let max:{x:number, y:number} = terrains.map(t => {return {x:t.x, y:t.y};}).reduce(
            (prevPoint, currentPoint, index, arr) => {
                return {x:Math.max(prevPoint.x, currentPoint.x), y:Math.max(prevPoint.y, currentPoint.y)};
            }
        );
        let size:{x:number, y:number} = {x:max.x-min.x+1, y:max.y-min.y+1};
        //console.debug('size', size, 'min', min, 'max', max);
        let costMap:number[][] = new Array<number[]>(size.y);
        for(let i = 0; i < size.y; i++) {
            costMap[i] = new Array<number>(size.x);
            costMap[i].fill(Infinity);
        }
        for(let cost of terrainCosts) {
            costMap[cost.y - min.y][cost.x - min.x] = cost.cost ?? Infinity;
        }
        //console.debug('costMap', costMap);
        //this.printMap(costMap);
        let start:{x:number, y:number} = unit;
        //distance undefined is infinity
        let nodes = terrains.map(t => {
            let ret = {x:t.x, y:t.y, distance:t.x === start.x && t.y === start.y ? 0 : undefined};
            return ret;
        });
        let distanceMap:number[][] = new Array<number[]>(size.y);
        for(let i = 0; i < size.y; i++) {
            distanceMap[i] = new Array<number>(size.x);
            distanceMap[i].fill(Infinity);
        }
        for(let node of nodes) {
            distanceMap[node.y - min.y][node.x - min.x] = node.distance ?? Infinity;
        }
        let visited:boolean[][] = new Array<boolean[]>(size.y);
        for(let i = 0; i < size.y; i++) {
            visited[i] = new Array<boolean>(size.x);
            visited[i].fill(false);
        }
        let current = start;
        let finished = false;
        let maxSearch = 10000;
        while(!finished) {
            if(visited[current.y - min.y][current.x - min.x]) {
                console.error('Tried to visit an already visited location!', current);
                break;
            }
            if(maxSearch > 0) {
                maxSearch--;
            } else {
                console.error('Path Search took too long! (Infinite loop?)');
                break;
            }
            let neighbors = this.getNeighbors(current);
            neighbors = neighbors.filter(n => 
                n.x >= min.x && n.x <= max.x && n.y >= min.y && n.y <= max.y
                && costMap[n.y-min.y][n.x - min.x] < Infinity
            );
            for(let n of neighbors) {
                let cost = costMap[n.y - min.y][n.x - min.x];
                let initCost = distanceMap[current.y - min.y][current.x - min.x];
                let finalCost = initCost + cost;
                let existingDistance = distanceMap[n.y - min.y][n.x - min.x];
                // if(existingDistance === Infinity) {
                //     continue;
                // }
                distanceMap[n.y - min.y][n.x - min.x] = Math.min(existingDistance, finalCost);
            }
            visited[current.y - min.y][current.x - min.x] = true;
            // if(unvisited.length === 0) {
            //     finished = true;
            //     continue;
            // }
            let lowestUnvisited:{x:number, y:number} = {x:0, y:0};
            let anyUnvisited:boolean = false;
            for(let j = 0; j < size.y; j++) {
                for(let i = 0; i < size.x; i++) {
                    if(!visited[j][i]) {
                        anyUnvisited = true;
                        let currentLowest = distanceMap[lowestUnvisited.y][lowestUnvisited.x];
                        let candidateLowest = distanceMap[j][i];
                        if(candidateLowest < currentLowest || visited[lowestUnvisited.y][lowestUnvisited.x]) {
                            lowestUnvisited.x = i;
                            lowestUnvisited.y = j;
                        }
                    }
                }
            }
            if(!anyUnvisited) {
                finished = true;
                continue;
            }
            lowestUnvisited.x += min.x;
            lowestUnvisited.y += min.y;
            current = lowestUnvisited;
            if(distanceMap[current.y - min.y][current.x - min.x] === Infinity) {
                finished = true;
                continue;
            }
        }

        for(let j = 0; j < distanceMap.length; j++) {
            for(let i = 0; i < distanceMap[j].length; i++) {
                if(distanceMap[j][i] > unitData.movementRange) {
                    distanceMap[j][i] = Infinity;
                }
            }
        }
        return distanceMap;
    }

    private getShortestPath(
        distanceMap:number[][],
        end:{x:number, y:number},
        min:{x:number, y:number},
        max:{x:number, y:number}
    ):{x:number, y:number}[] | undefined {
        let current = end;

        let totalDistance = distanceMap[end.y - min.y][end.x - min.x];
        if(totalDistance === Infinity) {
            return undefined;
        }

        let path:{x:number, y:number}[] = [current];
        while(distanceMap[current.y - min.y][current.x - min.x] !== 0) {
            let neighbors = this.getNeighbors(current);
            neighbors = neighbors.filter(n => {
                if(n.x > max.x || n.y > max.y || n.x < min.x || n.y < min.y) {
                    return false;
                }
                if(distanceMap[n.y - min.y][n.x - min.x] === Infinity) {
                    return false;
                }
                return !path.find(p => p.x === n.x && p.y === n.y);
            });
            if(neighbors.length === 0) {
                //console.info('There is no path between these two points', start, end);
                return undefined;
            }
            let shortestNeighbor = neighbors[0];
            for(let candidateNeighbor of neighbors) {
                //let lowestDistance = nodes.find(n => n.x === shortestNeighbor.x && n.y === shortestNeighbor.y)?.distance;
                let lowestDistance = distanceMap[shortestNeighbor.y - min.y][shortestNeighbor.x - min.x];
                //let candidateDistance = nodes.find(n => n.x === candidateNeighbor.x && n.y === candidateNeighbor.y)?.distance;
                let candidateDistance = distanceMap[candidateNeighbor.y - min.y][candidateNeighbor.x - min.x];
                if(candidateDistance < lowestDistance) {
                    shortestNeighbor = candidateNeighbor;
                }
            }
            current = shortestNeighbor;
            path.push(current);
        }
        path = path.reverse();
        path.shift();
        return path;
    }

    private getNeighbors(location:{x:number, y:number}):{x:number, y:number}[] {
        let directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
        let deltas = directions.map(d => this.getDelta(d));
        return deltas.map(d => {
            return {x:d.x + location.x, y:d.y + location.y}
        });
    }

    private pathCost(path:{x:number, y:number}[], movementClass:MovementClass):number | undefined {
        let totalCost = 0;
        // if(path.length === 0) {
        //     return undefined;
        // }
        for(let move of path) {
            let terrain = this.terrainStates?.find(t => t.x === move.x && t.y === move.y);
            if(!terrain) {
                return undefined;
            }
            let cost = this.costToMoveInto(terrain, movementClass);
            if(cost == null) {
                return undefined;
            }
            totalCost += cost;
        }
        return totalCost;
    }

    private costToMoveInto(location:{x:number, y:number}, movementClass:MovementClass):number | undefined {
        let terrain = this.terrainStates?.find(t => t.x === location.x && t.y === location.y);
        if(!terrain) {
            console.debug('Unable to find terrain at', location);
            return undefined;
        }
        let enemyUnitAtLocation = this.unitStates?.find(u => {
            if(u.x !== terrain?.x || u.y !== terrain.y) {
                return false;
            }
            let thisOwner = this.playerStates?.find(p => p.id === this.selectedUnit?.owner);
            let candidateOwner = this.playerStates?.find(p => p.id === u.owner);
            return thisOwner &&
                candidateOwner &&
                thisOwner.id !== candidateOwner.id &&
                (
                    thisOwner.team !== candidateOwner.team ||
                    thisOwner.team === undefined
                )
            ;
        });
        if(enemyUnitAtLocation) {
            return undefined;
        }
        if(movementClass.movementCosts[terrain.name] != null) {
            let cost = movementClass.movementCosts[terrain.name];
            if(this.gameState?.variant && movementClass.variantMods) {
                let variantMods = movementClass.variantMods[this.gameState.variant]
                if(variantMods != null) {
                    let variantCost = variantMods[terrain.name];
                    if(variantCost != null) {
                        cost += variantCost;
                    }
                }
            }
            return cost;
        }
        return undefined;
    }

    private reifyMovementChain(path:{x:number, y:number}[]):InterfaceState[] {
        let ret = path.map(n => new InterfaceState('', n.x, n.y));
        for(let i = -1; i < ret.length - 1; i++) {
            let a = 
                (i <= 0) ?
                new InterfaceState('', this.selectedUnit?.x ?? -1, this.selectedUnit?.y ?? -1) :
                ret[i-1];
            let b = 
                (i < 0) ?
                new InterfaceState('', this.selectedUnit?.x ?? -1, this.selectedUnit?.y ?? -1) :
                ret[i];
            let c = ret[i+1];
            
            let left:boolean = false, right:boolean = false, up:boolean = false, down:boolean = false;
            for(let compare of [a, c]) {
                if(compare.x === b.x - 1) {
                    left = true;
                    continue;
                }
                if(compare.x === b.x + 1) {
                    right = true;
                    continue;
                }
                if(compare.y === b.y - 1) {
                    up = true;
                    continue;
                }
                if(compare.y === b.y + 1) {
                    down = true;
                    continue;
                }
            }
            if(left && right) {
                b.name = 'thru-right';
            }
            if(left && up) {
                b.name = 'thru-leftup';
            }
            if(left && down) {
                b.name = 'thru-downleft';
            }
            if(right && up) {
                b.name = 'thru-upright';
            }
            if(right && down) {
                b.name = 'thru-rightdown';
            }
            if(down && up) {
                b.name = 'thru-up';
            }

            
            if(c.x === b.x - 1) {
                c.name = 'arrow-left';
            }
            if(c.x === b.x + 1) {
                c.name = 'arrow-right';
            }
            if(c.y === b.y - 1) {
                c.name = 'arrow-up';
            }
            if(c.y === b.y + 1) {
                c.name = 'arrow-down';
            }

            ret[i+1] = new InterfaceState(c.name, c.x, c.y);
            if(i >= 0) {
                ret[i] = new InterfaceState(b.name, b.x, b.y);
            }
            if(i > 0) {
                ret[i-1] = new InterfaceState(a.name, a.x, a.y);
            }
        }
        return ret;
    }

    public onClick(position:{x:number, y:number}) {
        this.cursorLocation = position;
        if(this.selectedLocation == null || this.selectedLocation.x != position.x || this.selectedLocation.y != position.y) {
            this.selectedLocation = position;
        } else {
            this.selectedLocation = undefined;
        }
        this.selectedTerrain = this.terrainStates?.find(t => t.x === this.selectedLocation?.x && t.y === this.selectedLocation.y);
        this.selectedUnit = this.unitStates?.find(u => u.x === this.selectedLocation?.x && u.y === this.selectedLocation.y);
        if(!this.selectedUnit) {
            this.selectedLocation = undefined;
            this.movementChain = undefined;
            this.movementRange = undefined;
        } else {
            //TODO: This needs to take CO powers/active player into account!
            let selectedUnitData = this.unitData?.find(u => u.name === this.selectedUnit?.name);
            if(!selectedUnitData) {
                return;
            }
            let movementClass = this.movementClasses?.find(m => m.name === selectedUnitData?.movementClass);
            if(!movementClass) {
                return;
            }
            if(!this.terrainStates) {
                return;
            }
            this.selectedUnitDistanceMap = this.calculateDistanceMap(
                this.selectedUnit,
                selectedUnitData,
                this.terrainStates,
                movementClass
            );
            if(this.selectedUnitDistanceMap) {
                this.movementRange = [];
                let min = this.terrainStates.map(t => {return {x:t.x, y:t.y};}).reduce((prev, next, index, arr) => {return {x:Math.min(prev.x, next.x), y:Math.min(prev.y, next.y)}});
                for(let j = 0; j < this.selectedUnitDistanceMap.length; j++) {
                    for(let i = 0; i < this.selectedUnitDistanceMap[j].length; i++) {
                        if(this.selectedUnitDistanceMap[j][i] < Infinity) {
                            this.movementRange.push(new InterfaceState('movement-indicator', i + min.x, j + min.y, 0.5));
                        }
                    }
                }
            }
        }
    }

    public isUnitState(state:UnitState | TerrainState): state is UnitState {
        return state['ammo'] !== undefined;
    }

    public isTerrainState(state:UnitState | TerrainState): state is TerrainState {
        return !this.isUnitState(state);
    }
}

@Component({
    selector:'unit-renderer',
    templateUrl:'./unit-renderer.component.html',
    styleUrls:['./parts.component.scss']
})
export class UnitRendererComponent implements OnChanges {
    @Input('unitState') unitState?:UnitState;
    @Input('imageResources') imageResources?:ImageResource[];
    @Input('textResources') textResources?:TextResource[];
    @Input('playerStates') playerStates?:PlayerState[];
    @Input('gameStateRenderer') gameStateRenderer?:GameStateRendererComponent;
    @Input('ignorePosition') ignorePosition?:boolean;
    @Input('isSelected') isSelected?:boolean;
    ngOnChanges(): void {
        this.updateSrc();
    }

    updateSrc():void {
        let owner = this.playerStates?.find(p => p.id === this.unitState?.owner);
        let armyColor = owner?.armyColor;
        let imageResource = this.imageResources?.find(r => 
            r.key === this.unitState?.name
        &&  r.type === 'unit'
        &&  r.armyColor === armyColor
        );
        if(imageResource)
            this.unitSrc = `data:image/png;base64,${imageResource.smallImage}`;
        else
            this.unitSrc = `data:image/png;base64,${unknownUnit}`;
        let positionString:string;
        if(this.ignorePosition) 
            positionString = `left:0px;top:0px;`;
        else
            positionString = `left:${16 * (this.unitState?.x ?? 0)}px;top:${16 * (this.unitState?.y ?? 0)}px;`;
        let adjustment = 1;
        if(this.isSelected) {
            adjustment += 10;
        }
        this.unitStyle = `${positionString}z-index:${adjustment};`; 
        let facing = owner?.unitFacing;
        if(facing === 1)
            this.unitStyle += `transform:scaleX(-1);`
    }

    public onClick() {
        this.gameStateRenderer?.onClick({x:this.unitState?.x ?? -1, y:this.unitState?.y ?? -1});
    }

    public onHover() {
        this.gameStateRenderer?.onHover({x:this.unitState?.x ?? -1, y:this.unitState?.y ?? -1});
    }

    unitSrc:string = '';
    unitStyle:string = '';
}



@Component({
    selector:'terrain-renderer',
    templateUrl:'./terrain-renderer.component.html',
    styleUrls:['./parts.component.scss']
})
export class TerrainRendererComponent implements OnChanges {
    @Input('terrainState') terrainState?:TerrainState;
    @Input('imageResources') imageResources?:ImageResource[];
    @Input('textResources') textResources?:TextResource[];
    @Input('playerStates') playerStates?:PlayerState[];
    @Input('gameStateRenderer') gameStateRenderer?:GameStateRendererComponent;
    @Input('ignorePosition') ignorePosition?:boolean;
    ngOnChanges(): void {
        this.updateSrc();
    }

    updateSrc():void {
        let armyColor = this.playerStates?.find(p => p.id === this.terrainState?.owner)?.armyColor;
        let imageResource = this.imageResources?.find(r => 
            r.key === this.terrainState?.name
        &&  r.type === 'terrain'
        &&  r.armyColor === armyColor
        );
        if(imageResource)
            this.terrainSrc = `data:image/png;base64,${imageResource.smallImage}`;
        else
            this.terrainSrc = `data:image/png;base64,${unknownTerrain}`;
        let positionString:string;
        if(this.ignorePosition) 
            positionString = `left:0px;top:0px;`;
        else
            positionString = `left:${16 * (this.terrainState?.x ?? 0)}px;top:${16 * (this.terrainState?.y ?? 0)}px;`
        this.terrainStyle = `${positionString}z-index:0`; 
    }

    public onClick() {
        this.gameStateRenderer?.onClick({x:this.terrainState?.x ?? -1, y:this.terrainState?.y ?? -1});
    }

    public onHover() {
        this.gameStateRenderer?.onHover({x:this.terrainState?.x ?? -1, y:this.terrainState?.y ?? -1});
    }

    terrainSrc:string = '';
    terrainStyle:string = '';
    altText:string = '';
}

@Component({
    selector:'hover-panel-renderer',
    templateUrl:'./hover-panel-renderer.component.html',
    styleUrls:['./parts.component.scss']
})
export class HoverPanelRendererComponent implements OnChanges {
    @Input('unitState') unitState?:UnitState;
    @Input('terrainState') terrainState?:TerrainState;
    @Input('textResources') textResources?:TextResource[];
    @Input('imageResources') imageResources?:ImageResource[];
    @Input('terrainData') terrainData?:TerrainType[];
    @Input('unitData') unitData?:UnitType[];
    @Input('playerStates') playerStates?:PlayerState[];
    @Input('gameStateRenderer') gameStateRenderer?:GameStateRendererComponent;
    ngOnChanges(): void {
        this.updateSrc();
    }
    
    public updateSrc() {
        this.hoverStyle = `left:${this.gameStateRenderer?.mapDim.width ?? 0}px; top:0px; overflow:visible;`;
        if(this.terrainState)
            this.terrainName = this.textResources?.find(r => r.type === 'terrain' && r.key === this.terrainState?.name)?.shortName ?? '';
        if(this.unitState)
            this.unitName = this.textResources?.find(r => r.type === 'unit' && r.key === this.unitState?.name)?.shortName ?? '';
    }

    hoverStyle:string = '';
    terrainName:string = '';
    unitName:string = '';
}

class InterfaceState {
    constructor(
        public name:string,
        public x:number,
        public y:number,
        public opacity:number | undefined = undefined
    )
    {}
}

@Component({
    selector:'interface-renderer',
    templateUrl:'./interface-renderer.component.html',
    styleUrls:['./parts.component.scss']
})
export class InterfaceRendererComponent implements OnChanges {
    @Input('interfaceState') interfaceState?:InterfaceState;
    @Input('imageResources') imageResources?:ImageResource[];
    @Input('textResources') textResources?:TextResource[];
    @Input('gameStateRenderer') gameStateRenderer?:GameStateRendererComponent;
    @Input('ignorePosition') ignorePosition?:boolean;
    @Input('layerOffset') layerOffset?:number;
    ngOnChanges(): void {
        this.updateSrc();
    }

    updateSrc():void {
        let imageResource = this.imageResources?.find(r => 
            r.key === this.interfaceState?.name
        &&  r.type === 'interface'
        );
        if(imageResource)
            this.interfaceSrc = `data:image/png;base64,${imageResource.smallImage}`;
        else
            this.interfaceSrc = `data:image/png;base64,${unknownTerrain}`;
        let positionString:string;
        if(this.ignorePosition) 
            positionString = `left:0px;top:0px;`;
        else
            positionString = `left:${16 * (this.interfaceState?.x ?? 0)}px;top:${16 * (this.interfaceState?.y ?? 0)}px;`
        this.interfaceStyle = `${positionString}z-index:${2 + (this.layerOffset ?? 0)};opacity:${this.interfaceState?.opacity ?? 1}`; 
    }

    public onClick() {
        this.gameStateRenderer?.onClick({x:this.interfaceState?.x ?? -1, y:this.interfaceState?.y ?? -1});
    }

    public onHover() {
        this.gameStateRenderer?.onHover({x:this.interfaceState?.x ?? -1, y:this.interfaceState?.y ?? -1});
    }

    interfaceSrc:string = '';
    interfaceStyle:string = '';
    altText:string = '';
}