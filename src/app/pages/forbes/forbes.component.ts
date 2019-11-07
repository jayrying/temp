import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-forbes',
  templateUrl: './forbes.component.html',
  styleUrls: ['./forbes.component.scss']
})
export class ForbesComponent implements OnInit {
  public forbesfeeds;
  constructor(public appService:AppService,public apiService:ApiService) { }

  ngOnInit() {
    this.apiService.getForbesRssFeed();
    this.apiService.getForbesRssFeedUpdateListener().subscribe(res=>{
      console.log(res);
      this.forbesfeeds = res['items'];
    })
  }

}
