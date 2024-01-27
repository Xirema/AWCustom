import { Component, OnInit } from '@angular/core';
import { IDBService } from '../services/idb.service';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss']
})
export class TestComponentComponent implements OnInit {

  constructor(private idbService:IDBService) { }

  async ngOnInit(): Promise<void> {
    this.generatedText = await this.generateText();
  }

  generatedText:{id:number, message:string}[] = [];

  public async generateText():Promise<{id:number, message:string}[]> {
    let db = await this.idbService.openDB('testDB', (event, db) => {
      db.createObjectStore('test', {keyPath:'id'});
    });
    let transaction = db.transaction('test', 'readwrite');
    let testStore = transaction.objectStore('test');
    let visitMessage = `Visit occurred on ${new Date().toLocaleString()}.`;
    let visits = await this.idbService.getAll(testStore) as {id:number, message:string}[];
    let largestKey = Math.max(-1, ...visits.map(val => val.id));
    visits.push({id:largestKey + 1, message:visitMessage});
    await this.idbService.putValue(testStore, visits[visits.length - 1]);
    return visits;
  }

}
