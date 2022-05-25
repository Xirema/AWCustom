import { Component, OnInit } from '@angular/core';
import {GameDataService} from '../game-data.service';
import {CommanderType, PlayerType} from '../GameData/Commander';
import * as EffectData from '../GameData/Effect';
import {UnitType, WeaponType} from '../GameData/Unit';
import {TerrainType} from '../GameData/Terrain';
import {MovementClass} from '../GameData/Movement';

enum CheckResult {
    Found, Missing, Noncheckable
}

@Component({
  selector: 'app-data-completeness-checker',
  templateUrl: './data-completeness-checker.component.html',
  styleUrls: ['./data-completeness-checker.component.css']
})
export class DataCompletenessCheckerComponent implements OnInit {

  constructor(
    private gameDataService:GameDataService
  ) {}

  ngOnInit(): void {
    this.gameDataService.getUnitTypes("baseGame").subscribe({next: list => {
      this.unitTypes = list;
      this.unitTypes.forEach(unitType => unitType.classifications?.forEach(classification => {
        let count = this.foundClassifications.get(classification) ?? 0;
        this.foundClassifications.set(classification, count + 1);
      }));
      this.unitTypesProperties = this.getAllPropertyNames(list);
    }});
    this.gameDataService.getTerrainTypes("baseGame").subscribe({next: list => {
      this.terrainTypes = list;
      this.terrainTypesProperties = this.getAllPropertyNames(list);
    }});
    this.gameDataService.getWeaponTypes("baseGame").subscribe({next: list => {
      this.weaponTypes = list;
      this.weaponTypesProperties = this.getAllPropertyNames(list);
    }});
    this.gameDataService.getCommanderTypes("baseGame").subscribe({next: list => {
      this.commanderTypes = list;
      this.commanderTypesProperties = this.getAllPropertyNames(list);
    }});
    this.gameDataService.getMovementClasses("baseGame").subscribe({next: list => {
      this.movementClasses = list;
      this.movementClassesProperties = this.getAllPropertyNames(list);
    }});

    this.gameDataService.getPassiveUnitEffects("baseGame").subscribe({next: list => {
      this.passiveUnitEffects = list;
      this.passiveUnitEffectsProperties = this.getAllPropertyNames(list);
    }});
    this.gameDataService.getPassiveTerrainEffects("baseGame").subscribe({next: list => {
      this.passiveTerrainEffects = list;
      this.passiveTerrainEffectsProperties = this.getAllPropertyNames(list);
    }});
    this.gameDataService.getPassiveGlobalEffects("baseGame").subscribe({next: list => {
      this.passiveGlobalEffects = list;
      this.passiveGlobalEffectsProperties = this.getAllPropertyNames(list);
    }});
    this.gameDataService.getActiveUnitEffects("baseGame").subscribe({next: list => {
      this.activeUnitEffects = list; 
      this.activeUnitEffectsProperties = this.getAllPropertyNames(list);
    }});
    this.gameDataService.getActiveTerrainEffects("baseGame").subscribe({next: list => {
      this.activeTerrainEffects = list;
      this.activeTerrainEffectsProperties = this.getAllPropertyNames(list);
    }});
    this.gameDataService.getActiveGlobalEffects("baseGame").subscribe({next: list => {
      this.activeGlobalEffects = list;
      this.activeGlobalEffectsProperties = this.getAllPropertyNames(list);
    }});
    this.gameDataService.getPlayerTypes("baseGame").subscribe({next: list => {
      this.playerTypes = list;
      this.playerTypesProperties = this.getAllPropertyNames(list);
    }});
  }

  public check(name:string, arr:any[]):boolean {
    return arr.find(obj => obj.name === name);
  }

  public findWeapon(name:string):string | undefined {
    return this.unitTypes.find(u => u.weapons && u.weapons.find(w => w === name))?.name;
  }

  public findStealth(name:string):boolean {
    return this.unitTypes.find(u => u.stealthType == name) != null;
  }

  public findMovement(name:string):string | undefined {
    return this.unitTypes.find(u => u.movementClass == name)?.name;
  }

  public checkEffect(name:string, prefix:string):string | undefined {
    return this.commanderTypes.find(commander => {
      for(let list of [prefix + "EffectsD2d", prefix + "EffectsCop", prefix + "EffectsScop"]) {
        let arr:string[] = commander[list];
        if(arr?.find(e => e === name) != null)
        return true;
      }
      return false;
    })?.name;
  }

  public checkEffectTarget(target:string):boolean {
    return ["own", "self", "ally", "enemy", "neutral"].includes(target);
  }

  public checkMissileTargetMethod(method:string):boolean {
    return ["infantry", "hp", "count", "value"].includes(method);
  }

  public checkClassification(classification:string):string | null {
    if((this.foundClassifications.get(classification) ?? -1) > 1) return "many";
    if((this.foundClassifications.get(classification) ?? -1) > 0) return "one";
    if(classification.charAt(0) === "!") {
      return this.checkClassification(classification.substring(1));
    }
    return null;
  }

  public entries(obj:any):[string, any][] {
    return Object.entries(obj); 
  }

  public getAllPropertyNames(objs:any[]):string[] {
    let propertyNames = new Set<string>();
    for(let obj of objs) {
      let entries = this.entries(obj);
      for(let pair of entries) {
        propertyNames.add(pair[0]);
      }
    }
    return [...propertyNames];
  }

  public stringify(obj:any, replacer?:any, spacer?:any):string {
    return JSON.stringify(obj, replacer, spacer);
  }

  public findInList(name:string, list:{name:string}[], listToIgnore?:{name:string}[]):CheckResult {
    if(listToIgnore === list)
      return CheckResult.Noncheckable;
    if(list.find(obj => obj.name == name) != null)
      return CheckResult.Found;
    else
      return CheckResult.Missing;
  }

  public checkGeneric(name:string, listToIgnore?:{name:string}[]):CheckResult {
    let lists = [
      this.unitTypes, 
      this.weaponTypes, 
      this.commanderTypes, 
      this.terrainTypes, 
      this.movementClasses, 
      this.playerTypes, 
      this.passiveUnitEffects, 
      this.activeUnitEffects, 
      this.passiveTerrainEffects, 
      this.activeTerrainEffects, 
      this.passiveGlobalEffects, 
      this.activeGlobalEffects
    ];
    for(let list of lists) {
      let ret = this.findInList(name, list, listToIgnore);
      if(ret !== CheckResult.Missing) 
        return ret;
    }
    return CheckResult.Missing;
  }


  unitTypes:UnitType[] = [];
  unitTypesProperties:string[] = [];
  weaponTypes:WeaponType[] = [];
  weaponTypesProperties:string[] = [];
  commanderTypes:CommanderType[] = [];
  commanderTypesProperties:string[] = [];
  terrainTypes:TerrainType[] = [];
  terrainTypesProperties:string[] = [];
  movementClasses:MovementClass[] = [];
  movementClassesProperties:string[] = [];
  playerTypes:PlayerType[] = [];
  playerTypesProperties:string[] = [];

  passiveUnitEffects:EffectData.PassiveUnitEffect[] = [];
  passiveUnitEffectsProperties:string[] = [];
  passiveTerrainEffects:EffectData.PassiveTerrainEffect[] = [];
  passiveTerrainEffectsProperties:string[] = [];
  passiveGlobalEffects:EffectData.PassiveGlobalEffect[] = [];
  passiveGlobalEffectsProperties:string[] = [];
  activeUnitEffects:EffectData.ActiveUnitEffect[] = [];
  activeUnitEffectsProperties:string[] = [];
  activeTerrainEffects:EffectData.ActiveTerrainEffect[] = [];
  activeTerrainEffectsProperties:string[] = [];
  activeGlobalEffects:EffectData.ActiveGlobalEffect[] = [];
  activeGlobalEffectsProperties:string[] = [];

  foundClassifications:Map<string, number> = new Map<string, number>();
}
