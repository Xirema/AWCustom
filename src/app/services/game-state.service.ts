import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { GameState } from "../GameState/GameState";
import { UnitState } from "../GameState/UnitState";
import { TerrainState } from "../GameState/TerrainState";
import { PlayerState } from "../GameState/PlayerState";
import { SettingsState } from "../GameState/SettingsState";

@Injectable({
    providedIn: 'root'
})
export class GameStateService {
  constructor(private httpClient:HttpClient) {}

  public getGameState(gameId:string):Observable<GameState> {
    return this.httpClient.get<GameState>("state/getGameState", {headers:{gameId:gameId}});
  }

  public getUnitStates(gameId:string):Observable<UnitState[]> {
    return this.httpClient.get<UnitState[]>("state/getUnitStates", {headers:{gameId:gameId}});
  }

  public getTerrainStates(gameId:string):Observable<TerrainState[]> {
    return this.httpClient.get<TerrainState[]>("state/getTerrainStates", {headers:{gameId:gameId}});
  }

  public getPlayerStates(gameId:string):Observable<PlayerState[]> {
    return this.httpClient.get<PlayerState[]>("state/getPlayerStates", {headers:{gameId:gameId}});
  }

  public getSettingState(gameId:string):Observable<SettingsState> {
    return this.httpClient.get<SettingsState>("state/getSettingState", {headers:{gameId:gameId}});
  }
}
