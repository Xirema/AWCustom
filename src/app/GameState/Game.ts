import { GameState } from "./GameState";
import { PlayerState } from "./PlayerState";
import { SettingsState } from "./SettingsState";
import { TerrainState } from "./TerrainState";
import { UnitState } from "./UnitState";

export interface Game {
    gameState:GameState;
    units:UnitState[];
    terrains:TerrainState[];
    players:PlayerState[];
    settings:SettingsState;
}