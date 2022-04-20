import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {TerrainType} from './GameData/Terrain';
import terrainTypes from './GameData/BaseData/Terrain.json';
import {UnitType, WeaponType} from './GameData/Unit';
import unitTypes from './GameData/BaseData/Unit.json';
import {MovementClass} from './GameData/Movement';
import movementTypes from './GameData/BaseData/Movement.json';
import {PassiveUnitEffect, ActiveUnitEffect, PassiveTerrainEffect, ActiveTerrainEffect, PassiveGlobalEffect, ActiveGlobalEffect} from './GameData/Effect';
import effects from './GameData/BaseData/Effect.json';
import {CommanderType, PlayerType} from './GameData/Commander';
import commanders from './GameData/BaseData/Commander.json'

@Injectable({
  providedIn: 'root'
})
export class GameDataService {

  constructor() { }

  public getTerrainTypes(modname:string):Observable<TerrainType[]> {
    let terrains:TerrainType[] = terrainTypes.terrains.map(t => ({
      maxCapturePoints:null,
      sameAs:null,
      buildList:null,
      income:null,
      repair:null,
      repairList:null,
      occludesVision:false,
      hitPoints:null,
      destroyed:null,
      damagedLike:null,
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
    let units:UnitType[] = unitTypes.units.map(u => ({
      fuelPerDay:null,
      fuelPerDayStealth:null,
      hitPoints:100,
      supplyRepair:null,
      transportCapacity:null,
      transportList:null,
      captureSpeed:null,
      weapons:null,
      ignoresVisionOcclusion:false,
      stealthType:null,
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
    let weapons:WeaponType[] = unitTypes.weapons.map(w => ({
      minRange:1,
      selfTarget:false,
      affectedByLuck:true,
      nonLethal:false,
      areaOfEffect:0,
      targetsStealth:null,
      flatDamage:null,
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
    let movements:MovementClass[] = movementTypes.movementClasses.map(m => ({
      variant:"normal",
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
    let passiveUnitEffects:PassiveUnitEffect[] = effects.passiveUnitEffects.map(e => ({
      targets:null,
      unitTypeRequired:null,
      classificationRequired:null,
      terrainRequired:null,
      firepowerMod:null,
      defenseMod:null,
      indirectDefenseMod:null,
      minRangeMod:null,
      maxRangeMod:null,
      fuelUseMod:null,
      ammoUseMod:null,
      goodLuckMod:null,
      badLuckMod:null,
      movementMod:null,
      visionMod:null,
      terrainStarsMod:null,
      terrainStarsFlatMod:null,
      terrainStarsDefense:null,
      terrainStarsFirepower:null,
      flatMovement:null,
      counterfireMod:null,
      counterFirst:null,
      captureRateMod:null,
      unitCostMod:null,
      hiddenHitPoints:null,
      firepowerFromFunds:null,
      defenseFromFunds:null,
      firepowerFromOwnedTerrain:null,
      defenseFromOwnedTerrain:null,
      fundsFromDamage:null,
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
    let activeUnitEffects:ActiveUnitEffect[] = effects.activeUnitEffects.map(e => ({
      targets:null,
      unitTypeRequired:null,
      classificationRequired:null,
      terrainRequired:null,
      hitPointMod:null,
      roundHitPoints:null,
      resupply:null,
      halveFuel:null,
      makeActive:null,
      stunDuration:null,
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
    let passiveTerrainEffects:PassiveTerrainEffect[] = effects.passiveTerrainEffects.map(e => ({
      targets:null,
      incomeMod:null,
      incomeFlatMod:null,
      buildListMod:null,
      repairMod:null,
      occludesVisionMod:null,
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
    let activeTerrainEffects:ActiveTerrainEffect[] = effects.activeTerrainEffects.map(e => ({
      targets:null,
      affects:null,
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
    let passiveGlobalEffects:PassiveGlobalEffect[] = effects.passiveGlobalEffects.map(e => ({
      targets:null,
      variantMod:null,
      variantHintMod:null,
      movementClassVariantReplace:null,
      movementClassVariantOverride:null,
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
    let activeGlobalEffects:ActiveGlobalEffect[] = effects.activeGlobalEffects.map(e => ({
      targets:null,
      fundMod:null,
      fundFlatMod:null,
      powerBarMod:null,
      powerBarPerFunds:null,
      missileLaunch:null,
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
    let commanderTypes:CommanderType[] = commanders.commanders.map(e => ({
      passiveUnitEffectsD2d:null,
      passiveTerrainEffectsD2d:null,
      passiveGlobalEffectsD2d:null,
      copCost:null,
      passiveUnitEffectsCop:null,
      activeUnitEffectsCop:null,
      passiveTerrainEffectsCop:null,
      activeTerrainEffectsCop:null,
      passiveGlobalEffectsCop:null,
      activeGlobalEffectsCop:null,
      scopCost:null,
      passiveUnitEffectsScop:null,
      activeUnitEffectsScop:null,
      passiveTerrainEffectsScop:null,
      activeTerrainEffectsScop:null,
      passiveGlobalEffectsScop:null,
      activeGlobalEffectsScop:null,
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
    let playerTypes:PlayerType[] = commanders.playerTypes.map(e => ({
      permittedPlayerSlots:null,
      permittedCommanderTypes:null,
      teamName:null,
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
}
