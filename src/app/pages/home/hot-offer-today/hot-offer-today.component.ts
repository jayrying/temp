import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hot-offer-today',
  templateUrl: './hot-offer-today.component.html',
  styleUrls: ['./hot-offer-today.component.scss']
})
export class HotOfferTodayComponent implements OnInit {
  @Input('propertyId') propertyId;
  public property;
  constructor(public appService:AppService,public apiservice:ApiService) { }

  ngOnInit() {
    let id=603
    this.apiservice.getProperty(id); 
    this.apiservice.getPropertyUpdateListener().subscribe((res:any)=>{
      console.log("hot offer listing",res)


      this.property =

      {
        "id": res.id,
        "title": res.fkCityIdName, 
        "desc":res.description,
        "propertyType": "Apartment",
        "propertyStatus": ["Hot Offer", "No Fees"],
        "city": "Chicago",
        "zipCode": "60604",
        "neighborhood": ["Riverdale"],
        "street": ["Riverdale Street #1"],
        "location" : {
            "lat": 41.878113,
            "lng": -87.629799
        },
        "formattedAddress": res.address, 
        "features": ["Air Conditioning", "Barbeque", "Dryer", "Microwave", "Gym", "Fireplace", "Sauna", "TV Cable", "WiFi"],
        "featured": true, 
        "priceDollar": {
            "sale": res.askingPrice,
            "rent": null
        },
        "priceEuro": {
            "sale": 1300000,
            "rent": null
        },
        "bedrooms": res.bedRoom,
        "bathrooms": res.bathRoom,
        "garages": 2,
        "area": {
            "value": res.size,
            
        },
        "yearBuilt": 2002,
        "ratingsCount": 3,
        "ratingsValue": 220,
        "additionalFeatures": [                
            {
                "name": "Heat",
                "value": "Natural Gas"
            },
            {
                "name": "Roof",
                "value": "Composition/Shingle"
            },
            {
                "name": "Floors",
                "value": "Wall-to-Wall Carpet"
            },
            {
                "name": "Water",
                "value": "District/Public"
            },
            {
                "name": "Cross Streets",
                "value": "Orangethorpe-Gilbert"
            },
            {
                "name": "Windows",
                "value": "Skylights"
            },
            {
                "name": "Flat",
                "value": "5"
            },
            {
                "name": "Childroom",
                "value": "2"
            }
        ],
        "gallery": [environment.crmurl + res.images[0],environment.crmurl + res.images[1],
        environment.crmurl + res.images[2],environment.crmurl + res.images[3],
        environment.crmurl + res.images[4],environment.crmurl + res.images[5],
        environment.crmurl + res.images[6]],
        "plans": [
            {
                "name": "First floor",
                "desc": "Plan description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
                "area": {
                    "value": 1180,
                    "unit": "ft²"
                },
                "rooms": 3,
                "baths": 1,
                "image": "assets/images/others/plan-1.jpg"
            },
            {
                "name": "Second floor",
                "desc": "Plan description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
                "area": {
                    "value": 1200,
                    "unit": "ft²"
                },
                "rooms": 5,
                "baths": 2,
                "image": "assets/images/others/plan-2.jpg"
            }
        ],
        "videos": [
            {
                "name": "Video with 'mat-video' plugin",
                "link": "http://themeseason.com/data/videos/video-1.mp4"
            },
            {
                "name": "Video with 'ngx-embed-video' plugin",
                "link": "https://www.youtube.com/watch?v=-NInBEdSvp8"
            }
        ],
        "published": res.createdDate,
        "lastUpdate": "2019-06-11 14:20:00",
        "views": 754
    }
    }) 
  }

}
