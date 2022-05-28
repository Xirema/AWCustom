import { Component, Input, OnInit } from '@angular/core';

export enum CheckResult {
  Found, Missing, Noncheckable
}

@Component({
  selector: 'app-data-checker-table',
  templateUrl: './data-checker-table.component.html',
  styleUrls: ['./data-checker-table.component.scss']
})
export class DataCheckerTableComponent implements OnInit {
  @Input('data') data:any[] = [];
  @Input('refdata') refdata:{name:string}[][] = [];

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

  public getProperties(obj:any):string[] {
    let ret = Object.entries(obj).map(value => value[0]);
    // console.log(ret);
    return ret;
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

  public findInList(name:string, list:{name:string}[], listToIgnore?:{name:string}[]):CheckResult {
    if(listToIgnore == list)
      return CheckResult.Noncheckable;
    if(list.find(obj => obj.name == name) != null)
      return CheckResult.Found;
    else
      return CheckResult.Missing;
  }

  public checkGeneric(name:string, propertyName:string):string {
    if(name.startsWith("!"))
      return this.checkGeneric(name.substring(1), propertyName);
    for(let list of this.refdata) {
      let ret = this.findInList(name, list, propertyName !== 'name' ? undefined : this.data);
      if(ret !== CheckResult.Missing) 
        return JSON.stringify(ret);
    }
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
}
