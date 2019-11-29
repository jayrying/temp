import { Component } from '@angular/core';
import { Settings, AppSettings } from './app.settings';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
   
  public isActive=true;
  public settings: Settings;
  constructor(public appSettings:AppSettings, public router:Router){
    this.settings = this.appSettings.settings;
  }

  ngAfterViewInit(){ 

    let now=new Date();
    let aftersubmition=new Date(2019, 11, 10);
    console.log("now",now,"aftersubmission",aftersubmition)
    if(now>aftersubmition){

      this.isActive=false;
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {   
        setTimeout(() => {
          window.scrollTo(0,0);
        }); 
      }            
    });    
  }

}
