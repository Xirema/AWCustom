import { Component, OnInit } from '@angular/core';
import {GameDataService} from '../services/game-data.service';
import {CommanderType, PlayerType} from '../GameData/Commander';
import * as EffectData from '../GameData/Effect';
import {UnitType, WeaponType} from '../GameData/Unit';
import {TerrainType} from '../GameData/Terrain';
import {MovementClass, MovementRule} from '../GameData/Movement';
import {Settings} from '../GameData/Settings';
import { ImageResource, TextResource } from '../GameResource/Resource';
import { ModData, ModMetadata } from '../GameData/ModMetadata';
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
    this.errorText = undefined;
    try {
      let modMetadata:ModMetadata | undefined;
      if(!this.selectedMod || this.selectedMod === '-1') {
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
          console.error('Invalid Mod Name!');
          this.loaded = 'failed';
          return;
        }
        modMetadata = await firstValueFrom(this.gameDataService.getModData({name:modName, version:modVersion}));
      } else {
        modMetadata = this.modList.find(m => m.modId == this.selectedMod);
        if(!modMetadata) {
          console.error('Invalid Mod in ModList');
          return;
        }
      }

      console.log('modData', modMetadata);
      if(!modMetadata.modId) {
        return;
      }
      let modId = modMetadata.modId;
      this.modData = await firstValueFrom(this.gameDataService.getMod(modId));
      let unitTypes = this.modData.units;
      let foundClassifications = new Map<string, number>();
      let classificationTypes:{name:string, notLinkable?:boolean}[] = [];
      unitTypes.forEach(unitType => {
        unitType.classifications?.forEach(classification => {
          let count = foundClassifications.get(classification) ?? 0;
          foundClassifications.set(classification, count+1);
        });
      });
      classificationTypes = [...foundClassifications].map(v => v[0]).map(s => {return {name:s, notLinkable:true}});
      this.foundClassifications = foundClassifications;
      this.classificationTypes = classificationTypes;
      this.loaded = 'loaded';
    } catch (err:any) {
      this.errorText = err.error;
      this.loaded = 'failed';
    }
  }

  async ngOnInit(): Promise<void> {
    try {
      let modListFuture = firstValueFrom(this.gameDataService.listMods({}));
      this.modList = await modListFuture;
    } catch (err:any) {
      this.errorText = err.error;
      this.loaded = 'failed';
    }
  }

  selectedMod?:string;
  modList:ModMetadata[] = [];
  modData?:ModData;
  classificationTypes:{name:string, nonLinkable?:boolean}[] = [];

  variantTypes = [{name:'normal', notLinkable:true}, {name:'rain', notLinkable:true}, {name:'snow', notLinkable:true}, {name:'flat', notLinkable:true}];
  targetTypes = [{name:'own', notLinkable:true}, {name:'self', notLinkable:true}, {name:'ally', notLinkable:true}, {name:'neutral', notLinkable:true}, {name:'enemy', notLinkable:true}];
  missileTargetTypes = ['hp', 'value', 'infantry', 'count', 'manual'].map(s => {return {name:s, notLinkable:true}});

  //allDatas:{name:string}[][] = [];

  foundClassifications:Map<string, number> = new Map<string, number>();

  errorText:string | undefined;
  loaded:'loading' | 'loaded' | 'failed' | 'unloaded' = 'unloaded';
}
