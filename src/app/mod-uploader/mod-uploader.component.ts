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
  resultMessage:string = null;
  errorMessage:string = null;

  ngOnInit(): void {
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
    fileReader.readAsText(files.item(0));
  }

  getCookie():string {
    return document.cookie;
  }
}
