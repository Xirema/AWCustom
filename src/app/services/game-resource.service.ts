import { Injectable } from '@angular/core';
import {Observable, firstValueFrom, from} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ResourcePack, PackMetadata } from '../GameResource/Resource';
import { HashMap } from '../util/hash-map';
import { stringHash } from '../util/hash-function';
import { IDBService } from './idb.service';

@Injectable({
    providedIn:'root'
})
export class GameResourceService{
    constructor(private httpClient:HttpClient, private idbService:IDBService) {}

    public getResourcePack(packId:string):Observable<ResourcePack> {
        return from(new Promise<ResourcePack>(async (resolve, reject) => {
            try {
                let metadataPromise = firstValueFrom(this.getPackMetadata({packId:packId}));
                let dbPromise = this.idbService.openDB(
                    'ResourcePacks',
                    (event, db) => {
                        const objectStore = db.createObjectStore('packs', {keyPath:'packMetadata.packId'});
                        objectStore.createIndex('name', 'packMetadata.name', {unique:false});
                        objectStore.createIndex('packId', 'packMetadata.packId', {unique:true});
                    }
                );
                let metadata = await metadataPromise;
                let db = await dbPromise;
                let transaction = db.transaction('packs', 'readwrite');
                let store = transaction.objectStore('packs');
                let existing = (await this.idbService.get(store, metadata.packId)) as ResourcePack | undefined;
                if(existing) {
                    resolve(existing);
                    return;
                }
                let resourcePack = await firstValueFrom(this.httpClient.get<ResourcePack>('resource/getPack', {headers:{packId:packId}}));
                store = db.transaction('packs', 'readwrite').objectStore('packs');
                await this.idbService.putValue(store, resourcePack);
                resolve(resourcePack);
            }
            catch (err) {
                reject(err);
            }
        }));
    }

    public getPackMetadata(pack:{name:string, version?:string} | {packId:string}):Observable<PackMetadata> {
        let headers = new HttpHeaders();
        if('name' in pack) {
            headers = headers.append('name', pack.name);
            if(pack.version != null) {
                headers = headers.append('version', pack.version);
            }
        } else {
            headers = headers.append('packId', pack.packId);
        }
        return this.httpClient.get<PackMetadata>('resource/getMetadata', {headers:headers});
    }

    public postNewPack(cookies:string, pack:string):Observable<string> {
        let headers = new HttpHeaders;
        headers = headers.append("cookies", cookies);
        return this.httpClient.post('resource/uploadPack', pack, {headers:headers, responseType:'text'});
    }
}