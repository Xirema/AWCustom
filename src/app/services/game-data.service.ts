import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TerrainType} from '../GameData/Terrain';
import {UnitType, WeaponType} from '../GameData/Unit';
import {MovementClass} from '../GameData/Movement';
import {PassiveUnitEffect, ActiveUnitEffect, PassiveTerrainEffect, ActiveTerrainEffect, PassiveGlobalEffect, ActiveGlobalEffect} from '../GameData/Effect';
import {CommanderType, PlayerType} from '../GameData/Commander';
import {Settings} from '../GameData/Settings';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {

  constructor(private httpClient:HttpClient) { }

  public getTerrainTypes(modId:string):Observable<TerrainType[]> {
    return this.httpClient.get<TerrainType[]>("data/getTerrains", {headers:{modId:modId}});
  }

  public getUnitTypes(modId:string):Observable<UnitType[]> {
    return this.httpClient.get<UnitType[]>("data/getUnits", {headers:{modId:modId}});
  }

  public getWeaponTypes(modId:string):Observable<WeaponType[]> {
    return this.httpClient.get<WeaponType[]>("data/getWeapons", {headers:{modId:modId}});
  }

  public getMovementClasses(modId:string):Observable<MovementClass[]> {
    return this.httpClient.get<MovementClass[]>("data/getMovements", {headers:{modId:modId}});
  }

  public getPassiveUnitEffects(modId:string):Observable<PassiveUnitEffect[]> {
    return this.httpClient.get<PassiveUnitEffect[]>("data/getPUEs", {headers:{modId:modId}});
  }

  public getActiveUnitEffects(modId:string):Observable<ActiveUnitEffect[]> {
    return this.httpClient.get<ActiveUnitEffect[]>("data/getAUEs", {headers:{modId:modId}});
  }

  public getPassiveTerrainEffects(modId:string):Observable<PassiveTerrainEffect[]> {
    return this.httpClient.get<PassiveTerrainEffect[]>("data/getPTEs", {headers:{modId:modId}});
  }

  public getActiveTerrainEffects(modId:string):Observable<ActiveTerrainEffect[]> {
    return this.httpClient.get<ActiveTerrainEffect[]>("data/getATEs", {headers:{modId:modId}});
  }

  public getPassiveGlobalEffects(modId:string):Observable<PassiveGlobalEffect[]> {
    return this.httpClient.get<PassiveGlobalEffect[]>("data/getPGEs", {headers:{modId:modId}});
  }

  public getActiveGlobalEffects(modId:string):Observable<ActiveGlobalEffect[]> {
    return this.httpClient.get<ActiveGlobalEffect[]>("data/getAGEs", {headers:{modId:modId}});
  }

  public getCommanderTypes(modId:string):Observable<CommanderType[]> {
    return this.httpClient.get<CommanderType[]>("data/getCommanders", {headers:{modId:modId}});
  }

  public getPlayerTypes(modId:string):Observable<PlayerType[]> {
    return this.httpClient.get<PlayerType[]>("data/getPlayers", {headers:{modId:modId}});
  }

  public getSettings(modId:string):Observable<Settings[]> {
    return this.httpClient.get<Settings[]>("data/getSettings", {headers:{modId:modId}});
  }

  public getModData(req:{modId:string} | {modName:string, modVersion?:string}):Observable<{modName:string, modId:string, modVersion:string, expired:string | null}> {
    let headers = new HttpHeaders;
    if("modId" in req) {
      headers = headers.append("modId", req.modId);
    } else {
      headers = headers.append("modName", req.modName);
      if(req.modVersion) {
        headers = headers.append("modVersion", req.modVersion);
      }
    }
    let ret = this.httpClient.get<{modName:string, modId:string, modVersion:string, expired:string | null}>("data/getModData", {headers:headers, responseType:"json"});
    return ret;
  }

  // public getTextResources(modId:string):Observable<TextResource[]> {
  //   return this.httpClient.get<TextResource[]>("data/getTextResources", {headers:{modId:modId}});
  // }

  // public getImageResources(modId:string):Observable<ImageResource[]> {
  //     return this.httpClient.get<ImageResource[]>("data/getImageResources", {headers:{modId:modId}});
  // }

  public postNewMod(cookies:string, modData:string):Observable<string> {
    let headers = new HttpHeaders;
    headers = headers.append("cookies", cookies);
    return this.httpClient.post("data/uploadMod", modData, {headers:headers, responseType: 'text'});
  }
}
