import { Component, OnInit } from '@angular/core';
declare var tableau: any;

@Component({
  selector: 'app-market-trends',
  templateUrl: './market-trends.component.html',
  styleUrls: ['./market-trends.component.scss']
})
export class MarketTrendsComponent implements OnInit {
  show = false;

  constructor() { }

  
  viz: any;//Inside your component class
  
  
  initViz() {
    const containerDiv = document.getElementById(".tableauPlaceholder");
    const vizUrl="https://public.tableau.com/views/WorldIndicators/GDPpercapita";
 
    const options = {
      width: containerDiv.offsetWidth,
      height: 600,
      // hideTabs: true,
      // hideToolbar: true,
      onFirstInteractive: function (ev) {
        console.log(ev);
      }
    };
    if(viz != null) { // viz is undefined on both the first and second page loads - even though second page load throws a 'viz already present' error
     viz.dispose();
    }
    var viz = new tableau.Viz(containerDiv, vizUrl,options);
    }
    
    // ngOnInit() {    
    //   this.initViz();
    // }
    
    
    
    
    
    
    
    
    ngOnInit() {
      // console.log('tableau', tableau);
      // setTimeout(() => {
      // this.show = true;
      // this.init(); 
      // this.initViz();
      // }, 100);
  }

  init() {
    // setTimeout(() => {
      const divElement = document.getElementById('viz1569110050089');
      const vizElement = divElement.getElementsByTagName('object')[0];
      if (divElement && vizElement) {
        if (divElement.offsetWidth > 800) {
          vizElement.style.width = '1200px';
          vizElement.style.height = '1000px';
        } else if (divElement.offsetWidth > 500) {
          vizElement.style.width = '1200px';
          vizElement.style.height = '1000px';
        } else {
          vizElement.style.width = '100%';
          vizElement.style.height = '1850px';
        }
      } else {
        setTimeout(() => {
          this.init();
        }, 500);
      }
    // }, 100);
  }

}
