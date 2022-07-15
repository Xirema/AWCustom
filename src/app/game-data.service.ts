import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {TerrainType} from './GameData/Terrain';
import {UnitType, WeaponType} from './GameData/Unit';
import {MovementClass} from './GameData/Movement';
import {PassiveUnitEffect, ActiveUnitEffect, PassiveTerrainEffect, ActiveTerrainEffect, PassiveGlobalEffect, ActiveGlobalEffect} from './GameData/Effect';
import {CommanderType, PlayerType} from './GameData/Commander';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Settings} from './GameData/Settings';
import baseData from './Gamedata/BaseData/mod.json';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {

  constructor(private httpClient:HttpClient) { }

  public getTerrainTypes(modName:string, version?:string):Observable<TerrainType[]> {
    let body:any = {};
    body.modName = modName;
    if(version)
      body.modVersion = version;
    return this.httpClient.post<TerrainType[]>("http://localhost:8167/data/getTerrains", body);
  }

  public getUnitTypes(modName:string, version?:string):Observable<UnitType[]> {
    let body:any = {};
    body.modName = modName;
    if(version)
      body.modVersion = version;
    return this.httpClient.post<UnitType[]>("http://localhost:8167/data/getUnits", body);
  }

  public getWeaponTypes(modName:string, version?:string):Observable<WeaponType[]> {
    let body:any = {};
    body.modName = modName;
    if(version)
      body.modVersion = version;
    return this.httpClient.post<WeaponType[]>("http://localhost:8167/data/getWeapons", body);
  }

  public getMovementClasses(modName:string, version?:string):Observable<MovementClass[]> {
    let body:any = {};
    body.modName = modName;
    if(version)
      body.modVersion = version;
    return this.httpClient.post<MovementClass[]>("http://localhost:8167/data/getMovements", body);
  }

  public getPassiveUnitEffects(modName:string, version?:string):Observable<PassiveUnitEffect[]> {
    let body:any = {};
    body.modName = modName;
    if(version)
      body.modVersion = version;
    return this.httpClient.post<PassiveUnitEffect[]>("http://localhost:8167/data/getPUEs", body);
  }

  public getActiveUnitEffects(modName:string, version?:string):Observable<ActiveUnitEffect[]> {
    let body:any = {};
    body.modName = modName;
    if(version)
      body.modVersion = version;
    return this.httpClient.post<ActiveUnitEffect[]>("http://localhost:8167/data/getAUEs", body);
  }

  public getPassiveTerrainEffects(modName:string, version?:string):Observable<PassiveTerrainEffect[]> {
    let body:any = {};
    body.modName = modName;
    if(version)
      body.modVersion = version;
    return this.httpClient.post<PassiveTerrainEffect[]>("http://localhost:8167/data/getPTEs", body);
  }

  public getActiveTerrainEffects(modName:string, version?:string):Observable<ActiveTerrainEffect[]> {
    let body:any = {};
    body.modName = modName;
    if(version)
      body.modVersion = version;
    return this.httpClient.post<ActiveTerrainEffect[]>("http://localhost:8167/data/getATEs", body);
  }

  public getPassiveGlobalEffects(modName:string, version?:string):Observable<PassiveGlobalEffect[]> {
    let body:any = {};
    body.modName = modName;
    if(version)
      body.modVersion = version;
    return this.httpClient.post<PassiveGlobalEffect[]>("http://localhost:8167/data/getPGEs", body);
  }

  public getActiveGlobalEffects(modName:string, version?:string):Observable<ActiveGlobalEffect[]> {
    let body:any = {};
    body.modName = modName;
    if(version)
      body.modVersion = version;
    return this.httpClient.post<ActiveGlobalEffect[]>("http://localhost:8167/data/getAGEs", body);
  }

  public getCommanderTypes(modName:string, version?:string):Observable<CommanderType[]> {
    let body:any = {};
    body.modName = modName;
    if(version)
      body.modVersion = version;
    return this.httpClient.post<CommanderType[]>("http://localhost:8167/data/getCommanders", body);
  }

  public getPlayerTypes(modName:string, version?:string):Observable<PlayerType[]> {
    let body:any = {};
    body.modName = modName;
    if(version)
      body.modVersion = version;
    return this.httpClient.post<PlayerType[]>("http://localhost:8167/data/getPlayers", body);
  }

  public getSettings(modName:string, version?:string):Observable<Settings[]> {
    let body:any = {};
    body.modName = modName;
    if(version)
      body.modVersion = version;
    return this.httpClient.post<Settings[]>("http://localhost:8167/data/getSettings", body);
  }

  public getModData(modName:string, version?:string):Observable<{modName:string, modId:number, modVersion:string, expired:string | null}> {
    let body:any = {};
    body.modName = modName;
    if(version)
      body.modVersion = version;
    return this.httpClient.post<{modName:string, modId:number, modVersion:string, expired:string | null}>("http://localhost:8167/data/getModData", body);
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
    return this.httpClient.post("http://localhost:8167/data/uploadMod", modData, {headers:headers, responseType: 'text'});
  }
}
