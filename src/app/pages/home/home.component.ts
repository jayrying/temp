import { Component, OnInit } from '@angular/core';
import { Settings, AppSettings } from '../../app.settings';
import { AppService } from '../../app.service';
import { Property, Pagination } from '../../app.models';

import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout'; 
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import {propertysmall} from 'src/app/models/property.model';
import {environment} from '../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  watcher: Subscription;
  activeMediaQuery = ''; 

  public slides = [];
  public properties: Property[];
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public count: number = 8;
  public sort: string;
  public searchFields: any;
  public removedSearchField: string;
  public pagination:Pagination = new Pagination(1, 8, null, 2, 0, 0); 
  public message:string;
  public featuredProperties=[];
  private propertiesSubscription: Subscription;
  public attaproperties= [];
  public forbesfeeds;
  public luxurytravelfeeds;
  public settings: Settings;
  public propertyTypes;

  public searchformPropertyType;
  public searchformPurpose;
  public searchformFromPrice;
  public searchformToPrice;
  zooplaproperties: any[]=[];
  bahamasproperties: any=[];
  caymanproperties: any=[];
  
  constructor(private router:Router,
    public apiService:ApiService,
    public http:HttpClient,
    public appSettings:AppSettings, public appService:AppService, public mediaObserver: MediaObserver) {
    this.settings = this.appSettings.settings;

    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      // console.log(change)
      if(change.mqAlias == 'xs') {
        this.viewCol = 100;
      }
      else if(change.mqAlias == 'sm'){
        this.viewCol = 50;
      }
      else if(change.mqAlias == 'md'){
        this.viewCol = 33.3;
      }
      else{
        this.viewCol = 25;
      }
    });

  }

  ngOnInit() {  
    
   
    this.propertyTypes = this.apiService.getPropertyTypes();
    this.getSlides();
    this.getProperties();
    // if (this.mediaObserver.isActive('xs')) {
    //    console.log('mobile version -XS')
    // }
    this.getFeaturedProperties();
    this.apiService.getProperties();
    this.propertiesSubscription = this.apiService.getPropertiesUpdateListener().subscribe((properties:any)=>{
    // this.attaproperties = properties;
console.log("propertirs",properties)
localStorage.removeItem("propertyCountry")
localStorage.setItem("propertyCountry",'trindo')
    properties.forEach(item =>{
      let splitCurrency=item.price.split(' ');
     let askingPrice=splitCurrency[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      let currencyUnit=splitCurrency[0];
      this.attaproperties.push({
        detail:false,
        link:'',
        id:item.id,
      address:item.address,
      bathroom:item.bathroom,
      bedroom:item.bedroom,
      date:item.date,
      description:item.description,
      images:item.images,
      location:item.location,
      zooplaImages:[],
      price:currencyUnit + " "+askingPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ,
      size:item.size,
      tags:item.tags,
      "ratingsCount": 4,
      "ratingsValue": 400,
  })
  })

  });

  this.apiService.getForbesRssFeed();
  this.apiService.getForbesRssFeedUpdateListener().subscribe(res=>{
    this.forbesfeeds = res['items'].slice(0,4);
    console.log(this.forbesfeeds);
  })
  this.apiService.getLuxuryTravelRssFeed();
  this.apiService.getLuxuryTravelRssFeedUpdateListener().subscribe(res=>{    
    this.luxurytravelfeeds = res.slice(0,5);
  })
  }

  trindo(){
    // let obj={

    // }
    // this.http.post("https://hidden-wave-78510.herokuapp.com/createuser",obj)
    // .subscribe((res:any)=>{
      
    // })
  
    localStorage.removeItem("propertyCountry")
    localStorage.setItem("propertyCountry",'trindo')
    this.getFeaturedProperties();
    this.apiService.getProperties();
    this.propertiesSubscription = this.apiService.getPropertiesUpdateListener().subscribe((properties:any)=>{
    // this.attaproperties = properties;
    console.log("th",this.attaproperties)
    console.log("propertirs",properties)
    this.caymanproperties=[];
    this.bahamasproperties=[];
    this.zooplaproperties=[]
    properties.forEach(item =>{
      let splitCurrency=item.price.split(' ');
     let askingPrice=splitCurrency[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      let currencyUnit=splitCurrency[0];
      this.attaproperties.push({
        detail:false,
        link:'',
        id:item.id,
      address:item.address,
      
      bathroom:item.bathroom,
      bedroom:item.bedroom,
      date:item.date,
      description:item.description,
      images:item.images,
      zooplaImages:[],
      price:currencyUnit + " "+askingPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ,
      size:item.size,
      tags:item.tags,
      "ratingsCount": 4,
      "ratingsValue": 400,
  })
  })
    


  });

  this.apiService.getForbesRssFeed();
  this.apiService.getForbesRssFeedUpdateListener().subscribe(res=>{
    this.forbesfeeds = res['items'].slice(0,4);
    console.log(this.forbesfeeds);
  })
  this.apiService.getLuxuryTravelRssFeed();
  this.apiService.getLuxuryTravelRssFeedUpdateListener().subscribe(res=>{    
    this.luxurytravelfeeds = res.slice(0,5);
  })
  
  }

  england(){
    this.apiService.externalApi("https://api.zoopla.co.uk/api/v1/property_listings.js?radius=40&area=bahamas&&output_type=outcode&api_key=6c4qn9zh4kd8yd8c9rngqr9a")
    .subscribe((res:any)=>{
      console.log("resooo",res)
      localStorage.removeItem("propertyCountry")
      localStorage.setItem("propertyCountry",'england')
      this.attaproperties=[];
      this.caymanproperties=[];
      this.zooplaproperties=[]
res.listing.forEach(item =>{

    this.zooplaproperties.push({
      detail:false,
      link:'',
      id:item.listing_id,
    address:item.displayable_address,
    bathroom:item.num_bathrooms,
    bedroom:item.num_bedrooms,
    date:item.last_published_date,
    description:item.description,
    images:[],
    zooplaImages:[item.image_url,item.image_80_60_url,item.image_150_113_url,item.image_354_255_url],
    price:'GBP'+" "+item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    size:"5200 Sq.ft",
    "ratingsCount": 4,
    "ratingsValue": 400,
    tags:["For Rent", "Residential Plot"]
})
})

  
    })

   
  }
  bahamas(){
    this.apiService.externalApi("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.sirbahamas.com%2Feng%2Fsales%2Fbhs%2Frss-out")
    .subscribe((res:any)=>{
      console.log("resooo",res)
      localStorage.removeItem("propertyCountry")
      localStorage.setItem("propertyCountry",'bahamas')
      this.attaproperties=[];
      this.zooplaproperties=[];
      this.caymanproperties=[]
res.items.forEach(item =>{

    this.bahamasproperties.push({
      detail:true,
      link:item.link,
      id:item.listing_id,
      address:item.title,
      bathroom:0,
      bedroom:0,
      date:item.pubDate,
      description:item.description,
      images:[],
      bahamasImages:[item.enclosure.link],
      price:'',
      size:"5200 Sq.ft",
      tags:["For Rent", "Residential Plot"],
      "ratingsCount": 4,
      "ratingsValue": 400,
})
})

  
    })
  }

  cayman(){
    this.apiService.externalApi("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.sircaymanislands.com%2Feng%2Fsales%2Fcym%2Fnew-listings-sort%2Frss-out")
    .subscribe((res:any)=>{
      console.log("resooo",res)
      localStorage.removeItem("propertyCountry")
      localStorage.setItem("propertyCountry",'cayman')
      this.attaproperties=[];
      this.bahamasproperties=[];
      this.zooplaproperties=[]
res.items.forEach(item =>{

    this.caymanproperties.push({
      detail:true,
      link:item.link,
      id:item.listing_id,
      address:item.title,
      bathroom:0,
      bedroom:0,
      date:item.pubDate,
      description:item.description,
      images:[],
      caymanImages:[item.enclosure.link],
      price:'',
      size:"5200 Sq.ft",
      tags:["For Rent", "Residential Plot"],
      "ratingsCount": 4,
      "ratingsValue": 400,
})
})

  
    })
  }
  ngDoCheck(){
    if(this.settings.loadMore.load){     
      this.settings.loadMore.load = false;     
      this.getProperties();  
    }
  }

  ngOnDestroy(){
    this.resetLoadMore();
    this.watcher.unsubscribe();
  }

  public getSlides(){
    this.appService.getHomeCarouselSlides().subscribe(res=>{
      this.slides = res;
    })
  }

  public getProperties(){  
    //console.log('get properties by : ', this.searchFields);  
    this.appService.getProperties().subscribe(data => {      
      if(this.properties && this.properties.length > 0){  
        this.settings.loadMore.page++;
        this.pagination.page = this.settings.loadMore.page; 
      }
      let result = this.filterData(data); 
      if(result.data.length == 0){
        this.properties.length = 0;
        this.pagination = new Pagination(1, this.count, null, 2, 0, 0);  
        this.message = 'No Results Found';
        return false;
      } 
      if(this.properties && this.properties.length > 0){  
        this.properties = this.properties.concat(result.data);          
      }
      else{
        this.properties = result.data;  
      }
      this.pagination = result.pagination;
      this.message = null;

      if(this.properties.length == this.pagination.total){
        this.settings.loadMore.complete = true;
        this.settings.loadMore.result = this.properties.length;
      }
      else{
        this.settings.loadMore.complete = false;
      }
    })
  }

  public resetLoadMore(){
    this.settings.loadMore.complete = false;
    this.settings.loadMore.start = false;
    this.settings.loadMore.page = 1;
    this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
  }

  public filterData(data){
    return this.appService.filterData(data, this.searchFields, this.sort, this.pagination.page, this.pagination.perPage);
  }

  public searchClicked(){ 
    this.properties.length = 0;
    this.getProperties(); 
  }
  public searchChanged(event){    
    event.valueChanges.subscribe(() => {
      this.resetLoadMore();
      this.searchFields = event.value;
      setTimeout(() => {      
        this.removedSearchField = null;
      });
      if(!this.settings.searchOnBtnClick){     
        this.properties.length = 0;  
      }            
    }); 
    event.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => { 
      if(!this.settings.searchOnBtnClick){     
        this.getProperties(); 
      }
    });       
  } 
  public removeSearchField(field){ 
    this.message = null;   
    this.removedSearchField = field; 
  } 
 


  public changeCount(count){
    this.count = count;
    this.resetLoadMore();   
    this.properties.length = 0;
    this.getProperties();

  }
  public changeSorting(sort){    
    this.sort = sort;
    this.resetLoadMore(); 
    this.properties.length = 0;
    this.getProperties();
  }
  public changeViewType(obj){ 
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol; 
  }


  public getFeaturedProperties(){
    this.appService.getFeaturedProperty().subscribe((properties:any)=>{
      console.log("this.featuredPropery",properties.items)

      properties.items.forEach(list =>{
       this.featuredProperties.push( {
          "id": 2,
          "title": list.title, 
          "desc": list.description,
          "propertyType": "Office",
           "link":list.link,
          "city": "Los Angeles",
          "zipCode": "90044",
          "neighborhood": ["Hollywood", "Highland Park"],
          "street": ["Hollywood Street #2", "Highland Park Street #1"],
          "location" : {
              "lat": 33.954220,
              "lng": -118.293730
          },
          "formattedAddress" : "",
          "features": ["Air Conditioning", "Barbeque", "Dryer", "Microwave", "Refrigerator", "Fireplace", "Sauna", "TV Cable", "WiFi"], 
          "featured": true,
          "priceDollar": {
              "sale": null,
              "rent": 6500
          },
          "priceEuro": {
              "sale": null,
              "rent": 5800
          },
          "bedrooms": 0,
          "bathrooms": 0,
          "garages": 0,
          "area": {
              "value": 0,
              "unit": "ft²"
          },
          "yearBuilt": 2012,
          "ratingsCount": 4,
          "ratingsValue": 400,
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
          "gallery": [
          
            list.enclosure.link
              
          ],
          "plans": [
              {
                  "name": "First floor",
                  "desc": "Plan description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
                  "area": {
                      "value": 1180,
                      "unit": "ft²"
                  },
                  "rooms": 0,
                  "baths": 0,
                  "image": "assets/images/others/plan-1.jpg"
              },
              {
                  "name": "Second floor",
                  "desc": "Plan description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
                  "area": {
                      "value": 1200,
                      "unit": "ft²"
                  },
                  "rooms": 0,
                  "baths": 0,
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
          "published": list.pubDate,
          "lastUpdate": "2019-05-20 14:20:00",
          "views": 408
      })
      }
      )
      
    })
  } 
  public searchFormResetClicked()
  {
    console.log("search form clicked");
  }
  public searchFormSearchClicked()
  {
    let Purpose = '' ;
    if(this.searchformPurpose!=undefined)
    {
      Purpose = 'Purpose='+this.searchformPurpose +'&';
    }
    let PropertyType= '' ;
    if(this.searchformPropertyType!=undefined)
    {
      PropertyType = 'PropertyType='+this.searchformPropertyType +'&';
    }
    let FromPrice= '' ;
    if(this.searchformFromPrice!=undefined)
    {
      FromPrice = 'FromPrice='+this.searchformFromPrice +'&';
    }
    let ToPrice = '';
    if(this.searchformToPrice!=undefined)
    {
      ToPrice = 'ToPrice='+this.searchformToPrice;
    }
    var QueryString=Purpose+PropertyType+FromPrice+ToPrice;
    this.router.navigate(['/properties/'+QueryString]);
  }

}
