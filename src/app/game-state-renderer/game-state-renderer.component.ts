import { preserveWhitespacesDefault } from '@angular/compiler';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { GameDataService } from '../game-data.service';
import { GameStateService } from '../game-state.service';
import { MovementClass } from '../GameData/Movement';
import { ImageResource, TextResource } from '../GameData/Resource';
import { TerrainType } from '../GameData/Terrain';
import { UnitType, WeaponType } from '../GameData/Unit';
import { GameState } from '../GameState/GameState';
import { PlayerState } from '../GameState/PlayerState';
import { SettingsState } from '../GameState/SettingsState';
import { TerrainState } from '../GameState/TerrainState';
import { UnitState } from '../GameState/UnitState';
import { PriorityQueue } from '../util/priority-queue';
import { HashMap, HashSet, toMapWithMapper } from '../util/hash-map';
import { Coord, coordEquals, coordHash, coordIdentity, coordSubtract } from '../util/coord';
import { Direction, getArrowName, getDelta, getDirection, getNeighbors } from '../util/direction';
import { stringHash } from '../util/hash-function';
import { calculateMovementCostVariant, getMovementRangeAdjustment } from '../GameState/Calculator';
import { CommanderType, PlayerType } from '../GameData/Commander';
import { PassiveGlobalEffect, PassiveUnitEffect } from '../GameData/Effect';
import { firstValueFrom } from 'rxjs';
// import * as fs from 'fs';

let unknownTerrain = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSoVBzuIiGSoThZERRxLFYtgobQVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6OSk6CIl/i8ptIjx4Lgf7+497t4BQqPCVLNrElA1y0jFY2I2tyoGXhHAKPwQ0CsxU0+kFzPwHF/38PH1LsKzvM/9OfqVvMkAn0gcZbphEW8Qz25aOud94hArSQrxOfGEQRckfuS67PIb56LDAs8MGZnUPHGIWCx2sNzBrGSoxDPEYUXVKF/Iuqxw3uKsVmqsdU/+wmBeW0lzneYI4lhCAkmIkFFDGRVYiNCqkWIiRfsxD/+w40+SSyZXGYwcC6hCheT4wf/gd7dmYXrKTQrGgO4X2/4YAwK7QLNu29/Htt08AfzPwJXW9lcbwNwn6fW2Fj4CBraBi+u2Ju8BlzvA0JMuGZIj+WkKhQLwfkbflAMGb4G+Nbe31j5OH4AMdbV8AxwcAuNFyl73eHdPZ2//nmn19wMPIXJ/CIVbwwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YHHwAcF9M3EXwAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAcklEQVQoz92SMQ7AIAhFv6238S46MZh4O9mcvIy3IenQxoWkVMcyASGB9/kuxgiAiAC01sz8wGK4WiuAUoo5mlLa2XCKyBgj52yOikgIwd8FM0+43vu8QUN73ZpBRFqrdZX0H95PWt7wB4bHS198uslwAaIwWpgXE5uNAAAAAElFTkSuQmCC';
let unknownUnit = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSoVBzuIiGSoThZERRxLFYtgobQVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6OSk6CIl/i8ptIjx4Lgf7+497t4BQqPCVLNrElA1y0jFY2I2tyoGXhHAKPwQ0CsxU0+kFzPwHF/38PH1LsKzvM/9OfqVvMkAn0gcZbphEW8Qz25aOud94hArSQrxOfGEQRckfuS67PIb56LDAs8MGZnUPHGIWCx2sNzBrGSoxDPEYUXVKF/Iuqxw3uKsVmqsdU/+wmBeW0lzneYI4lhCAkmIkFFDGRVYiNCqkWIiRfsxD/+w40+SSyZXGYwcC6hCheT4wf/gd7dmYXrKTQrGgO4X2/4YAwK7QLNu29/Htt08AfzPwJXW9lcbwNwn6fW2Fj4CBraBi+u2Ju8BlzvA0JMuGZIj+WkKhQLwfkbflAMGb4G+Nbe31j5OH4AMdbV8AxwcAuNFyl73eHdPZ2//nmn19wMPIXJ/CIVbwwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YHHwAaM7luUisAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAeUlEQVQoz8VSOQ7AIAwzFe+DiY3fkS0TP+zgCnEIaFnqKVEiG+MY5xyAEAIAVd3WFz7CpJQAxBjZi0jHnXPmyHt/omDJVxRUdXw3cejB1hyk6TzU4r94KJ9IFKJpDgs0ObBZQEQehfqWZjqk446dDUbTTQ5v7vQwhxs8GFX1XCGuBAAAAABJRU5ErkJggg==';


// let locationHasher = (location:Coord) => location.x * 1109 + location.y;
// let locationEqualer = (a:Coord, b:Coord) => a.x === b.x && a.y === b.y;



interface ImageResourceKey {
    key:string;
    type:string;
    armyColor?:string;
    variant?:string;
    orientation?:number;
}

function imageResourceIdentity(key:ImageResourceKey):ImageResourceKey {
    return key;
}

function imageResourceHasher(key:ImageResourceKey):number {
    let hashString = key.key + key.type;
    hashString += key.armyColor ?? '';
    hashString += key.variant ?? '';
    hashString += key.orientation ?? '';
    //console.debug(hashString);
    return stringHash(hashString);
}

function imageResourceEqual(a:ImageResourceKey, b:ImageResourceKey): boolean {
    return a.key === b.key
        && a.type === b.type
        && a.armyColor === b.armyColor
        && a.variant === b.variant
        && a.orientation === b.orientation;
}

@Component({
    selector: 'app-game-state-renderer',
    templateUrl: './game-state-renderer.component.html',
    styleUrls: ['./game-state-renderer.component.scss']
})
export class GameStateRendererComponent implements OnInit, AfterViewInit {
    loaded:boolean | null = null;
    error:string | null = null;

    game:GameState = {
        id:'-1',
        day:-1,
        playerTurn:-1,
        playerOrder:[],
        variant:'',
        active:false
    };
    units = new HashMap<Coord, UnitState>(coordHash, coordEquals);
    terrains = new HashMap<Coord, TerrainState>(coordHash, coordEquals);
    // playerStates?:PlayerState[];
    players = new HashMap<string, PlayerState>(stringHash);
    settings:SettingsState = {
        id:'-1',
        startingFunds:0,
        incomeMultiplier:0,
        fogOfWar:false,
        variant:{},
        coPowers:false,
        teams:false,
        modId:'-1',
        coMeterSize:0,
        coMeterMultiplier:0
    };
    // movementClasses?:MovementClass[];
    movementTypes = new HashMap<string, MovementClass>(stringHash);

    // imageResources?:ImageResource[];
    images = new HashMap<ImageResourceKey, ImageResource>(imageResourceHasher, imageResourceEqual);
    texts:TextResource[] = [];
    // terrainData?:TerrainType[];
    // unitData?:UnitType[];
    // weaponData?:WeaponType[];
    terrainTypes = new HashMap<string, TerrainType>(stringHash);
    unitTypes = new HashMap<string, UnitType>(stringHash);
    weaponTypes = new HashMap<string, WeaponType>(stringHash);
    commanderTypes = new HashMap<string, CommanderType>(stringHash);
    playerTypes = new HashMap<string, PlayerType>(stringHash);
    passiveUnitEffects = new HashMap<string, PassiveUnitEffect>(stringHash);
    passiveGlobalEffects = new HashMap<string, PassiveGlobalEffect>(stringHash);
    // imageResources = new HashMap

    selectedUnit?:UnitState;
    selectedTerrain?:TerrainState;
    hoveredUnit?:UnitState;
    hoveredTerrain?:TerrainState;
    cursorLocation?:Coord;
    selectedLocation?:Coord;
    selectedUnitDistanceMap?:HashMap<Coord, number>;

    movementChain?:InterfaceState[];
    movementRange?:InterfaceState[];
    targets?:InterfaceState[];

    //@ViewChild('gameCanvas', {static:false}) gameCanvas:ElementRef<HTMLCanvasElement> = {} as ElementRef<HTMLCanvasElement>;
    //context?:CanvasRenderingContext2D;
    mapStyle:string = '';
    mapContainerStyle:string = '';
    scalingFactor = 2;
    public mapDim:{width:number, height:number} = {width:0, height:0};
    public mapCoords:{minx:number, maxx:number, miny:number, maxy:number} = {minx:0, miny:0, maxx:0, maxy:0};
    gameLoaded = false;

    constructor(private gameStateService:GameStateService, private activatedRoute:ActivatedRoute, private gameDataService:GameDataService) {}
    ngAfterViewInit(): void {
        //this.context = this.gameCanvas?.nativeElement?.getContext('2d') ?? undefined;
    }

    async ngOnInit(): Promise<void> {
        try {
            let params = await firstValueFrom(this.activatedRoute.queryParams);
            let gameId:string = params['id'];
            await this.updateStates(gameId);
            this.loaded = true;
        } catch (e:any) {
            console.error('Problem loading page', e);
            if(e['status'] === 0) {
                this.error = "HTTP Response Code 0 (Backend Server Offline?)"
            }
            if(e['status'] === 400) {
                this.error = "HTTP Response Code 400 - " + e['error'];
            }
            if(this.error === null) {
                this.error = 'Unknown Error';
            }
            this.loaded = false;
        }
    }

    async updateStates(gameId:string):Promise<void> {
        let settingsFuture = firstValueFrom(this.gameStateService.getSettingState(gameId));
        let gameFuture = firstValueFrom(this.gameStateService.getGameState(gameId));
        let unitsFuture = firstValueFrom(this.gameStateService.getUnitStates(gameId));
        let terrainsFuture = firstValueFrom(this.gameStateService.getTerrainStates(gameId));
        let playersFuture = firstValueFrom(this.gameStateService.getPlayerStates(gameId));

        this.settings = await settingsFuture;
        let modId = this.settings.modId;
        let imagesFuture = firstValueFrom(this.gameDataService.getImageResources(modId));
        let textsFuture = firstValueFrom(this.gameDataService.getTextResources(modId));
        let unitTypesFuture = firstValueFrom(this.gameDataService.getUnitTypes(modId));
        let terrainTypesFuture = firstValueFrom(this.gameDataService.getTerrainTypes(modId));
        let movementTypesFuture = firstValueFrom(this.gameDataService.getMovementClasses(modId));
        let weaponTypesFuture = firstValueFrom(this.gameDataService.getWeaponTypes(modId));
        let commanderTypesFuture = firstValueFrom(this.gameDataService.getCommanderTypes(modId));
        let playerTypesFuture = firstValueFrom(this.gameDataService.getPlayerTypes(modId));
        let pueFuture = firstValueFrom(this.gameDataService.getPassiveUnitEffects(modId));
        let aueFuture = firstValueFrom(this.gameDataService.getActiveUnitEffects(modId));
        let pteFuture = firstValueFrom(this.gameDataService.getPassiveTerrainEffects(modId));
        let ateFuture = firstValueFrom(this.gameDataService.getActiveTerrainEffects(modId));
        let pgeFuture = firstValueFrom(this.gameDataService.getPassiveGlobalEffects(modId));
        let ageFuture = firstValueFrom(this.gameDataService.getActiveGlobalEffects(modId));

        this.game = await gameFuture;
        this.units = toMapWithMapper(await unitsFuture, u => coordIdentity(u), coordHash, coordEquals);
        this.terrains = toMapWithMapper(await terrainsFuture, t => coordIdentity(t), coordHash, coordEquals);
        let terrainSetup = this.getTerrainStats();
        this.players = toMapWithMapper(await playersFuture, p => p.id, stringHash);

        this.images = toMapWithMapper(await imagesFuture, i => imageResourceIdentity(i), imageResourceHasher, imageResourceEqual);
        this.texts = await textsFuture;

        this.unitTypes = toMapWithMapper(await unitTypesFuture, u => u.name, stringHash);
        this.terrainTypes = toMapWithMapper(await terrainTypesFuture, t => t.name, stringHash);
        this.movementTypes = toMapWithMapper(await movementTypesFuture, m => m.name, stringHash);
        this.weaponTypes = toMapWithMapper(await weaponTypesFuture, w => w.name, stringHash);
        this.commanderTypes = toMapWithMapper(await commanderTypesFuture, c => c.name, stringHash);
        this.playerTypes = toMapWithMapper(await playerTypesFuture, p => p.name, stringHash);
        this.passiveUnitEffects = toMapWithMapper(await pueFuture, e => e.name, stringHash);
        this.passiveGlobalEffects = toMapWithMapper(await pgeFuture, e => e.name, stringHash);
        await terrainSetup;
    }

    private async getTerrainStats():Promise<void> {
        this.mapCoords.minx = Infinity;
        this.mapCoords.maxx = -Infinity;
        this.mapCoords.miny = Infinity;
        this.mapCoords.maxy = -Infinity;
        for(let terrainPair of this.terrains) {
            let terrain = terrainPair.value;
            this.mapCoords.minx = Math.min(this.mapCoords.minx, terrain.x);
            this.mapCoords.miny = Math.min(this.mapCoords.miny, terrain.y);
            this.mapCoords.maxx = Math.max(this.mapCoords.maxx, terrain.x);
            this.mapCoords.maxy = Math.max(this.mapCoords.maxy, terrain.y);
        }
        this.mapCoords.maxx++;
        this.mapCoords.maxy++;
        this.mapStyle = `transform: scale(${this.scalingFactor});`;
        this.mapDim.width = (this.mapCoords.maxx - this.mapCoords.minx)*16;
        this.mapDim.height = (this.mapCoords.maxy - this.mapCoords.miny)*16;
        this.mapContainerStyle = `width:${this.mapDim.width}px; height:${this.mapDim.height}px; overflow:visible;`;
    }

    public onHover(position:Coord) {
        this.hoveredTerrain = this.terrains.get(position);
        this.hoveredUnit = this.units.get(position);
        if(!this.cursorLocation) {
            return;
        }
        if(!coordEquals(this.cursorLocation, position)) {
            this.cursorLocation = position;
            if(!this.selectedUnit) {
                return;
            }
            let unitData = this.unitTypes.get(this.selectedUnit.name);
            if(!unitData) {
                console.error('Unable to find Unit Data for selected Unit!');
                return;
            }
            if(!this.selectedUnitDistanceMap) {
                console.error('Selected Unit doesn\'t have a calculated Distance Map!');
                return;
            }
            let movementClass = this.movementTypes.get(unitData.movementClass);
            if(!movementClass) {
                console.error('Unable to find Movement Class for selected unit!');
                return;
            }
            let occupiedTerrain = this.terrains.get(this.selectedUnit);
            if(!occupiedTerrain) {
                console.error('Could not find terrain where Unit is!');
                return;
            }
            this.movementChain = this.calculateMovementChain(
                this.selectedUnitDistanceMap,
                this.selectedUnit,
                unitData,
                movementClass,
                this.cursorLocation,
                getMovementRangeAdjustment(this.selectedUnit, occupiedTerrain, unitData, this.game, this.settings, this.players, this.commanderTypes, this.playerTypes, this.passiveUnitEffects),
                this.movementChain
            );
        }
    }

    private calculateMovementChain(
        distanceMap:HashMap<Coord, number>,
        selectedUnit:UnitState,
        unitData:UnitType,
        movementClass:MovementClass,
        destination:Coord,
        movementRangeAdjust:number,
        existingMovementChain?:InterfaceState[]
    ):InterfaceState[] | undefined {
        // this.printMap(distanceMap);
        if(coordEquals(destination, selectedUnit)) {
            //console.debug('Cursor was on Selected Unit!');
            return undefined;
        }

        let maxMovementRange = Math.min(selectedUnit.fuel, unitData.movementRange + movementRangeAdjust);

        //===================================================================================================
        //If the cursor is right on the edge of the distance map, we'll try to get the nearest valid position
        //===================================================================================================
        let totalDistance = distanceMap.get(destination) ?? Infinity;
        if(totalDistance === Infinity) {
            let neighbors = getNeighbors(destination);
            let lowestValid:Coord | undefined = undefined;
            for(let n of neighbors) {
                if((distanceMap.get(n) ?? Infinity) < Infinity) {
                    let endOfChain = existingMovementChain?.at(-1);
                    if(endOfChain && coordEquals(endOfChain, n)) {
                        return existingMovementChain;
                    }
                    let distanceOfLowest = lowestValid ? (distanceMap.get(lowestValid) ?? Infinity) : Infinity;
                    let distanceOfN = distanceMap.get(n) ?? Infinity;
                    if(distanceOfN < distanceOfLowest) {
                        lowestValid = n;
                    }
                }
            }
            if(lowestValid) {
                return this.calculateMovementChain(distanceMap, selectedUnit, unitData, movementClass, lowestValid, movementRangeAdjust, existingMovementChain);
            }
            return undefined;
        }
        //===================================================================================================
        //totalDistance is not Infinity, but we still check if the unit can move there
        //===================================================================================================
        if(totalDistance > maxMovementRange) {
            return existingMovementChain;
        }
        //===================================================================================================
        //We don't recalculate if we're already hovering over the last move
        //===================================================================================================
        let lastMove = existingMovementChain?.at(-1);
        if(lastMove != null && coordEquals(destination, lastMove)) {
            return existingMovementChain;
        }

        let variant = this.getVariantForOwner(selectedUnit);

        //Check if the currently calculated move is valid
        let totalMove:number | undefined = undefined;
        if(existingMovementChain) {
            totalMove = this.pathCost(existingMovementChain, movementClass, variant);
        }

        if(lastMove && existingMovementChain) {
            let direction = getDirection(lastMove, destination);
            if(direction == null) {
                return this.calculateMovementChain(distanceMap, selectedUnit, unitData, movementClass, destination, movementRangeAdjust, undefined);
            }
            let arrowName = getArrowName(direction);
            let newInterfaceState = new InterfaceState(arrowName, destination.x, destination.y);
            let existingInterfaceState = existingMovementChain.find(i => i.x === newInterfaceState.x && i.y === newInterfaceState.y);
            if(existingInterfaceState) {
                while(
                    existingMovementChain.length > 0 &&
                    (
                        existingMovementChain.at(-1)?.x !== existingInterfaceState.x 
                        || existingMovementChain.at(-1)?.y !== existingInterfaceState.y
                    )
                ) {
                    existingMovementChain.pop();
                }
                return this.reifyMovementChain(existingMovementChain);
            }
            let currentMove = this.costToMoveInto(newInterfaceState, movementClass, variant);
            if(currentMove == null) {
                return this.calculateMovementChain(
                    distanceMap,
                    selectedUnit,
                    unitData,
                    movementClass,
                    destination,
                    movementRangeAdjust,
                    undefined
                );
            }
            totalMove ??= 0;
            totalMove += currentMove;
            if(totalMove > maxMovementRange) {
                return this.calculateMovementChain(
                    distanceMap,
                    selectedUnit,
                    unitData,
                    movementClass,
                    destination,
                    movementRangeAdjust,
                    undefined
                );
            }
            existingMovementChain.push(newInterfaceState);
            return this.reifyMovementChain(existingMovementChain);
        }

        //If we've gotten here then we need to calculate a completely new path
        console.debug('starting new path');
        existingMovementChain = [];
        totalMove = 0;

        let direction = getDirection(selectedUnit, destination);
        if(direction != null) {
            let arrowName = getArrowName(direction);

            let newInterfaceState = new InterfaceState(arrowName, destination.x, destination.y);

            let currentMove = this.costToMoveInto(newInterfaceState, movementClass, variant);
            if(currentMove == null) {
                return undefined
            }
            totalMove += currentMove;
            if(totalMove > maxMovementRange) {
                return undefined;
            }
            existingMovementChain.push(newInterfaceState);
            return this.reifyMovementChain(existingMovementChain);
        }

        let possibleShortestPath = this.getShortestPath(
            distanceMap,
            destination
        );
        if(!possibleShortestPath) {
            return undefined;
        }
        return this.reifyMovementChain(possibleShortestPath);
    }

    private printMap(map:HashMap<Coord, number>):void {
        for(let j = 0; j < 50; j++) {
            let line = '';
            for(let i = 0; i < 50; i++) {
                let val = map.get({x:i, y:j});
                if(val == null) {
                    line += ' -'
                } else if(val === Infinity) {
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

    private calculateDistanceMap(
        unit:UnitState,
        unitData:UnitType,
        movementRangeAdjust:number,
        terrains:HashMap<Coord, TerrainState>,
        movementClass:MovementClass
    ): HashMap<Coord, number> {
        let timeBegin = performance.now();
        let timeCalc = (label:string) => {
            let now = performance.now();
            console.info(label, (now - timeBegin));
            timeBegin = now;
        };
        let maxMovementRange = Math.min(unit.fuel, unitData.movementRange + movementRangeAdjust);
        let variant = this.getVariantForOwner(unit);

        let terrainCosts = new HashMap<Coord, number>(coordHash, coordEquals);
        for(let terrain of terrains) {
            terrainCosts.put(terrain.key, this.costToMoveInto(terrain.key, movementClass, variant) ?? Infinity);
        }
        timeCalc('Time to calculate Terrain Costs');
        let start:Coord = unit;
        let distanceMap = new HashMap<Coord, number>(coordHash, coordEquals);
        distanceMap.put(start, 0);
        timeCalc('Time to setup Distance Map');
        let unvisited = new HashSet<Coord>(coordHash, coordEquals);
        for(let terrain of terrains) {
            unvisited.insert(terrain.key);
        }
        timeCalc('Time to setup Unvisited Map');
        let nextToVisit = new PriorityQueue((a:{coord:Coord, distance:number}, b:{coord:Coord, distance:number}) => a.distance - b.distance);
        nextToVisit.push({coord:start, distance:0});
        let finished = false;
        let maxSearch = 10000;
        while(!finished) {
            let current = nextToVisit.pop();
            if(current == null) {
                finished = true;
                break;
            }
            if(!unvisited.contains(current.coord)) {
                continue;
            }
            unvisited.remove(current.coord);
            if(current.distance > maxMovementRange) {
                finished = true;
                break;
            }
            if(maxSearch > 0) {
                maxSearch--;
            } else {
                console.error('Path Search took too long! (Infinite loop?)');
                break;
            }
            let neighbors = getNeighbors(current.coord);
            for(let n of neighbors) {
                if(!unvisited.contains(n)) {
                    continue;
                }
                let cost = terrainCosts.get(n);
                if(cost == null || cost === Infinity) {
                    continue;
                }
                let initCost = distanceMap.get(current.coord);
                if(initCost == null) {
                    console.error('Current Location isn\'t set in distanceMap', current.coord);
                    break;
                }
                let finalCost = initCost + cost;
                let existingDistance = distanceMap.get(n) ?? Infinity;
                let finalDistance = Math.min(existingDistance, finalCost);
                distanceMap.put(n, finalDistance);
                if(unvisited.contains(n)) {
                    nextToVisit.push({coord:n, distance:finalDistance});
                }
            }
            if(unvisited.size === 0) {
                finished = true;
                continue;
            }
            let distanceOfCurrent = distanceMap.get(current.coord);
            if(distanceOfCurrent == null || distanceOfCurrent === Infinity) {
                finished = true;
                continue;
            }
        }

        for(let pair of distanceMap) {
            if(pair.value > maxMovementRange) {
                pair.value = Infinity;
            }
        }
        timeCalc('Time to fill out Distance Map');
        return distanceMap;
    }

    private getShortestPath(
        distanceMap:HashMap<Coord, number>,
        end:Coord
    ):Coord[] | undefined {
        let current = end;

        let totalDistance = distanceMap.get(end);
        if(totalDistance == null || totalDistance === Infinity) {
            return undefined;
        }

        let path:Coord[] = [current];
        while(distanceMap.get(current) !== 0) {
            let neighbors = getNeighbors(current);
            neighbors = neighbors.filter(n => {
                let distance = distanceMap.get(n);
                if(distance == null || distance === Infinity) {
                    return false;
                }
                return !path.find(p => p.x === n.x && p.y === n.y);
            });
            if(neighbors.length === 0) {
                return undefined;
            }
            let shortestNeighbor = neighbors[0];
            for(let candidateNeighbor of neighbors) {
                let lowestDistance = distanceMap.get(shortestNeighbor);
                if(lowestDistance == null) {
                    continue;
                }
                let candidateDistance = distanceMap.get(candidateNeighbor);
                if(candidateDistance == null) {
                    continue;
                }
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

    private pathCost(path:Coord[], movementClass:MovementClass, variant:string):number | undefined {
        let totalCost = 0;
        for(let move of path) {
            let terrain = this.terrains.get(move);
            if(!terrain) {
                return undefined;
            }
            let cost = this.costToMoveInto(terrain, movementClass, variant);
            if(cost == null) {
                return undefined;
            }
            totalCost += cost;
        }
        return totalCost;
    }

    private costToMoveInto(location:Coord, movementClass:MovementClass, variant:string):number | undefined {
        let terrain = this.terrains.get(location);
        if(!terrain) {
            console.debug('Unable to find terrain at', location);
            return undefined;
        }
        let unitAtLocation = this.units.get(terrain);
        if(unitAtLocation && this.selectedUnit) {
            if(this.isHostileOf(this.selectedUnit, unitAtLocation)) {
                return undefined;
            }
        }
        if(movementClass.movementCosts[terrain.name] != null) {
            let cost = movementClass.movementCosts[terrain.name];
            if(movementClass.variantMods) {
                let variantMods = movementClass.variantMods[variant]
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

    private reifyMovementChain(path:Coord[]):InterfaceState[] {
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

    public onClick(position:Coord) {
        this.cursorLocation = position;
        if(this.selectedLocation == null || this.selectedLocation.x != position.x || this.selectedLocation.y != position.y) {
            this.selectedLocation = position;
        } else {
            this.selectedLocation = undefined;
            this.selectedUnit = undefined;
        }
        if(this.selectedLocation) {
            this.selectedTerrain = this.terrains.get(this.selectedLocation);
            this.selectedUnit = this.units.get(this.selectedLocation);
        }
        if(!this.selectedUnit) {
            this.selectedLocation = undefined;
            this.movementChain = undefined;
            this.movementRange = undefined;
            this.targets = undefined;
            this.selectedUnitDistanceMap = undefined;
        } else {
            let selectedUnitData = this.unitTypes.get(this.selectedUnit.name);
            if(!selectedUnitData) {
                return;
            }
            let movementClass = this.movementTypes.get(selectedUnitData.movementClass);
            if(!movementClass) {
                return;
            }
            if(!this.terrains) {
                return;
            }
            let occupiedTerrain = this.terrains.get(this.selectedUnit);
            if(!occupiedTerrain) {
                console.error('Unable to get terrain under selected unit!');
                return;
            }
            if(!this.game) {
                console.error('Unable to get Game State for this game!');
                return;
            }
            if(!this.settings) {
                console.error('Unable to get Setting State for this game!');
                return;
            }

            this.selectedUnitDistanceMap = this.calculateDistanceMap(
                this.selectedUnit,
                selectedUnitData,
                getMovementRangeAdjustment(this.selectedUnit, occupiedTerrain, selectedUnitData, this.game, this.settings, this.players, this.commanderTypes, this.playerTypes, this.passiveUnitEffects), //TODO: get CO powers
                this.terrains,
                movementClass
            );
            if(this.selectedUnitDistanceMap) {
                let newMovementRange:InterfaceState[] = [];
                for(let distancePair of this.selectedUnitDistanceMap) {
                    if(distancePair.value < Infinity && distancePair.value <= this.selectedUnit.fuel) {
                        newMovementRange.push(new InterfaceState('movement-indicator', distancePair.key.x, distancePair.key.y, 0.5));
                    }
                }
                this.movementRange = newMovementRange;

                let newTargets:InterfaceState[] = [];
                let weaponDatas = selectedUnitData.weapons?.map(weapon => this.weaponTypes.get(weapon));
                for(let unitPair of this.units) {
                    if(!this.isHostileOf(this.selectedUnit, unitPair.value)) {
                        continue;
                    }
                    let canAttack = weaponDatas?.some(
                        weapon => {
                            if(weapon == null) {
                                console.error('Unable to find Weapon Data for ', selectedUnitData?.name);
                                return false;
                            }
                            if(weapon.baseDamage == null) {
                                return false;
                            }
                            if(weapon.baseDamage[unitPair.value.name] != null) {
                                if(weapon.ammoConsumed === 0 || (this.selectedUnit?.ammo ?? 0) > weapon.ammoConsumed) {
                                    return true;
                                }
                            }
                            return false;
                            //selectedUnitWeapons.push(weaponData);
                        }
                    ) ?? false;
                    if(!canAttack) {
                        continue;
                    }
                    if(selectedUnitData.stationaryFire === false) {
                        let neighbors = getNeighbors(unitPair.key);
                        for(let neighbor of neighbors) {
                            let distanceToNeighbor = this.selectedUnitDistanceMap.get(neighbor);
                            if(distanceToNeighbor != null && distanceToNeighbor < Infinity) {
                                newTargets.push(new InterfaceState('target', unitPair.key.x, unitPair.key.y, 0.65));
                                break;
                            }
                        }
                    }
                    if(selectedUnitData.stationaryFire === true) {
                        let distance = coordSubtract(this.selectedUnit, unitPair.key);
                        let euclidianDistance = Math.abs(distance.x) + Math.abs(distance.y);
                        //if(euclidianDistance >= selectedUnitData.)
                        console.error('Tried to get targets for Indirect Unit, but not implemented yet!');
                        break;
                    }
                    if(selectedUnitData.stationaryFire == null) {
                        console.warn('Normally this would be a valid state, BUT we are not testing with non-combat units!');
                        break;
                    }
                }
                this.targets = newTargets;
            }
        }
    }

    public isHostileOf(a:UnitState, b:UnitState):boolean {
        if(a.owner === b.owner) {
            return false;
        }
        if(a.owner != null && b.owner != null) {
            let playerA = this.players.get(a.owner);
            let playerB = this.players.get(b.owner);
            return playerA != null 
                && playerB != null 
                && (
                    playerA.team == null
                 || playerB.team == null
                 || playerA.team !== playerB.team
                )
                ;
        }
        return false;
    }

    public getVariantForOwner(unit:UnitState):string {
        let player = unit.owner != null ? this.players.get(unit.owner) : undefined;
        if(player && this.game && this.settings) {
            return calculateMovementCostVariant(
                player,
                this.game,
                this.settings,
                this.players,
                this.playerTypes,
                this.commanderTypes,
                this.passiveGlobalEffects
            );
        }
        if(this.game) {
            return this.game.variant;
        }
        throw new Error('Unable to determine variant for unit');
    }
}

@Component({
    selector:'unit-renderer',
    templateUrl:'./unit-renderer.component.html',
    styleUrls:['./parts.component.scss']
})
export class UnitRendererComponent implements OnChanges {
    @Input('unitState') unitState?:UnitState;
    @Input('imageResources') imageResources?:HashMap<ImageResourceKey, ImageResource>;
    @Input('textResources') textResources?:TextResource[];
    @Input('playerStates') playerStates?:HashMap<string, PlayerState>;
    @Input('gameStateRenderer') gameStateRenderer?:GameStateRendererComponent;
    @Input('ignorePosition') ignorePosition?:boolean;
    @Input('isSelected') isSelected?:boolean;
    ngOnChanges(): void {
        this.updateSrc();
    }

    updateSrc():void {
        let owner = this.playerStates?.get(this.unitState?.owner ?? '');
        let armyColor = owner?.armyColor;
        let imageResourceKey = {
            key:this.unitState?.name ?? '',
            type:'unit',
            armyColor:armyColor
        }
        let imageResource = this.imageResources?.get(imageResourceKey);
        if(imageResource)
            this.unitSrc = `data:image/png;base64,${imageResource.smallImage}`;
        else
            this.unitSrc = `data:image/png;base64,${unknownUnit}`;
        let positionString:string;
        if(this.ignorePosition) 
            positionString = `left:0px;top:0px;`;
        else
            positionString = `left:${16 * (this.unitState?.x ?? 0)}px;top:${16 * (this.unitState?.y ?? 0)}px;`;
        let adjustment = 20;
        if(this.isSelected) {
            adjustment += 100;
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
    @Input('imageResources') imageResources?:HashMap<ImageResourceKey, ImageResource>;
    @Input('textResources') textResources?:TextResource[];
    @Input('playerStates') playerStates?:HashMap<string, PlayerState>;
    @Input('gameStateRenderer') gameStateRenderer?:GameStateRendererComponent;
    @Input('ignorePosition') ignorePosition?:boolean;
    ngOnChanges(): void {
        this.updateSrc();
    }

    updateSrc():void {
        let armyColor = this.playerStates?.get(this.terrainState?.owner ?? '')?.armyColor;
        let imageResourceKey = {
            key:this.terrainState?.name ?? '',
            type:'terrain',
            armyColor:armyColor,
            orientation:this.terrainState?.orientation
        }
        let imageResource = this.imageResources?.get(imageResourceKey);
        if(!imageResource && imageResourceKey.orientation != null) {
            imageResourceKey.orientation = 0;
            imageResource = this.imageResources?.get(imageResourceKey);
        }
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
    @Input('imageResources') imageResources?:HashMap<ImageResourceKey, ImageResource>;
    @Input('terrainData') terrainData?:HashMap<string, TerrainType>;
    @Input('unitData') unitData?:HashMap<string, UnitType>;
    @Input('playerStates') playerStates?:HashMap<string, PlayerState>;
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
    @Input('imageResources') imageResources?:HashMap<ImageResourceKey, ImageResource>;
    @Input('textResources') textResources?:TextResource[];
    @Input('gameStateRenderer') gameStateRenderer?:GameStateRendererComponent;
    @Input('ignorePosition') ignorePosition?:boolean;
    @Input('layerOffset') layerOffset?:number;
    ngOnChanges(): void {
        this.updateSrc();
    }

    updateSrc():void {
        let imageResourceKey = {
            key:this.interfaceState?.name ?? '',
            type:'interface'
        };
        let imageResource = this.imageResources?.get(imageResourceKey);
        if(imageResource)
            this.interfaceSrc = `data:image/png;base64,${imageResource.smallImage}`;
        else
            this.interfaceSrc = `data:image/png;base64,${unknownTerrain}`;
        let positionString:string;
        if(this.ignorePosition) 
            positionString = `left:0px;top:0px;`;
        else
            positionString = `left:${16 * (this.interfaceState?.x ?? 0)}px;top:${16 * (this.interfaceState?.y ?? 0)}px;`
        this.interfaceStyle = `${positionString}z-index:${30 + (this.layerOffset ?? 0)};opacity:${this.interfaceState?.opacity ?? 1}`; 
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