import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostTestService {
    constructor(private httpClient:HttpClient) { }

    public getPostTest(data:string):Observable<{name:string}> {
        return this.httpClient.post<{name:string}>('https://localhost:8167/postTest', {name:data});
    }
}