import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ImageResource, TextResource } from '../GameData/Resource';

export enum CheckResult {
  Found, Missing, Noncheckable, Nonlinkable
}

@Component({
  selector: 'app-data-checker-table',
  templateUrl: './data-checker-table.component.html',
  styleUrls: ['./data-checker-table.component.scss']
})
export class DataCheckerTableComponent implements OnInit, OnChanges {
  @Input('data') data:any[] = [];
  @Input('refdata') refdata:{name:string, notLinkable?:boolean}[][] = [];
  @Input('name') name:string = '';
  @Input('textResources') textResources?:TextResource[];
  @Input('imageResources') imageResources?:ImageResource[];

  propertyNames:string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.propertyNames = this.getAllPropertyNames(this.data);
    this.propertyNames.sort((a, b) => {
      if(a === "name") 
        return -1;
      if(b === "name")
        return 1;
      return a.localeCompare(b);
    });
  }

  ngOnChanges():void {
    this.propertyNames = this.getAllPropertyNames(this.data);
    this.propertyNames.sort((a, b) => {
      if(a === "name") 
        return -1;
      if(b === "name")
        return 1;
      return a.localeCompare(b);
    });
  }
  
  public getAllPropertyNames(objs:any[]):string[] {
    let propertyNames = new Set<string>();
    for(let obj of objs) {
      let entries = Object.entries(obj);
      for(let pair of entries) {
        propertyNames.add(pair[0]);
      }
    }
    return [...propertyNames];
  }
}

@Component({
  selector: 'app-data-checker-renderer',
  templateUrl: './data-checker-renderer.component.html',
  styleUrls: ['./data-checker-table.component.scss']
})
export class DataCheckerRendererComponent implements OnInit, OnChanges {
  @Input('object') object:any;
  @Input('propertyName') propertyName:string = '';
  @Input('dataSource') dataSource: {name:string}[] = [];
  @Input('refdata') refdata:{name:string, notLinkable?:boolean}[][] = [];
  @Input('textResources') textResources?:TextResource[];
  @Input('imageResources') imageResources?:ImageResource[];
  // @Input('rowName') rowName:string = '';

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges():void {
  }

  public getProperties(obj:any):string[] {
    let ret = Object.entries(obj).map(value => value[0]);
    // console.log(ret);
    return ret;
  }

  public findInList(name:string, list:{name:string, notLinkable?:boolean}[], listToIgnore?:{name:string, notLinkable?:boolean}[]):CheckResult {
    if(listToIgnore == list)
      return CheckResult.Noncheckable;
    let ret = list.find(obj => obj.name == name);
    if(ret != null) {
      if(ret.notLinkable)
        return CheckResult.Nonlinkable;
      else
        return CheckResult.Found;
    } else
      return CheckResult.Missing;
  }

  public checkGeneric(name:string, propertyName:string):string {
    if(name.startsWith("!"))
      return this.checkGeneric(name.substring(1), propertyName);
    let foundNonLinkable = false;
    for(let list of this.refdata) {
      let ret = this.findInList(name, list, propertyName !== 'name' ? undefined : this.dataSource);
      if(ret === CheckResult.Nonlinkable) {
        foundNonLinkable = true;
        continue;
      }
      if(ret !== CheckResult.Missing) 
        return JSON.stringify(ret);
    }
    if(foundNonLinkable) 
      return JSON.stringify(CheckResult.Nonlinkable);
    return JSON.stringify(CheckResult.Missing);
  }

  public isNumber(obj:any):obj is number {
    return typeof obj === 'number';
  }

  public isBoolean(obj:any):obj is boolean {
    return typeof obj === 'boolean';
  }

  public isString(obj:any):obj is string {
    return typeof obj === 'string';
  }

  public isArray(obj:any):obj is [] {
    return Array.isArray(obj);
  }

  public isCompound(obj:any):boolean {
    return (!this.isEmpty(obj)
      && !this.isNumber(obj)
      && !this.isBoolean(obj)
      && !this.isString(obj)
      && !this.isArray(obj))
      ;
  }

  public isEmpty(obj:any): obj is null | undefined {
    return obj == null;
  }

  public stringify(obj:any):string {
    return JSON.stringify(obj);
  }

  public getTextResource(name:string):TextResource | undefined {
    return this.textResources?.find(o => o.key === name);
  }

  public getImageResource(name:string):ImageResource | undefined {
    return this.imageResources?.find(o => o.key === name);
  }

  public getAllImageResources(name:string):ImageResource[] {
    return this.imageResources?.filter(o => o.key === name) ?? [];
  }

  public getAllSmallImageStrings(name:string):string[] {
    return this.getAllImageResources(name).map(r => {
      if(r.smallImage === '')
        return '';
      return `data:image/png;base64,${r.smallImage}`;
    });
  }

  public getAllLargeImageStrings(name:string):string[] {
    return this.getAllImageResources(name).map(r => {
      if(r.largeImage === '')
        return '';
      return `data:image/png;base64,${r.largeImage}`;
    });
  }
}
