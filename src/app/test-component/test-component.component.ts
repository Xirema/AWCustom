import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss']
})
export class TestComponentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public generateText():string {
    return `
    <div>Some Text</div>
            
    <div class="mod">Some Aqua Text</div>`;
  }
}
