import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {TerrainType} from './GameData/Terrain';
import {UnitType, WeaponType} from './GameData/Unit';
import {MovementClass} from './GameData/Movement';
import {PassiveUnitEffect, ActiveUnitEffect, PassiveTerrainEffect, ActiveTerrainEffect, PassiveGlobalEffect, ActiveGlobalEffect} from './GameData/Effect';
import {CommanderType, PlayerType} from './GameData/Commander';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Settings} from './GameData/Settings';
import { ImageResource, TextResource } from './GameData/Resource';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {

  constructor(private httpClient:HttpClient) { }

  public getTerrainTypes(modId:string):Observable<TerrainType[]> {
    return this.httpClient.post<TerrainType[]>("https://localhost:8167/data/getTerrains", {modId:modId});
  }

  public getUnitTypes(modId:string):Observable<UnitType[]> {
    return this.httpClient.post<UnitType[]>("https://localhost:8167/data/getUnits", {modId:modId});
  }

  public getWeaponTypes(modId:string):Observable<WeaponType[]> {
    return this.httpClient.post<WeaponType[]>("https://localhost:8167/data/getWeapons", {modId:modId});
  }

  public getMovementClasses(modId:string):Observable<MovementClass[]> {
    return this.httpClient.post<MovementClass[]>("https://localhost:8167/data/getMovements", {modId:modId});
  }

  public getPassiveUnitEffects(modId:string):Observable<PassiveUnitEffect[]> {
    return this.httpClient.post<PassiveUnitEffect[]>("https://localhost:8167/data/getPUEs", {modId:modId});
  }

  public getActiveUnitEffects(modId:string):Observable<ActiveUnitEffect[]> {
    return this.httpClient.post<ActiveUnitEffect[]>("https://localhost:8167/data/getAUEs", {modId:modId});
  }

  public getPassiveTerrainEffects(modId:string):Observable<PassiveTerrainEffect[]> {
    return this.httpClient.post<PassiveTerrainEffect[]>("https://localhost:8167/data/getPTEs", {modId:modId});
  }

  public getActiveTerrainEffects(modId:string):Observable<ActiveTerrainEffect[]> {
    return this.httpClient.post<ActiveTerrainEffect[]>("https://localhost:8167/data/getATEs", {modId:modId});
  }

  public getPassiveGlobalEffects(modId:string):Observable<PassiveGlobalEffect[]> {
    return this.httpClient.post<PassiveGlobalEffect[]>("https://localhost:8167/data/getPGEs", {modId:modId});
  }

  public getActiveGlobalEffects(modId:string):Observable<ActiveGlobalEffect[]> {
    return this.httpClient.post<ActiveGlobalEffect[]>("https://localhost:8167/data/getAGEs", {modId:modId});
  }

  public getCommanderTypes(modId:string):Observable<CommanderType[]> {
    return this.httpClient.post<CommanderType[]>("https://localhost:8167/data/getCommanders", {modId:modId});
  }

  public getPlayerTypes(modId:string):Observable<PlayerType[]> {
    return this.httpClient.post<PlayerType[]>("https://localhost:8167/data/getPlayers", {modId:modId});
  }

  public getSettings(modId:string):Observable<Settings[]> {
    return this.httpClient.post<Settings[]>("https://localhost:8167/data/getSettings", {modId:modId});
  }

  public getModData(req:{modId:string} | {modName:string, modVersion?:string}):Observable<{modName:string, modId:string, modVersion:string, expired:string | null}> {
    return this.httpClient.post<{modName:string, modId:string, modVersion:string, expired:string | null}>("https://localhost:8167/data/getModData", req);
  }

  public getTextResources(modId:string):Observable<TextResource[]> {
    return this.httpClient.post<TextResource[]>("https://localhost:8167/data/getTextResources", {modId:modId});
  }

  public getImageResources(modId:string):Observable<ImageResource[]> {
      return this.httpClient.post<ImageResource[]>("https://localhost:8167/data/getImageResources", {modId:modId});
  }

  public postNewMod(cookies:string, modData:string):Observable<string> {
    let headers = new HttpHeaders;
    headers = headers.append("cookies", cookies);
    return this.httpClient.post("https://localhost:8167/data/uploadMod", modData, {headers:headers, responseType: 'text'});
  }
}
