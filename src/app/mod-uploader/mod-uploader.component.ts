import { Component, OnInit } from '@angular/core';
import {GameDataService} from '../game-data.service';
import * as React from 'react';

@Component({
  selector: 'app-mod-uploader',
  templateUrl: './mod-uploader.component.html',
  styleUrls: ['./mod-uploader.component.scss']
})
export class ModUploaderComponent implements OnInit {
  constructor(private gameDataService:GameDataService) { }
  postTest:string = '';
  resultMessage:string | null = null;
  errorMessage:string | null = null;

  ngOnInit(): void {
    // this.gameDataService.getPostTest("PostTest").subscribe({next: result => this.postTest = result.name, error: err => this.errorMessage = JSON.stringify(err)});
  }

  handleFileInput(e:any):void {
    console.log(e);
    let files = e.target.files as FileList;
    if(files.length == 0) {
      return;
    }
    let fileReader = new FileReader();
    fileReader.onload = () => {
      let fileData:string = fileReader.result as string;
      try {
        this.gameDataService.postNewMod(this.getCookie(), fileData).subscribe({
          next: result => this.resultMessage = result, 
          error: error => this.errorMessage = JSON.stringify(error)
        });
      } catch (error) {
        this.errorMessage = JSON.stringify(error);
      }
    }
    let item = files.item(0);
    if(item != null)
      fileReader.readAsText(item);
  }

  getCookie():string {
    return document.cookie;
  }
}
