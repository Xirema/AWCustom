import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {TerrainType} from './GameData/Terrain';
import {UnitType, WeaponType} from './GameData/Unit';
import {MovementClass} from './GameData/Movement';
import {PassiveUnitEffect, ActiveUnitEffect, PassiveTerrainEffect, ActiveTerrainEffect, PassiveGlobalEffect, ActiveGlobalEffect} from './GameData/Effect';
import {CommanderType, PlayerType} from './GameData/Commander';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import baseData from './Gamedata/BaseData/mod.json';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {

  constructor(private httpClient:HttpClient) { }

  public getTerrainTypes(modname:string):Observable<TerrainType[]> {
    let terrains:TerrainType[] = baseData.terrains.map(t => ({
      occludesVision:false,
      ...t
    }));
    return new Observable<TerrainType[]>(observer => {
      observer.next(terrains);
      return {
        unsubscribe() {
          //Do Nothing
        }
      };
    });
  }

  public getUnitTypes(modname:string):Observable<UnitType[]> {
    let units:UnitType[] = baseData.units.map(u => ({
      hitPoints:100,
      ignoresVisionOcclusion:false,
      ...u
    }));
    return new Observable<UnitType[]>(observer => {
      observer.next(units);
      return {
        unsubscribe() {
          //Do Nothing
        }
      };
    });
  }

  public getWeaponTypes(modname:string):Observable<WeaponType[]> {
    let weapons:WeaponType[] = (baseData.weapons as WeaponType[]).map(w => ({
      minRange:1,
      selfTarget:false,
      affectedByLuck:true,
      nonLethal:false,
      areaOfEffect:0,
      ...w
    }));
    return new Observable<WeaponType[]>(observer => {
      observer.next(weapons);
      return {
        unsubscribe() {
          //Do Nothing
        }
      };
    });
  }

  public getMovementClasses(modname:string):Observable<MovementClass[]> {
    let movements:MovementClass[] = (baseData.movementClasses as unknown as MovementClass[]).map(m => ({
      ...m
    }));
    return new Observable<MovementClass[]>(observer => {
      observer.next(movements);
      return {
        unsubscribe() {
          //Do Nothing
        }
      };
    });
  }

  public getPassiveUnitEffects(modname:string):Observable<PassiveUnitEffect[]> {
    let passiveUnitEffects:PassiveUnitEffect[] = (baseData.passiveUnitEffects as PassiveUnitEffect[]).map(e => ({
      ...e
    }));
    return new Observable<PassiveUnitEffect[]>(observer => {
      observer.next(passiveUnitEffects);
      return {
        unsubscribe() {
          //Do Nothing
        }
      };
    });
  }

  public getActiveUnitEffects(modname:string):Observable<ActiveUnitEffect[]> {
    let activeUnitEffects:ActiveUnitEffect[] = baseData.activeUnitEffects.map(e => ({
      ...e
    }));
    return new Observable<ActiveUnitEffect[]>(observer => {
      observer.next(activeUnitEffects);
      return {
        unsubscribe() {
          //Do Nothing
        }
      };
    });
  }

  public getPassiveTerrainEffects(modname:string):Observable<PassiveTerrainEffect[]> {
    let passiveTerrainEffects:PassiveTerrainEffect[] = baseData.passiveTerrainEffects.map(e => ({
      ...e
    }));
    return new Observable<PassiveTerrainEffect[]>(observer => {
      observer.next(passiveTerrainEffects);
      return {
        unsubscribe() {
          //Do Nothing
        }
      };
    });
  }

  public getActiveTerrainEffects(modname:string):Observable<ActiveTerrainEffect[]> {
    let activeTerrainEffects:ActiveTerrainEffect[] = baseData.activeTerrainEffects.map(e => ({
      ...e
    }));
    return new Observable<ActiveTerrainEffect[]>(observer => {
      observer.next(activeTerrainEffects);
      return {
        unsubscribe() {
          //Do Nothing
        }
      };
    });
  }

  public getPassiveGlobalEffects(modname:string):Observable<PassiveGlobalEffect[]> {
    let passiveGlobalEffects:PassiveGlobalEffect[] = (baseData.passiveGlobalEffects as PassiveGlobalEffect[]).map(e => ({
      ...e
    }));
    return new Observable<PassiveGlobalEffect[]>(observer => {
      observer.next(passiveGlobalEffects);
      return {
        unsubscribe() {
          //Do Nothing
        }
      };
    });
  }

  public getActiveGlobalEffects(modname:string):Observable<ActiveGlobalEffect[]> {
    let activeGlobalEffects:ActiveGlobalEffect[] = baseData.activeGlobalEffects.map(e => ({
      ...e
    }));
    return new Observable<ActiveGlobalEffect[]>(observer => {
      observer.next(activeGlobalEffects);
      return {
        unsubscribe() {
          //Do Nothing
        }
      };
    });
  }

  public getCommanderTypes(modname:string):Observable<CommanderType[]> {
    let commanderTypes:CommanderType[] = baseData.commanders.map(e => ({
      ...e
    }));
    return new Observable<CommanderType[]>(observer => {
      observer.next(commanderTypes);
      return {
        unsubscribe() {
          //Do Nothing
        }
      };
    });
  }

  public getPlayerTypes(modname:string):Observable<PlayerType[]> {
    let playerTypes:PlayerType[] = baseData.playerTypes.map(e => ({
      ...e
    }));
    return new Observable<PlayerType[]>(observer => {
      observer.next(playerTypes);
      return {
        unsubscribe() {
          //Do Nothing
        }
      };
    });
  }

  public getHelloWorld():Observable<{name:string}> {
    return this.httpClient.get<{name:string}>("http://localhost:8167/hello");
  }

  public getPostTest(name:string):Observable<{name:string}> {
    return this.httpClient.post<{name:string}>("http://localhost:8167/posttest", {name:name});
  }

  public postNewMod(cookies:string, modData:string):Observable<string> {
    let headers = new HttpHeaders;
    headers = headers.append("cookies", cookies);
    return this.httpClient.post<string>("http://localhost:8167/modupload",{modData:modData}, {headers:headers});
  }
}
