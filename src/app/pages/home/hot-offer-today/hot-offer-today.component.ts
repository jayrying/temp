import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-hot-offer-today',
  templateUrl: './hot-offer-today.component.html',
  styleUrls: ['./hot-offer-today.component.scss']
})
export class HotOfferTodayComponent implements OnInit {
  @Input('propertyId') propertyId;
  public property;
  constructor(public appService:AppService) { }

  ngOnInit() {
    this.appService.getPropertyById(this.propertyId).subscribe(property=>{
      this.property = property;
    }) 
  }

}
