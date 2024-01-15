import { Component, OnInit } from '@angular/core';
import {GameDataService} from '../game-data.service';
import {CommanderType, PlayerType} from '../GameData/Commander';
import * as EffectData from '../GameData/Effect';
import {UnitType, WeaponType} from '../GameData/Unit';
import {TerrainType} from '../GameData/Terrain';
import {MovementClass} from '../GameData/Movement';
import {Settings} from '../GameData/Settings';
import { ImageResource, TextResource } from '../GameData/Resource';

@Component({
  selector: 'app-data-completeness-checker',
  templateUrl: './data-completeness-checker.component.html',
  styleUrls: ['./data-completeness-checker.component.scss']
})
export class DataCompletenessCheckerComponent implements OnInit {

  constructor(
    private gameDataService:GameDataService
  ) {}

  async getModData():Promise<{modName:string, modId:string, modVersion:string, expired:string | null} | undefined> {
    return new Promise<{modName:string, modId:string, modVersion:string, expired:string | null} | undefined>((resolve, reject) => {
      if(!this.modName) {
        resolve(undefined);
        return;
      }
      this.gameDataService.getModData({modName:this.modName, modVersion:this.modVersion}).subscribe({next: ret => {
        resolve(ret);
        this.errorText = undefined;
      }, error: err => {
        this.errorText = JSON.stringify(err);
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
    console.log('modData', modData);
    if(!modData) {
      this.modVersion = 'null';
      return;
    }
    this.modName = modData.modName;
    this.modVersion = modData.modVersion;

    if(!this.modName)
      return;
    this.gameDataService.getUnitTypes(modData.modId).subscribe({next: list => {
      //console.log("Returned Data:", list);
      this.unitTypes = list;
      // this.allDatas.push(list);
      this.unitTypes.forEach(unitType => unitType.classifications?.forEach(classification => {
        let count = this.foundClassifications.get(classification) ?? 0;
        this.foundClassifications.set(classification, count + 1);
        this.classificationTypes = [...this.foundClassifications].map(v => v[0]).map(s => {return {name:s, notLinkable:true}});
      }));

    }});
    this.gameDataService.getTerrainTypes(modData.modId).subscribe({next: list => this.terrainTypes = list});
    this.gameDataService.getWeaponTypes(modData.modId).subscribe({next: list => this.weaponTypes = list});
    this.gameDataService.getCommanderTypes(modData.modId).subscribe({next: list => this.commanderTypes = list});
    this.gameDataService.getMovementClasses(modData.modId).subscribe({next: list => this.movementClasses = list});

    this.gameDataService.getPassiveUnitEffects(modData.modId).subscribe({next: list => this.passiveUnitEffects = list});
    this.gameDataService.getPassiveTerrainEffects(modData.modId).subscribe({next: list => this.passiveTerrainEffects = list});
    this.gameDataService.getPassiveGlobalEffects(modData.modId).subscribe({next: list => this.passiveGlobalEffects = list});
    this.gameDataService.getActiveUnitEffects(modData.modId).subscribe({next: list => this.activeUnitEffects = list});
    this.gameDataService.getActiveTerrainEffects(modData.modId).subscribe({next: list => this.activeTerrainEffects = list});
    this.gameDataService.getActiveGlobalEffects(modData.modId).subscribe({next: list => this.activeGlobalEffects = list});
    this.gameDataService.getPlayerTypes(modData.modId).subscribe({next: list => this.playerTypes = list});
    this.gameDataService.getSettings(modData.modId).subscribe({next: list => this.settings = list});
    this.gameDataService.getTextResources(modData.modId).subscribe({next: list=> {
      this.unitTextResources = list.filter(i => i.type === 'unit');
      this.weaponTextResources = list.filter(i => i.type === 'weapon');
      this.terrainTextResources = list.filter(i => i.type === 'terrain');
      this.moveTextResources = list.filter(i => i.type === 'move');
      this.commanderTextResources = list.filter(i => i.type === 'commander');
      this.playerTextResources = list.filter(i => i.type === 'player');
      this.settingTextResources = list.filter(i => i.type === 'setting');
    }});
    this.gameDataService.getImageResources(modData.modId).subscribe({next: list => {
      this.unitImageResources = list.filter(i => i.type === 'unit');
      this.terrainImageResources = list.filter(i => i.type === 'terrain');
      this.commanderImageResources = list.filter(i => i.type === 'commander');
      this.playerImageResources = list.filter(i => i.type === 'player');
      this.settingImageResources = list.filter(i => i.type === 'setting');
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

  // textResources:TextResource[] = [];
  unitTextResources:TextResource[] = [];
  weaponTextResources:TextResource[] = [];
  terrainTextResources:TextResource[] = [];
  moveTextResources:TextResource[] = [];
  commanderTextResources:TextResource[] = [];
  playerTextResources:TextResource[] = [];
  settingTextResources:TextResource[] = [];

  unitImageResources:ImageResource[] = [];
  terrainImageResources:ImageResource[] = [];
  commanderImageResources:ImageResource[] = [];
  playerImageResources:ImageResource[] = [];
  settingImageResources:ImageResource[] = [];

  settings:Settings[] = [];

  variantTypes = [{name:'normal', notLinkable:true}, {name:'rain', notLinkable:true}, {name:'snow', notLinkable:true}, {name:'flat', notLinkable:true}];
  targetTypes = [{name:'own', notLinkable:true}, {name:'self', notLinkable:true}, {name:'ally', notLinkable:true}, {name:'neutral', notLinkable:true}, {name:'enemy', notLinkable:true}];
  missileTargetTypes = ['hp', 'value', 'infantry', 'count', 'manual'].map(s => {return {name:s, notLinkable:true}});

  //allDatas:{name:string}[][] = [];

  foundClassifications:Map<string, number> = new Map<string, number>();

  modName:string | null = null;
  modVersion:string | undefined = undefined;
  errorText:string | undefined;
}
