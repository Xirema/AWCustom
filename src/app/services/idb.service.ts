import { Injectable } from "@angular/core";


@Injectable({
    providedIn:'root'
})
export class IDBService {
    public async openDB(
        name:string,
        upgrade: (event:IDBVersionChangeEvent,db:IDBDatabase) => void
    ): Promise<IDBDatabase> {
        return new Promise<IDBDatabase>(async (resolve, reject) => {
            let idbRequest = window.indexedDB.open(name);
            idbRequest.onerror = (event) => {
                reject(event);
            };
            idbRequest.onupgradeneeded = (event) => {
                let db = idbRequest.result;
                upgrade(event, db);
            }
            idbRequest.onsuccess = (event) => {
                resolve(idbRequest.result);
            }
        });
    }

    public async dropDB(name:string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            let idbRequest = window.indexedDB.deleteDatabase(name);
            idbRequest.onsuccess = event => resolve();
            idbRequest.onerror = event => reject(`Unable to delete ${name}`);
        });
    }

    public async get(store:IDBObjectStore, key:any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let request = store.get(key);
            request.onsuccess = event => resolve(request.result);
            request.onerror = event => reject(`Unable to find key ${key}`);
        });
    }

    public async getAll(store:IDBObjectStore): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            let request = store.getAll();
            request.onsuccess = event => resolve(request.result);
            request.onerror = event => reject(`Unable to find keys`);
        });
    }

    public async getAllKeys(store:IDBObjectStore): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            let request = store.getAllKeys();
            request.onsuccess = event => resolve(request.result);
            request.onerror = event => reject(`Unable to find keys`);
        });
    }

    public async put(store:IDBObjectStore, key:any, value:any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let request = store.put(value, key);
            request.onsuccess = event => resolve();
            request.onerror = event => reject(`Unable to put ${key}`);
        });
    }

    public async putValue(store:IDBObjectStore, value:any) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let request = store.put(value);
            request.onsuccess = event => resolve();
            request.onerror = event => reject(`Unable to put value: ${JSON.stringify(event)}`);
        });
    }
}