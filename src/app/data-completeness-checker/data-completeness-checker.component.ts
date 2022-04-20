import { Component, OnInit } from '@angular/core';
import {GameDataService} from '../game-data.service';
import {CommanderType, PlayerType} from '../GameData/Commander';
import * as EffectData from '../GameData/Effect';
import {UnitType, WeaponType} from '../GameData/Unit';
import {TerrainType} from '../GameData/Terrain';
import {MovementClass} from '../GameData/Movement';

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
    }});
    this.gameDataService.getTerrainTypes("baseGame").subscribe({next: list => this.terrainTypes = list});
    this.gameDataService.getWeaponTypes("baseGame").subscribe({next: list => this.weaponTypes = list});
    this.gameDataService.getCommanderTypes("baseGame").subscribe({next: list => this.commanderTypes = list});
    this.gameDataService.getMovementClasses("baseGame").subscribe({next: list => this.movementClasses = list});

    this.gameDataService.getPassiveUnitEffects("baseGame").subscribe({next: list => this.passiveUnitEffects = list});
    this.gameDataService.getPassiveTerrainEffects("baseGame").subscribe({next: list => this.passiveTerrainEffects = list});
    this.gameDataService.getPassiveGlobalEffects("baseGame").subscribe({next: list => this.passiveGlobalEffects = list});
    this.gameDataService.getActiveUnitEffects("baseGame").subscribe({next: list => this.activeUnitEffects = list});
    this.gameDataService.getActiveTerrainEffects("baseGame").subscribe({next: list => this.activeTerrainEffects = list});
    this.gameDataService.getActiveGlobalEffects("baseGame").subscribe({next: list => this.activeGlobalEffects = list});
    this.gameDataService.getPlayerTypes("baseGame").subscribe({next: list => this.playerTypes = list});
  }

  public check(name:string, arr:any[]):boolean {
    return arr.find(obj => obj.name === name);
  }

  public findWeapon(name:string):string {
    return this.unitTypes.find(u => u.weapons && u.weapons.find(w => w === name))?.name;
  }

  public findStealth(name:string):boolean {
    return this.unitTypes.find(u => u.stealthType == name) != null;
  }

  public findMovement(name:string):string {
    return this.unitTypes.find(u => u.movementClass == name)?.name;
  }

  public checkEffect(name:string, prefix:string):string {
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

  public checkClassification(classification:string):string {
    if(this.foundClassifications.get(classification) > 1) return "many";
    if(this.foundClassifications.get(classification) > 0) return "one";
    if(classification.charAt(0) === "!") {
      return this.checkClassification(classification.substring(1));
    }
    return null;
  }

  public entries(obj:any):[string, any][] {
    return Object.entries(obj); 
  }

  public stringify(obj:any, replacer?:any, spacer?:any):string {
    return JSON.stringify(obj, replacer, spacer);
  }


  unitTypes:UnitType[] = [];
  weaponTypes:WeaponType[] = [];
  commanderTypes:CommanderType[] = [];
  terrainTypes:TerrainType[] = [];
  movementClasses:MovementClass[] = [];
  playerTypes:PlayerType[] = [];

  passiveUnitEffects:EffectData.PassiveUnitEffect[] = [];
  passiveTerrainEffects:EffectData.PassiveTerrainEffect[] = [];
  passiveGlobalEffects:EffectData.PassiveGlobalEffect[] = [];
  activeUnitEffects:EffectData.ActiveUnitEffect[] = [];
  activeTerrainEffects:EffectData.ActiveTerrainEffect[] = [];
  activeGlobalEffects:EffectData.ActiveGlobalEffect[] = [];

  foundClassifications:Map<string, number> = new Map<string, number>();
}
