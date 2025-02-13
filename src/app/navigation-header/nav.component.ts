import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-navigator',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavigatorComponent implements OnInit {
  ngOnInit(): void {
  }

  constructor(
    private router:Router
  ) {

  }

  public selected(name:string):boolean {
    let currentRoute = this.router.url.substring(1);
    if(currentRoute.includes('#')) {
      currentRoute = currentRoute.substring(0, currentRoute.indexOf('#'));
    }
    if(currentRoute.includes('?')) {
      currentRoute = currentRoute.substring(0, currentRoute.indexOf('?'));
    }
    return name == 'home' && currentRoute == ''
      || name == 'testGame' && currentRoute == 'game'
      || name == currentRoute
    ;
  }

  public filterHREF(url:string):string | undefined {
    if(this.selected(url)) {
      return url;
    }
    return undefined;
  }
}