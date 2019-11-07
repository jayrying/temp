import { Component, OnInit, ViewChild } from '@angular/core';
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
  public attaproperties: propertysmall[] = [];
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
    this.getProperties();
    this.getpropertiescount();
    this.getpropertiesnew();
  }
  ngOnDestroy() {
    this.watcher.unsubscribe();
  }
  public getpropertiesnew() {
    let fullqueryString = this.makefullquerystring();
    this.apiService.getProperties(fullqueryString);
    this.propertiesSubscription = this.apiService.getPropertiesUpdateListener().subscribe((properties: propertysmall[]) => {
      this.attaproperties = properties;
    });
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
    this.getpropertiesnew();
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
    this.getpropertiesnew();
    window.scrollTo(0, 0);
  }
  public searchFormResetClicked()
  {
    console.log('properties.component reset clicked');
    this.properties.length = 0;
    this.attaproperties = [];
    this.pageIndex = 0;
    window.scrollTo(0, 0);
    this.getpropertiescount();
    this.getpropertiesnew();
  }
  public searchFormSearchClicked()
  {
    // this.properties.length = 0;
    // this.attaproperties = [];
    this.pageIndex = 0;
    window.scrollTo(0, 0);
    this.getpropertiescount();
    this.getpropertiesnew();
  }

}