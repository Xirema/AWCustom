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
  styleUrls: ['./data-completeness-checker.component.scss']
})
export class DataCompletenessCheckerComponent implements OnInit {

  constructor(
    private gameDataService:GameDataService
  ) {}

  ngOnInit(): void {
    //this.allDatas.push(["own", "self", "ally", "neutral", "enemy"].map(v => {return {name:v}}));
    //this.allDatas.push(["normal", "rain", "snow", "flat"].map(v => {return {name:v}}));
    this.gameDataService.getUnitTypes("baseGame").subscribe({next: list => {
      this.unitTypes = list;
      // this.allDatas.push(list);
      this.unitTypes.forEach(unitType => unitType.classifications?.forEach(classification => {
        let count = this.foundClassifications.get(classification) ?? 0;
        this.foundClassifications.set(classification, count + 1);
        this.classificationTypes = [...this.foundClassifications].map(v => v[0]).map(s => {return {name:s}});
      }));

    }});
    this.gameDataService.getTerrainTypes("baseGame").subscribe({next: list => {
      this.terrainTypes = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getWeaponTypes("baseGame").subscribe({next: list => {
      this.weaponTypes = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getCommanderTypes("baseGame").subscribe({next: list => {
      this.commanderTypes = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getMovementClasses("baseGame").subscribe({next: list => {
      this.movementClasses = list;
      // this.allDatas.push(list);
    }});

    this.gameDataService.getPassiveUnitEffects("baseGame").subscribe({next: list => {
      this.passiveUnitEffects = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getPassiveTerrainEffects("baseGame").subscribe({next: list => {
      this.passiveTerrainEffects = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getPassiveGlobalEffects("baseGame").subscribe({next: list => {
      this.passiveGlobalEffects = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getActiveUnitEffects("baseGame").subscribe({next: list => {
      this.activeUnitEffects = list; 
      // this.allDatas.push(list);
    }});
    this.gameDataService.getActiveTerrainEffects("baseGame").subscribe({next: list => {
      this.activeTerrainEffects = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getActiveGlobalEffects("baseGame").subscribe({next: list => {
      this.activeGlobalEffects = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getPlayerTypes("baseGame").subscribe({next: list => {
      this.playerTypes = list;
      // this.allDatas.push(list);
    }});
  }


  unitTypes:UnitType[] = [];
  weaponTypes:WeaponType[] = [];
  commanderTypes:CommanderType[] = [];
  terrainTypes:TerrainType[] = [];
  movementClasses:MovementClass[] = [];
  playerTypes:PlayerType[] = [];
  classificationTypes:{name:string}[] = [];

  passiveUnitEffects:EffectData.PassiveUnitEffect[] = [];
  passiveTerrainEffects:EffectData.PassiveTerrainEffect[] = [];
  passiveGlobalEffects:EffectData.PassiveGlobalEffect[] = [];
  activeUnitEffects:EffectData.ActiveUnitEffect[] = [];
  activeTerrainEffects:EffectData.ActiveTerrainEffect[] = [];
  activeGlobalEffects:EffectData.ActiveGlobalEffect[] = [];

  variantTypes = [{name:'normal'}, {name:'rain'}, {name:'snow'}, {name:'flat'}];
  targetTypes = [{name:'own'}, {name:'self'}, {name:'ally'}, {name:'neutral'}, {name:'enemy'}];

  //allDatas:{name:string}[][] = [];

  foundClassifications:Map<string, number> = new Map<string, number>();
}
