import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Settings, AppSettings } from '../../app.settings';
import { AppService } from '../../app.service';
import { Property, Pagination } from '../../app.models';
import { propertysmall } from 'src/app/models/property.model';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {
  propertyCountry;
  caymanproperties: any=[];

  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen: boolean = true;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public properties: Property[];
  public viewType: string = 'grid';
  public viewCol: number = 33.3;
  public count: number = 12;
  public pageIndex = 0;
  public sort: string;
  public searchFields: any;
  public removedSearchField: string;
  public pagination: Pagination = new Pagination(1, this.count, null, 2, 0, 0);
  public message: string;
  public watcher: Subscription;
  public settings: Settings;
  private propertiesSubscription: Subscription;
  private propertiescountSubscription: Subscription;
  public attaproperties= [];
  public propertiescount: number = 0;
  public propertyTypes;
  public cities;
  public locations;
  public searchformPurpose = "";
  public searchformPropertyType = "";
  public searchformFromPrice = "";
  public searchformToPrice = "";
  public searchformFromBedroom = "";
  public searchformToBedroom = "";
  public searchformFromBathroom = "";
  public searchformToBathroom = "";
  public searchformFromArea = "";
  public searchformToArea = "";
  public searchformFromBuiltinYear = "";
  public searchformToBuiltinYear = "";
  public searchformCity = "";
  public searchformLocation = "";
  constructor(public activateRoute: ActivatedRoute, public apiService: ApiService, public appSettings: AppSettings, public appService: AppService, public mediaObserver: MediaObserver) {
    this.settings = this.appSettings.settings;
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias == 'xs') {
        this.sidenavOpen = false;
        this.viewCol = 100;
      }
      else if (change.mqAlias == 'sm') {
        this.sidenavOpen = false;
        this.viewCol = 50;
      }
      else if (change.mqAlias == 'md') {
        this.viewCol = 50;
        this.sidenavOpen = true;
      }
      else {
        this.viewCol = 33.3;
        this.sidenavOpen = true;
      }
    });

  }
  ngOnInit() {
    console.log("country",this.propertyCountry)
    this.propertyCountry=localStorage.getItem("propertyCountry");
    this.apiService.getCities();
    this.apiService.getCitiesUpdateListener().subscribe(res=>{
      this.cities = res;
    })
    this.apiService.getLocations();
    this.apiService.getLocationsUpdateListener().subscribe(res=>{
      this.locations = res;
    })
    this.propertyTypes =this.apiService.getPropertyTypes();
    this.activateRoute.params.subscribe(params => {
      console.log('query params');
      console.log(params['QueryString']);
      if (params['QueryString'] != undefined) {
        let splittedquerystring = params['QueryString'].split('&');
        for(var i =0;i<splittedquerystring.length;i++)
        {
          var ss = splittedquerystring[i];
          if (ss.includes("Purpose")) {
            var j = ss.split('=');
            this.searchformPurpose = j[1];
          }
          else if (ss.includes("PropertyType")) {
            var j = ss.split('=');
            this.searchformPropertyType = j[1];
          }
          else if (ss.includes("FromPrice")) {
            var j = ss.split('=');
            this.searchformFromPrice = j[1];
          }
          else if (ss.includes("ToPrice")) {
            var j = ss.split('=');
            this.searchformToPrice = j[1];
          }
        }
      }
    })
    if(this.propertyCountry==='trindo'){
      this.getpropertiesnew();
      this.getProperties();
      this.getpropertiescount();


    }
    if(this.propertyCountry==='england'){
      this.getpropertiesengland();

    }
    if(this.propertyCountry==='bahamas'){
      this.getpropertiesbahamas();

    }
    if(this.propertyCountry==='cayman'){
      this.getpropertiescayman();

    }
    
  }
  ngOnDestroy() {
    this.watcher.unsubscribe();
  }
  public getpropertiesnew() {
    let fullqueryString = this.makefullquerystring();
    this.apiService.getProperties(fullqueryString);
    this.propertiesSubscription = this.apiService.getPropertiesUpdateListener().subscribe((properties) => {
      //this.attaproperties = properties;
      this.attaproperties=[]

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
  }
  public getpropertiesengland() {
    let fullqueryString = this.makefullquerystring();
    this.apiService.getProperties(fullqueryString);
    this.apiService
    .externalApi("https://api.zoopla.co.uk/api/v1/property_listings.js?radius=40&area=bahamas&&output_type=outcode&api_key=6c4qn9zh4kd8yd8c9rngqr9a")
    .subscribe((res:any)=>{
      console.log("resooo",res)
     this.propertiescount=res.listing.length
      this.attaproperties=[];
res.listing.forEach(item =>{

    this.attaproperties.push({
  
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
    // this.propertiesSubscription = this.apiService.getPropertiesUpdateListener().subscribe((properties) => {
    //   this.attaproperties = properties;
    // });
  }
  public getpropertiesbahamas(){
    this.apiService.externalApi("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.sirbahamas.com%2Feng%2Fsales%2Fbhs%2Fsingle-family-home-type%2Frss-out")
    .subscribe((res:any)=>{
      console.log("resooo",res)
      this.propertiescount=res.items.length
      localStorage.removeItem("propertyCountry")
      localStorage.setItem("propertyCountry",'bahamas')
      this.attaproperties=[];
res.items.forEach(item =>{

    this.attaproperties.push({
  
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
  public getpropertiescayman(){
    this.apiService.externalApi("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.sircaymanislands.com%2Feng%2Fsales%2Fcym%2Fnew-listings-sort%2Frss-out")
    .subscribe((res:any)=>{
      console.log("resooo",res)
      this.propertiescount=res.items.length
      localStorage.removeItem("propertyCountry")
      localStorage.setItem("propertyCountry",'cayman')
      this.attaproperties=[];
res.items.forEach(item =>{

    this.attaproperties.push({
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
  public makefullquerystring() {
    var querystring = "";
    querystring += "pageIndex=" + this.pageIndex;
    querystring += "&pageSize=" + this.count;
    querystring += "&"+this.makequerystringwithoutpageIndexAndCount();
    return querystring;
  }
  public makequerystringwithoutpageIndexAndCount() {
    var querystring = "";
    querystring += "Purpose=" + this.searchformPurpose;
    querystring += "&PropertyType=" + this.searchformPropertyType;
    querystring += "&FromPrice=" + this.searchformFromPrice;
    querystring += "&ToPrice=" + this.searchformToPrice;
    querystring += "&FromBedroom=" + this.searchformFromBedroom;
    querystring += "&ToBedroom=" + this.searchformToBedroom;
    querystring += "&FromBathroom=" + this.searchformFromBathroom;
    querystring += "&ToBathroom=" + this.searchformToBathroom;
    querystring += "&FromArea=" + this.searchformFromArea;
    querystring += "&ToArea=" + this.searchformToArea;
    querystring += "&FromBuiltinYear=" + this.searchformFromBuiltinYear;
    querystring += "&ToBuiltinYear=" + this.searchformToBuiltinYear;
    querystring += "&City=" + this.searchformCity;
    querystring += "&Location=" + this.searchformLocation;
    return querystring;
  }
  public getpropertiescount() {
    let queryString = this.makequerystringwithoutpageIndexAndCount();
    this.apiService.getPropertiesCount(queryString);
    this.propertiescountSubscription = this.apiService.getPropertiesCountUpdateListener().subscribe((count: number) => {
      this.propertiescount = count;
    });
  }
  public getProperties() {
    this.appService.getProperties().subscribe(data => {
      let result = this.filterData(data);
      if (result.data.length == 0) {
        this.properties.length = 0;
        this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
        this.message = 'No Results Found';
        return false;
      }
      this.properties = result.data;
      this.pagination = result.pagination;
      this.message = null;
    })
  }
  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
  }
  public filterData(data) {
    return this.appService.filterData(data, this.searchFields, this.sort, this.pagination.page, this.pagination.perPage);
  }
  public searchChanged(event) {
    event.valueChanges.subscribe(() => {
      this.resetPagination();
      this.searchFields = event.value;
      setTimeout(() => {
        this.removedSearchField = null;
      });
      if (!this.settings.searchOnBtnClick) {
        this.properties.length = 0;
      }
    });
    event.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      if (!this.settings.searchOnBtnClick) {
        //this.getProperties(); 
      }
    });
  }
  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }
  public changeCount(count) {
    this.count = count;
    this.properties.length = 0;
    this.resetPagination();
    this.getProperties();
    if(this.propertyCountry==='trindo'){
      this.getpropertiesnew();

    }
    if(this.propertyCountry==='england'){
      this.getpropertiesengland();

    }
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.properties.length = 0;
    this.getProperties();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }
  public onPageChange(e) {
    console.log(e);
    console.log(this.pageIndex);
    //this.pagination.page = e.pageIndex + 1;
    this.pageIndex = e.pageIndex;
    if(this.propertyCountry==='trindo'){
      this.getpropertiesnew();
      window.scrollTo(0, 0);
    }
    if(this.propertyCountry==='england'){
      this.getpropertiesengland();
      window.scrollTo(0, 0);
    }
    if(this.propertyCountry==='bahamas'){
      this.getpropertiesbahamas();
      window.scrollTo(0, 0);
    }
    if(this.propertyCountry==='cayman'){
      this.getpropertiescayman();
      window.scrollTo(0, 0);
    }
    
  }

  public searchFormResetClicked()
  {
    console.log('properties.component reset clicked');
    this.properties.length = 0;
    this.attaproperties = [];
    this.pageIndex = 0;
    window.scrollTo(0, 0);
    if(this.propertyCountry==='trindo'){
      this.getpropertiesnew();
      this.getpropertiescount();

    }
    if(this.propertyCountry==='england'){
      this.getpropertiesengland();

    }
    if(this.propertyCountry==='bahamas'){
      this.getpropertiesbahamas();

    }
    if(this.propertyCountry==='cayman'){
      this.getpropertiescayman();

    }
  }
  public searchFormSearchClicked()
  {
    // this.properties.length = 0;
    // this.attaproperties = [];
    this.pageIndex = 0;
    window.scrollTo(0, 0);
    if(this.propertyCountry==='trindo'){
      this.getpropertiesnew();
      this.getpropertiescount();

    }
    if(this.propertyCountry==='england'){
      this.getpropertiesengland();

    }
    if(this.propertyCountry==='bahamas'){
      this.getpropertiesbahamas();

    }
    if(this.propertyCountry==='cayman'){
      this.getpropertiescayman();

    }
  }

}