import { Component, OnInit } from '@angular/core';
import {GameDataService} from '../game-data.service';
import {CommanderType, PlayerType} from '../GameData/Commander';
import * as EffectData from '../GameData/Effect';
import {UnitType, WeaponType} from '../GameData/Unit';
import {TerrainType} from '../GameData/Terrain';
import {MovementClass} from '../GameData/Movement';
import {Settings} from '../GameData/Settings';

@Component({
  selector: 'app-data-completeness-checker',
  templateUrl: './data-completeness-checker.component.html',
  styleUrls: ['./data-completeness-checker.component.scss']
})
export class DataCompletenessCheckerComponent implements OnInit {

  constructor(
    private gameDataService:GameDataService
  ) {}

  async getModData():Promise<{modName:string, modId:number, modVersion:string, expired:string | null} | undefined> {
    return new Promise<{modName:string, modId:number, modVersion:string, expired:string | null} | undefined>((resolve, reject) => {
      if(!this.modName) {
        resolve(undefined);
        return;
      }
      this.gameDataService.getModData(this.modName, this.modVersion).subscribe({next: ret => {
        resolve(ret);
      }, error: err => {
        resolve(undefined);
      }})
    });
  }

  public async submit():Promise<void> {
    let modNameElement = document.getElementById("modName") as HTMLInputElement;
    let modVersionElement = document.getElementById("modVersion") as HTMLInputElement;
    if(modNameElement.value && modNameElement.value !== '')
      this.modName = modNameElement.value;
    else
      this.modName = null;
    if(modVersionElement.value && modVersionElement.value !== '')
      this.modVersion = modVersionElement.value ?? undefined;
    else
      this.modVersion = undefined;

    let modData = await this.getModData();
    if(!modData) {
      this.modVersion = 'null';
      return;
    }
    this.modName = modData.modName;
    this.modVersion = modData.modVersion;

    if(!this.modName)
      return;
    this.gameDataService.getUnitTypes(this.modName, this.modVersion).subscribe({next: list => {
      //console.log("Returned Data:", list);
      this.unitTypes = list;
      // this.allDatas.push(list);
      this.unitTypes.forEach(unitType => unitType.classifications?.forEach(classification => {
        let count = this.foundClassifications.get(classification) ?? 0;
        this.foundClassifications.set(classification, count + 1);
        this.classificationTypes = [...this.foundClassifications].map(v => v[0]).map(s => {return {name:s, notLinkable:true}});
      }));

    }});
    this.gameDataService.getTerrainTypes(this.modName, this.modVersion).subscribe({next: list => {
      this.terrainTypes = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getWeaponTypes(this.modName, this.modVersion).subscribe({next: list => {
      this.weaponTypes = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getCommanderTypes(this.modName, this.modVersion).subscribe({next: list => {
      this.commanderTypes = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getMovementClasses(this.modName, this.modVersion).subscribe({next: list => {
      this.movementClasses = list;
      // this.allDatas.push(list);
    }});

    this.gameDataService.getPassiveUnitEffects(this.modName, this.modVersion).subscribe({next: list => {
      this.passiveUnitEffects = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getPassiveTerrainEffects(this.modName, this.modVersion).subscribe({next: list => {
      this.passiveTerrainEffects = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getPassiveGlobalEffects(this.modName, this.modVersion).subscribe({next: list => {
      this.passiveGlobalEffects = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getActiveUnitEffects(this.modName, this.modVersion).subscribe({next: list => {
      this.activeUnitEffects = list; 
      // this.allDatas.push(list);
    }});
    this.gameDataService.getActiveTerrainEffects(this.modName, this.modVersion).subscribe({next: list => {
      this.activeTerrainEffects = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getActiveGlobalEffects(this.modName, this.modVersion).subscribe({next: list => {
      this.activeGlobalEffects = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getPlayerTypes(this.modName, this.modVersion).subscribe({next: list => {
      this.playerTypes = list;
      // this.allDatas.push(list);
    }});
    this.gameDataService.getSettings(this.modName, this.modVersion).subscribe({next: list => {
      this.settings = list;
    }});
  }

  ngOnInit(): void {

  }


  unitTypes:UnitType[] = [];
  weaponTypes:WeaponType[] = [];
  commanderTypes:CommanderType[] = [];
  terrainTypes:TerrainType[] = [];
  movementClasses:MovementClass[] = [];
  playerTypes:PlayerType[] = [];
  classificationTypes:{name:string, nonLinkable?:boolean}[] = [];

  passiveUnitEffects:EffectData.PassiveUnitEffect[] = [];
  passiveTerrainEffects:EffectData.PassiveTerrainEffect[] = [];
  passiveGlobalEffects:EffectData.PassiveGlobalEffect[] = [];
  activeUnitEffects:EffectData.ActiveUnitEffect[] = [];
  activeTerrainEffects:EffectData.ActiveTerrainEffect[] = [];
  activeGlobalEffects:EffectData.ActiveGlobalEffect[] = [];

  settings:Settings[] = [];

  variantTypes = [{name:'normal', notLinkable:true}, {name:'rain', notLinkable:true}, {name:'snow', notLinkable:true}, {name:'flat', notLinkable:true}];
  targetTypes = [{name:'own', notLinkable:true}, {name:'self', notLinkable:true}, {name:'ally', notLinkable:true}, {name:'neutral', notLinkable:true}, {name:'enemy', notLinkable:true}];
  missileTargetTypes = ['hp', 'value', 'infantry', 'count'].map(s => {return {name:s, notLinkable:true}});

  //allDatas:{name:string}[][] = [];

  foundClassifications:Map<string, number> = new Map<string, number>();

  modName:string | null = null;
  modVersion:string | undefined = undefined;
}
