import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-luxurytravel',
  templateUrl: './luxurytravel.component.html',
  styleUrls: ['./luxurytravel.component.scss']
})
export class LuxuryTravelComponent implements OnInit {
  public feeds;
  constructor(public appService:AppService,public apiService:ApiService) { }

  ngOnInit() {
    this.apiService.getLuxuryTravelRssFeed();
    this.apiService.getLuxuryTravelRssFeedUpdateListener().subscribe(res=>{
      this.feeds = res;
      console.log(this.feeds);
    })
  }

}
