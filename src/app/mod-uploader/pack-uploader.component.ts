import { Component, OnInit, ViewChild } from '@angular/core';
import { GameResourceService } from '../services/game-resource.service';

@Component({
  selector: 'app-pack-uploader',
  templateUrl: './pack-uploader.component.html',
  styleUrls: ['./mod-uploader.component.scss']
})
export class PackUploaderComponent implements OnInit {
  constructor(private resourceService:GameResourceService) { }
  resultMessage?:string;
  errorMessage?:string;

  ngOnInit():void {}

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
        this.resourceService.postNewPack(this.getCookie(), fileData).subscribe({
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