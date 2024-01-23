import {CommanderType, PlayerType} from './Commander';
import {UnitType, WeaponType} from './Unit';
import { MovementClass } from './Movement';
import { PassiveUnitEffect, ActiveUnitEffect, PassiveTerrainEffect, ActiveTerrainEffect, PassiveGlobalEffect, ActiveGlobalEffect } from './Effect';
import { Settings } from './Settings';
import { TerrainType } from './Terrain';
import { TextResource, ImageResource } from './Resource';
import { DefaultResourcePack } from './DefaultResourcePack';

export interface ModMetadata {
    name:string;
    version:string;
    defaultResourcePacks?:DefaultResourcePack[];
}

export interface ModData {
    protocol?:string;
    modMetadata:ModMetadata;
    units:UnitType[];
    weapons:WeaponType[];
    terrains:TerrainType[];
    movements:MovementClass[];
    commanders:CommanderType[];
    players:PlayerType[];
    passiveUnitEffects:PassiveUnitEffect[];
    activeUnitEffects:ActiveUnitEffect[];
    passiveTerrainEffects:PassiveTerrainEffect[];
    activeTerrainEffects:ActiveTerrainEffect[];
    passiveGlobalEffects:PassiveGlobalEffect[];
    activeGlobalEffects:ActiveGlobalEffect[];
    defaultSettings:Settings[];
}