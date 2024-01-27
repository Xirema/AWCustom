import {Component, OnInit} from '@angular/core';
import { PostTestService } from '../services/post-test.service';
@Component({
    selector: 'app-post-test',
    template: '<h1>{{postTestString}}</h1>',
    styleUrls: []
})
export class PostTestComponent implements OnInit{
    constructor(private postTestService:PostTestService) {}
    ngOnInit(): void {
        this.postTestService.getPostTest('Hello').subscribe({next: ret => this.postTestString = ret.name + ' World'});
    }

    postTestString:string = '';
}