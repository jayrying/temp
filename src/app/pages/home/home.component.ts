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
  public featuredProperties: Property[];
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
      tags:item.tags
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
    let obj={}
    this.http.post("https://hidden-wave-78510.herokuapp.com/createuser",obj)
    .subscribe((res:any)=>{
      
    })
  
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
      tags:item.tags
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
      tags:["For Rent", "Residential Plot"]
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
      tags:["For Rent", "Residential Plot"]
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
    this.appService.getFeaturedProperties().subscribe(properties=>{
      this.featuredProperties = properties;
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
