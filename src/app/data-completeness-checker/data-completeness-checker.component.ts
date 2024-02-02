import { Component, OnInit } from '@angular/core';
import {GameDataService} from '../services/game-data.service';
import {CommanderType, PlayerType} from '../GameData/Commander';
import * as EffectData from '../GameData/Effect';
import {UnitType, WeaponType} from '../GameData/Unit';
import {TerrainType} from '../GameData/Terrain';
import {MovementClass} from '../GameData/Movement';
import {Settings} from '../GameData/Settings';
import { ImageResource, TextResource } from '../GameResource/Resource';
import { ModMetadata } from '../GameData/ModMetadata';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-data-completeness-checker',
  templateUrl: './data-completeness-checker.component.html',
  styleUrls: ['./data-completeness-checker.component.scss']
})
export class DataCompletenessCheckerComponent implements OnInit {

  constructor(
    private gameDataService:GameDataService
  ) {}

  public async submit():Promise<void> {
    this.loaded = 'loading';
    try {
      let modNameElement = document.getElementById("modName") as HTMLInputElement;
      let modVersionElement = document.getElementById("modVersion") as HTMLInputElement;
      let modName:string | undefined;
      let modVersion:string | undefined;
      if(modNameElement.value && modNameElement.value !== '')
        modName = modNameElement.value;
      else
        modName = undefined;
      if(modVersionElement.value)
        modVersion = modVersionElement.value;
      else
        modVersion = undefined;

      if(!modName) {
        return;
      }
      this.modMetadata = await firstValueFrom(this.gameDataService.getModData({name:modName, version:modVersion}));

      console.log('modData', this.modMetadata);
      if(!this.modMetadata.modId) {
        return;
      }
      let modId = this.modMetadata.modId;
      let unitTypes = firstValueFrom(this.gameDataService.getUnitTypes(modId));
      let classifications = unitTypes.then(unitTypes => {
        let foundClassifications = new Map<string, number>();
        let classificationTypes:{name:string, notLinkable?:boolean}[] = [];
        unitTypes.forEach(unitType => {
          unitType.classifications?.forEach(classification => {
            let count = foundClassifications.get(classification) ?? 0;
            foundClassifications.set(classification, count+1);
          });
        });
        classificationTypes = [...foundClassifications].map(v => v[0]).map(s => {return {name:s, notLinkable:true}});
        return {foundClassifications:foundClassifications, classificationTypes:classificationTypes};
      });
      let terrainTypes = firstValueFrom(this.gameDataService.getTerrainTypes(modId));
      let weaponTypes = firstValueFrom(this.gameDataService.getWeaponTypes(modId));
      let commanderTypes = firstValueFrom(this.gameDataService.getCommanderTypes(modId));
      let movementClasses = firstValueFrom(this.gameDataService.getMovementClasses(modId));

      let passiveUnitEffects = firstValueFrom(this.gameDataService.getPassiveUnitEffects(modId));
      let passiveTerrainEffects = firstValueFrom(this.gameDataService.getPassiveTerrainEffects(modId));
      let passiveGlobalEffects = firstValueFrom(this.gameDataService.getPassiveGlobalEffects(modId));
      let activeUnitEffects = firstValueFrom(this.gameDataService.getActiveUnitEffects(modId));
      let activeTerrainEffects = firstValueFrom(this.gameDataService.getActiveTerrainEffects(modId));
      let activeGlobalEffects = firstValueFrom(this.gameDataService.getActiveGlobalEffects(modId));
      let playerTypes = firstValueFrom(this.gameDataService.getPlayerTypes(modId));
      let settings = firstValueFrom(this.gameDataService.getSettings(modId));

      this.unitTypes = await unitTypes;
      this.weaponTypes = await weaponTypes;
      this.terrainTypes = await terrainTypes;
      this.commanderTypes = await commanderTypes;
      this.movementClasses = await movementClasses;
      this.passiveUnitEffects = await passiveUnitEffects;
      this.passiveTerrainEffects = await passiveTerrainEffects;
      this.passiveGlobalEffects = await passiveGlobalEffects;
      this.activeUnitEffects = await activeUnitEffects;
      this.activeTerrainEffects = await activeTerrainEffects;
      this.activeGlobalEffects = await activeGlobalEffects;
      this.playerTypes = await playerTypes;
      this.settings = await settings;
      let ret = await classifications;
      this.foundClassifications = ret.foundClassifications;
      this.classificationTypes = ret.classificationTypes;
      this.loaded = 'loaded';
    } catch (err) {
      this.errorText = JSON.stringify(err);
      this.loaded = 'failed';
    }
  }

  ngOnInit(): void {

  }

  modMetadata:ModMetadata = {name:'', version:''};
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
  // unitTextResources:TextResource[] = [];
  // weaponTextResources:TextResource[] = [];
  // terrainTextResources:TextResource[] = [];
  // moveTextResources:TextResource[] = [];
  // commanderTextResources:TextResource[] = [];
  // playerTextResources:TextResource[] = [];
  // settingTextResources:TextResource[] = [];

  // unitImageResources:ImageResource[] = [];
  // terrainImageResources:ImageResource[] = [];
  // commanderImageResources:ImageResource[] = [];
  // playerImageResources:ImageResource[] = [];
  // settingImageResources:ImageResource[] = [];

  settings:Settings[] = [];

  variantTypes = [{name:'normal', notLinkable:true}, {name:'rain', notLinkable:true}, {name:'snow', notLinkable:true}, {name:'flat', notLinkable:true}];
  targetTypes = [{name:'own', notLinkable:true}, {name:'self', notLinkable:true}, {name:'ally', notLinkable:true}, {name:'neutral', notLinkable:true}, {name:'enemy', notLinkable:true}];
  missileTargetTypes = ['hp', 'value', 'infantry', 'count', 'manual'].map(s => {return {name:s, notLinkable:true}});

  //allDatas:{name:string}[][] = [];

  foundClassifications:Map<string, number> = new Map<string, number>();

  errorText:string | undefined;
  loaded:'loading' | 'loaded' | 'failed' | 'unloaded' = 'unloaded';
}
