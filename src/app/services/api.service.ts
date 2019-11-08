import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { MatBottomSheet } from '@angular/material';
import {environment} from '../../environments/environment';
import {propertysmall,property} from '../models/property.model';
import {MatSnackBar} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(public http:HttpClient, 
              private bottomSheet: MatBottomSheet, 
              private snackBar: MatSnackBar) { }
  public properties:propertysmall[] = [];
  public property:property;
  public propertiescount:number = 0;
  public cities:any= [];
  public locations:any= [];

  private propertiesUpdated = new Subject<propertysmall[]>();   
  private propertyUpdated = new Subject<property>();   
  private propertiesCountUpdated= new Subject<number>();
  private getLuxuryTravelRssFeedUpdated= new Subject<any>();
  private getForbesRssFeedUpdated= new Subject<any>();
  private citiesUpdated= new Subject<any>();
  public locationsUpdated = new Subject<any>();
  public getProperties(queryString:string=""){
    console.log(queryString);
    this.http.get<{status:string,data:propertysmall[]}>(environment.apiurl+"apigetproperties/?"+queryString)
    .subscribe((res)=>
    {
      this.properties = res.data;
      this.propertiesUpdated.next([...this.properties]);
    })
  }
  getPropertiesUpdateListener(){
    return this.propertiesUpdated.asObservable();
  }
  public getProperty(id:number){
    var formData = new FormData();
    formData.append('id',id.toString());
    this.http.post<{status:string,data:property}>(environment.apiurl+"apigetproperty",formData)
    .subscribe((res)=>
    {
      this.property = res.data;
      this.propertyUpdated.next(this.property);
    })
  }
  getPropertyUpdateListener(){
    return this.propertyUpdated.asObservable();
  }
  public getPropertiesCount(queryString:string=""){
    this.http.get<{status:string,data:number}>(environment.apiurl+"apigetpropertiescount/?"+queryString)
    .subscribe((res)=>
    {
      this.propertiescount = res.data;
      this.propertiesCountUpdated.next(this.propertiescount);
    })
  }
  getPropertiesCountUpdateListener(){
    return this.propertiesCountUpdated.asObservable();
  }
  getLuxuryTravelRssFeed()
  {
    this.http.get<{data:any}>('https://utils.residencecaribbean.com/api/luxurytravelfeeds')
    .subscribe(res=>{
      this.getLuxuryTravelRssFeedUpdated.next(res['feeds']);
    })
  }
  getLuxuryTravelRssFeedUpdateListener(){
    return this.getLuxuryTravelRssFeedUpdated.asObservable();
  }
  getForbesRssFeed()
  {
    this.http.get<{data:any}>('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.forbes.com%2Freal-estate%2Ffeed%2F')
    .subscribe(res=>{
      this.getForbesRssFeedUpdated.next(res);
    })
  }
  getForbesRssFeedUpdateListener(){
    return this.getForbesRssFeedUpdated.asObservable();
  }
  public getCities(){
    this.http.get<{status:string,data:any}>(environment.apiurl+"apigetcities")
    .subscribe((res)=>
    {
      this.cities = res.data;
      this.citiesUpdated.next(this.cities);
    })
  }
  getCitiesUpdateListener(){
    return this.citiesUpdated.asObservable();
  }
  public getLocations(){
    this.http.get<{status:string,data:any}>(environment.apiurl+"apigetlocations")
    .subscribe((res)=>
    {
      this.locations = res.data;
      this.locationsUpdated.next(this.locations);
    })
  }
  getLocationsUpdateListener(){
    return this.locationsUpdated.asObservable();
  }
  public getPropertyTypes(){
    return ["House","Apartment","Town House","Condominium","Farm House","Room","Penthouse","Building","Residential Plot","Commercial Plot","Agricultural Land","Industrial Land","Plot File","Plot Form","Office","Shop","Warehouse","Factory","Building"];
  }
  public postfeedback(data:any)
  {
    var formData = new FormData();
    formData.append('email',data.email);
    formData.append('message',data.message);
    this.http.post(environment.apiurl+"apipostfeedbackfromportal",formData).subscribe((res)=>{
      
      if(res['status']=="success")
        {
          this.snackBar.open('Thanks, your message has been sent', 'Success', {
            duration: 4000,
          });
        }
    })
  }
  public postpropertyresponse(data:any)
  {
    var formData = new FormData();
    formData.append('propertyid',data.propertyid);
    formData.append('name',data.name);
    formData.append('phone',data.phone);
    formData.append('email',data.email);
    formData.append('message',data.message);
    this.http.post(environment.apiurl+"apipostpropertyresponsefromportal",formData).subscribe((res)=>{
     
      if(res['status']=="success")
        {
          this.snackBar.open('Thanks, your message has been sent', 'Success', {
            duration: 4000,
          });
        }
    })
  }


  ///Api methods

  get(url: string) {
      
 
   
    return this.http.get(environment.apiurl + url,)


}
externalApi(url: string) {
  const headers = new HttpHeaders()

  headers.set('Content-Type', 'application/x-www-form-urlencoded');
  headers.set('Accept', 'application/json');


 
   
  return this.http.get( url,{ headers})


}
post(url: string, body) {
   
    return this.http.post(environment.apiurl + url, body)


}

put(url: string, body: string) {
    
    return this.http.put(environment.apiurl + url, body, )


}

detele(url: string) {
   
    return this.http.delete(environment.apiurl + url)


}
 
}




