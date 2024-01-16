import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { GameState } from "./GameState/GameState";
import { UnitState } from "./GameState/UnitState";
import { TerrainState } from "./GameState/TerrainState";
import { PlayerState } from "./GameState/PlayerState";
import { SettingsState } from "./GameState/SettingsState";

@Injectable({
    providedIn: 'root'
})
export class GameStateService {
  constructor(private httpClient:HttpClient) {}

  public getGameState(gameId:string):Observable<GameState> {
    return this.httpClient.post<GameState>("state/getGameState", {gameId:gameId});
  }

  public getUnitStates(gameId:string):Observable<UnitState[]> {
    return this.httpClient.post<UnitState[]>("state/getUnitStates", {gameId:gameId});
  }

  public getTerrainStates(gameId:string):Observable<TerrainState[]> {
    return this.httpClient.post<TerrainState[]>("state/getTerrainStates", {gameId:gameId});
  }

  public getPlayerStates(gameId:string):Observable<PlayerState[]> {
    return this.httpClient.post<PlayerState[]>("state/getPlayerStates", {gameId:gameId});
  }

  public getSettingState(gameId:string):Observable<SettingsState> {
    return this.httpClient.post<SettingsState>("state/getSettingState", {gameId:gameId});
  }
}
