import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { Property } from 'src/app/app.models';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppSettings, Settings } from 'src/app/app.settings';
import { CompareOverviewComponent } from 'src/app/shared/compare-overview/compare-overview.component';
import { EmbedVideoService } from 'ngx-embed-video'; 
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { property } from '../../../models/property.model';
import { ApiService } from 'src/app/services/api.service';
import { Subscription, Observable } from 'rxjs';
import {environment} from '../../../../environments/environment';
declare var jquery: any;
declare var $: any;@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;  
  @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation:true
  };
  public sidenavOpen:boolean = true;
  public config: SwiperConfigInterface = {}; 
  public config2: SwiperConfigInterface = {}; 
  private sub: any;
  public property:Property; 
  public attaproperty; 
  lat:any;
  lng:any;
  private propertySubscription: Subscription;
  public settings: Settings;  
  public embedVideo: any;
  public relatedProperties:any=[];
  public featuredProperties: Property[];
  public agent:any;
  public mortgageForm: FormGroup;
  public monthlyPayment:any;
  public contactForm: FormGroup;
  public environment;
  public propertyid;
  public showAnalytics = false;
  MapUrl: string;
  constructor(public apiService:ApiService, public appSettings:AppSettings, 
              public appService:AppService, 
              private activatedRoute: ActivatedRoute, 
              private embedService: EmbedVideoService,
              public fb: FormBuilder) {
    this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
    this.environment = environment;
    this.sub = this.activatedRoute.params.subscribe(params => {   
      this.getPropertyById(1); 
      this.getAttaPropertyById(params['id']);
      //

      this.propertyid = params['id'] 
    });
    
    this.getFeaturedProperties();

    this.getAgent(1);
    if(window.innerWidth < 960){
      this.sidenavOpen = false;
      this.sidenav.close();
    };
    this.mortgageForm = this.fb.group({
      principalAmount: ['', Validators.required],
      downPayment: ['', Validators.required], 
      interestRate: ['', Validators.required],
      period: ['', Validators.required]
    });
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
    setTimeout(() => {
      this.showAnalytics = true;
    })
  } 

  ngOnDestroy() {
    this.sub.unsubscribe();
  }  

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true; 
  }

  public getPropertyById(id){
    this.appService.getPropertyById(id).subscribe(data=>{
      this.property = data;  
      console.log("this.property",this.property)
    });
  }
  public getAttaPropertyById(id){
   this.apiService.getProperty(id); 
   this.propertySubscription = this.apiService.getPropertyUpdateListener().subscribe((res:any)=>{
    let askingPrice=undefined;
    let currencyUnit=undefined;
    

     if(res!=undefined){
      this.attaproperty = res;
      let splitCurrency=res.askingPrice.split(' ');
      let splitlocation=res.map.split(",")
      if(splitCurrency[0]==='TTD'){
      askingPrice=splitCurrency[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
       currencyUnit=splitCurrency[0];
      }
     
       
      
     this.attaproperty.askingPrice=askingPrice;
     this.attaproperty.currencyUnit=currencyUnit;

     this.attaproperty.latitude=parseFloat(splitlocation[0]);
     this.attaproperty.longitude= parseFloat(splitlocation[1]);
    
      console.log('Getting address: ', this.attaproperty);
     
     
  
    this.getRelatedProperties();
     }
     else{
       this.attaproperty=undefined
     }
    
     
    // let splitCurrency=res.listing[0].askingPrice.split(' ');
    // console.log("spliting",splitCurrency)
    if(this.attaproperty===undefined){
      this.apiService.externalApi(`https://api.zoopla.co.uk/api/v1/property_listings.js?listing_id=${id}&radius=40&area=bahamas&&output_type=outcode&api_key=6c4qn9zh4kd8yd8c9rngqr9a`)
      .subscribe((res:any)=>{
        console.log("resooo",res)
        this.attaproperty={};
      
      this.attaproperty={
    
        agentName:res.listing[0].agent_name,
        agentPersonalDescription:res.listing[0].agent_address,
        agent_logo:res.listing[0].agent_logo,
        agent_phone:res.listing[0].agent_phone,
        id:res.listing[0].listing_id,
      address:res.listing[0].displayable_address,
      bathRoom:res.listing[0].num_bathrooms,
      bedRoom:res.listing[0].num_bedrooms,
      date:res.listing[0].last_published_date,
      description:res.listing[0].description,
      images:[],
      zooplaImages:[res.listing[0].image_url,res.listing[0].image_80_60_url,res.listing[0].image_150_113_url,res.listing[0].image_354_255_url],
      askingPrice:res.listing[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      fkLocationIdNameWithParentName:res.listing[0].street_name,
      fkCityIdName:res.listing[0].county,
      propertyType:res.listing[0].property_type,
      purpose:res.listing[0].listing_status,
      latitude:res.listing[0].latitude,
      longitude:res.listing[0].longitude,
      size:"5200 Sq.ft",
      tags:["For Rent", "Residential Plot"]
  }
  this.getRelatedProperties();

  
    
      })    }
   })

  }

  ngAfterViewInit(){
    this.config = {
      observer: false,
      slidesPerView: 1,
      spaceBetween: 0,       
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,        
      loop: false,
      preloadImages: false,
      lazy: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      }
    };

    this.config2 = {
      observer: false,
      slidesPerView: 4,
      spaceBetween: 16,      
      keyboard: true,
      navigation: false,
      pagination: false, 
      grabCursor: true,       
      loop: false, 
      preloadImages: false,
      lazy: true,  
      breakpoints: {
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        }
      }
    } 

  }
  

  public onOpenedChange(){ 
    this.swipers.forEach(swiper => { 
      if(swiper){
        swiper.update();
      } 
    });     
  }

  public selectImage(index:number){ 
    this.swipers.forEach(swiper => {
      if(swiper['elementRef'].nativeElement.id == 'main-carousel'){
        swiper.setIndex(index);
      }      
    }); 
  }

  public onIndexChange(index: number) {  
    this.swipers.forEach(swiper => { 
      let elem = swiper['elementRef'].nativeElement;
      if(elem.id == 'small-carousel'){
        swiper.setIndex(index);  
        for (let i = 0; i < elem.children[0].children.length; i++) {
          const element = elem.children[0].children[i]; 
          if(element.classList.contains('thumb-'+index)){
            element.classList.add('active-thumb'); 
          }
          else{
            element.classList.remove('active-thumb'); 
          }
        }
      } 
    });     
  }

  public addToCompare(){
    this.appService.addToCompare(this.property, CompareOverviewComponent, (this.settings.rtl) ? 'rtl':'ltr'); 
  }

  public onCompare(){
    return this.appService.Data.compareList.filter(item=>item.id == this.property.id)[0];
  }

  public addToFavorites(){
    this.appService.addToFavorites(this.property, (this.settings.rtl) ? 'rtl':'ltr');
  }

  public onFavorites(){
    return this.appService.Data.favorites.filter(item=>item.id == this.property.id)[0];
  }


  public getRelatedProperties(){
    let relatedarray = this.appService.getrelatedproperty();
    console.log("related property",relatedarray)

    relatedarray.subscribe((res:any) =>{
      console.log("res",this.attaproperty)
      res.data.forEach((property:any)=>{

        if(property.bedroom===this.attaproperty.bedRoom
           || property.bathroom===this.attaproperty.bathRoom
           || property.location===this.attaproperty.location
          ){


          this.relatedProperties.push(
            {
                      "id": property.id,
                      "title": property.location, 
                      "desc": property.description,
                      "propertyType": "Apartment",
                      "propertyStatus": property.tags,
                      "city":property.location,
                      "zipCode": "10033",
                      "neighborhood": ["Astoria", "Midtown"],
                      "street": ["Astoria Street #1", "Midtown Street #2"],
                      "location" : {
                          "lat": 40.849150,
                          "lng": -73.935100
                      },
                      "formattedAddress" : property.address,
                      "features": ["Air Conditioning", "Barbeque", "Dryer", "Microwave", "Refrigerator", "Fireplace", "Swimming Pool", "TV Cable", "WiFi"],
                      "featured": false, 
                      "priceDollar": {
                          "sale": property.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                          "rent": null
                      },
                      "priceEuro": {
                          "sale": property.price,
                          "rent": null
                      },
                      "bedrooms": property.bedroom,
                      "bathrooms": property.bathroom,
                      "garages": 1,
                      "area": {
                          "value": 2380,
                          "unit": "ft²"
                      },
                      "yearBuilt": 2007,
                      "ratingsCount": 3,
                      "ratingsValue": 280,
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
                      "gallery":[environment.crmurl + property.images[0],environment.crmurl + property.images[1],
                      environment.crmurl + property.images[2],environment.crmurl + property.images[3],
                      environment.crmurl + property.images[4],environment.crmurl + property.images[5],
                      environment.crmurl + property.images[6]],
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
                              "image": property.images[0]
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
                      "published": "2012-08-12 17:17:30",
                      "lastUpdate": "2019-05-20 14:20:00",
                      "views": 322
                  },)
               

        }
      })
      console.log(this.relatedProperties)
    })
  
  //   this.appService.getRelatedProperties().subscribe((properties:any)=>{
  //     this.relatedProperties = properties;
  // //   this.apiService.getPropertiesUpdateListener().subscribe(properties=>{

  // //     this.relatedProperties =  properties.filter(function(hero) {
  // //       return hero.price == “Marvel”;
  // //     });

  // //   })
  // // }
      
  //   })
  }

  public getFeaturedProperties(){
    this.appService.getFeaturedProperties().subscribe(properties=>{
      this.featuredProperties = properties.slice(0,3); 
    })
  } 

  public getAgent(agentId:number = 1){
    var ids = [1,2,3,4,5]; //agent ids 
    agentId = ids[Math.floor(Math.random()*ids.length)]; //random agent id
    this.agent = this.appService.getAgents().filter(agent=> agent.id == agentId)[0]; 
  }

  public onContactFormSubmit(values:Object){
    //if (this.contactForm.valid) { 
      console.log(values);
      let data = {propertyid:this.propertyid.toString(),name:values['name'],phone:values['phone'].toString(),email:values['email'],message:values['message']};
      this.apiService.postpropertyresponse(data);
      this.contactForm.setValue({name:'',phone:'',email:'',message:''});
      this.contactForm.controls.name.setErrors(null);
      this.contactForm.controls.phone.setErrors(null);
      this.contactForm.controls.email.setErrors(null);
      this.contactForm.controls.message.setErrors(null);
   // } 
  }

  public onMortgageFormSubmit(values:Object){ 
    if (this.mortgageForm.valid) { 
      var principalAmount = values['principalAmount']
      var down = values['downPayment']
      var interest = values['interestRate']
      var term = values['period']
      this.monthlyPayment = this.calculateMortgage(principalAmount, down, interest / 100 / 12, term * 12).toFixed(2);
    }     
  }
  public calculateMortgage(principalAmount:any, downPayment:any, interestRate:any, period:any){    
    return ((principalAmount-downPayment) * interestRate) / (1 - Math.pow(1 + interestRate, -period));
  }
  
  getAgentImage() {
    if(!this.attaproperty) return null;
    return this.attaproperty.agentCompanyImagePath ? '//residencecrm.com' + this.attaproperty.agentCompanyImagePath : null;
  }
  getAgentPhoneNumber() {
    if(!this.attaproperty) return null;
    return this.attaproperty.agentPhoneNumber || null;
  }

}