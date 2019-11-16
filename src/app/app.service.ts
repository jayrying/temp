import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatBottomSheet } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { Property, Location } from './app.models';
import { AppSettings } from './app.settings';
import { ApiService } from './services/api.service';
import { environment } from 'src/environments/environment';
import { _ } from 'underscore';
import { format } from 'path';
export class Data {
  constructor(public properties: Property[],
              public compareList: Property[],
              public favorites: Property[],
              public locations: Location[]) { }
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public Data = new Data(
    [], // properties
    [], // compareList
    [], // favorites
    []  // locations
  )
  public url = "assets/data/";
  public apiKey = 'AIzaSyAJZ-CwYM7VtOJlrj14iLdYAYwI-f-JH7g';
  
  constructor(public http:HttpClient, 
              private bottomSheet: MatBottomSheet, 
              private snackBar: MatSnackBar,
              public appSettings:AppSettings,
              public apiserivce:ApiService) { }
    
  public getProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'properties.json');
  }

  public getPropertyById(id): Observable<Property>{
    return this.http.get<Property>(this.url + 'property-' + id + '.json');
  }

  public getFeaturedProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'featured-properties.json');
  } 

  public getRelatedProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'related-properties.json');
  }

  public getPropertiesByAgentId(agentId): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'properties-agentid-' + agentId + '.json');
  }

  public getLocations(): Observable<Location[]>{
    return this.http.get<Location[]>(this.url + 'locations.json');
  }

  public getAddress(lat = 10.6946987, lng = -62.3330635){ 
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key='+this.apiKey);
  }

  public getLatLng(address){ 
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?key='+this.apiKey+'&address='+address);
  }

  public getFullAddress(lat = 40.714224, lng = -73.961452){ 
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key='+this.apiKey).subscribe(data =>{ 
      return data['results'][0]['formatted_address'];
    });
  }

  public addToCompare(property:Property, component, direction){ 
    if(!this.Data.compareList.filter(item=>item.id == property.id)[0]){
      this.Data.compareList.push(property);
      this.bottomSheet.open(component, {
        direction: direction
      }).afterDismissed().subscribe(isRedirect=>{  
        if(isRedirect){
          window.scrollTo(0,0);
        }        
      }); 
    } 
  }

  public addToFavorites(property:Property, direction){
    if(!this.Data.favorites.filter(item=>item.id == property.id)[0]){
      this.Data.favorites.push(property);
      this.snackBar.open('The property "' + property.title + '" has been added to favorites.', '×', {
        verticalPosition: 'top',
        duration: 3000,
        direction: direction 
      });  
    }    
  }

  public getPropertyTypes(){
    return [ 
      { id: 1, name: 'Office' },
      { id: 2, name: 'House' },
      { id: 3, name: 'Apartment' }
    ]
  }

  public getPropertyStatuses(){
    return [ 
      { id: 1, name: 'Sale' },
      { id: 2, name: 'Rent' },
    ]
  }
  

  public getCities(){
    return [ 
      { id: 1, name: 'New York' },
      { id: 2, name: 'Chicago' },
      { id: 3, name: 'Los Angeles' },
      { id: 4, name: 'Seattle' } 
    ]
  }

  public getNeighborhoods(){
    return [      
      { id: 1, name: 'Astoria', cityId: 1 },
      { id: 2, name: 'Midtown', cityId: 1 },
      { id: 3, name: 'Chinatown', cityId: 1 }, 
      { id: 4, name: 'Austin', cityId: 2 },
      { id: 5, name: 'Englewood', cityId: 2 },
      { id: 6, name: 'Riverdale', cityId: 2 },      
      { id: 7, name: 'Hollywood', cityId: 3 },
      { id: 8, name: 'Sherman Oaks', cityId: 3 },
      { id: 9, name: 'Highland Park', cityId: 3 },
      { id: 10, name: 'Belltown', cityId: 4 },
      { id: 11, name: 'Queen Anne', cityId: 4 },
      { id: 12, name: 'Green Lake', cityId: 4 }      
    ]
  }

  public getStreets(){
    return [      
      { id: 1, name: 'Astoria Street #1', cityId: 1, neighborhoodId: 1},
      { id: 2, name: 'Astoria Street #2', cityId: 1, neighborhoodId: 1},
      { id: 3, name: 'Midtown Street #1', cityId: 1, neighborhoodId: 2 },
      { id: 4, name: 'Midtown Street #2', cityId: 1, neighborhoodId: 2 },
      { id: 5, name: 'Chinatown Street #1', cityId: 1, neighborhoodId: 3 }, 
      { id: 6, name: 'Chinatown Street #2', cityId: 1, neighborhoodId: 3 },
      { id: 7, name: 'Austin Street #1', cityId: 2, neighborhoodId: 4 },
      { id: 8, name: 'Austin Street #2', cityId: 2, neighborhoodId: 4 },
      { id: 9, name: 'Englewood Street #1', cityId: 2, neighborhoodId: 5 },
      { id: 10, name: 'Englewood Street #2', cityId: 2, neighborhoodId: 5 },
      { id: 11, name: 'Riverdale Street #1', cityId: 2, neighborhoodId: 6 }, 
      { id: 12, name: 'Riverdale Street #2', cityId: 2, neighborhoodId: 6 },
      { id: 13, name: 'Hollywood Street #1', cityId: 3, neighborhoodId: 7 },
      { id: 14, name: 'Hollywood Street #2', cityId: 3, neighborhoodId: 7 },
      { id: 15, name: 'Sherman Oaks Street #1', cityId: 3, neighborhoodId: 8 },
      { id: 16, name: 'Sherman Oaks Street #2', cityId: 3, neighborhoodId: 8 },
      { id: 17, name: 'Highland Park Street #1', cityId: 3, neighborhoodId: 9 },
      { id: 18, name: 'Highland Park Street #2', cityId: 3, neighborhoodId: 9 },
      { id: 19, name: 'Belltown Street #1', cityId: 4, neighborhoodId: 10 },
      { id: 20, name: 'Belltown Street #2', cityId: 4, neighborhoodId: 10 },
      { id: 21, name: 'Queen Anne Street #1', cityId: 4, neighborhoodId: 11 },
      { id: 22, name: 'Queen Anne Street #2', cityId: 4, neighborhoodId: 11 },
      { id: 23, name: 'Green Lake Street #1', cityId: 4, neighborhoodId: 12 },
      { id: 24, name: 'Green Lake Street #2', cityId: 4, neighborhoodId: 12 }      
    ]
  }

  public getFeatures(){
    return [ 
      { id: 1, name: 'Air Conditioning', selected: false },
      { id: 2, name: 'Barbeque', selected: false },
      { id: 3, name: 'Dryer', selected: false },
      { id: 4, name: 'Microwave', selected: false }, 
      { id: 5, name: 'Refrigerator', selected: false },
      { id: 6, name: 'TV Cable', selected: false },
      { id: 7, name: 'Sauna', selected: false },
      { id: 8, name: 'WiFi', selected: false },
      { id: 9, name: 'Fireplace', selected: false },
      { id: 10, name: 'Swimming Pool', selected: false },
      { id: 11, name: 'Gym', selected: false },
    ]
  }


  public getHomeCarouselSlides(){
    return this.http.get<any[]>(this.url + 'slides.json');
  }


  public filterData(data, params: any, sort?, page?, perPage?){ 
   
    if(params){

      if(params.propertyType){
        data = data.filter(property => property.propertyType == params.propertyType.name)
      }

      if(params.propertyStatus && params.propertyStatus.length){       
        let statuses = [];
        params.propertyStatus.forEach(status => { statuses.push(status.name) });           
        let properties = [];
        data.filter(property =>
          property.propertyStatus.forEach(status => {             
            if(statuses.indexOf(status) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties;
      }

      if(params.price){
        if(this.appSettings.settings.currency == 'USD'){          
          if(params.price.from){
            data = data.filter(property => {
              if(property.priceDollar.sale && property.priceDollar.sale >= params.price.from ){
                return true;
              }
              if(property.priceDollar.rent && property.priceDollar.rent >= params.price.from ){
                return true;
              } 
              return false;
            });
          }
          if(params.price.to){
            data = data.filter(property => {
              if(property.priceDollar.sale && property.priceDollar.sale <= params.price.to){
                return true;
              }
              if(property.priceDollar.rent && property.priceDollar.rent <= params.price.to){
                return true;
              } 
              return false;
            });          
          }
        }
        if(this.appSettings.settings.currency == 'EUR'){
          if(params.price.from){
            data = data.filter(property => {
              if(property.priceEuro.sale && property.priceEuro.sale >= params.price.from ){
                return true;
              }
              if(property.priceEuro.rent && property.priceEuro.rent >= params.price.from ){
                return true;
              } 
              return false;
            });

          }
          if(params.price.to){
            data = data.filter(property => {
              if(property.priceEuro.sale && property.priceEuro.sale <= params.price.to){
                return true;
              }
              if(property.priceEuro.rent && property.priceEuro.rent <= params.price.to){
                return true;
              } 
              return false;
            });
          }
        }        
      }  

      if(params.city){
        data = data.filter(property => property.city == params.city.name)
      }

      if(params.zipCode){
        data = data.filter(property => property.zipCode == params.zipCode)
      }
      
      if(params.neighborhood && params.neighborhood.length){       
        let neighborhoods = [];
        params.neighborhood.forEach(item => { neighborhoods.push(item.name) });           
        let properties = [];
        data.filter(property =>
          property.neighborhood.forEach(item => {             
            if(neighborhoods.indexOf(item) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties;
      }

      if(params.street && params.street.length){       
        let streets = [];
        params.street.forEach(item => { streets.push(item.name) });           
        let properties = [];
        data.filter(property =>
          property.street.forEach(item => {             
            if(streets.indexOf(item) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties;
      }

      if(params.bedrooms){
        if(params.bedrooms.from){
          data = data.filter(property => property.bedrooms >= params.bedrooms.from)
        }
        if(params.bedrooms.to){
          data = data.filter(property => property.bedrooms <= params.bedrooms.to)
        }
      } 
      
      if(params.bathrooms){
        if(params.bathrooms.from){
          data = data.filter(property => property.bathrooms >= params.bathrooms.from)
        }
        if(params.bathrooms.to){
          data = data.filter(property => property.bathrooms <= params.bathrooms.to)
        }
      } 

      if(params.garages){
        if(params.garages.from){
          data = data.filter(property => property.garages >= params.garages.from)
        }
        if(params.garages.to){
          data = data.filter(property => property.garages <= params.garages.to)
        }
      } 

      if(params.area){
        if(params.area.from){
          data = data.filter(property => property.area.value >= params.area.from)
        }
        if(params.area.to){
          data = data.filter(property => property.area.value <= params.area.to)
        }
      } 

      if(params.yearBuilt){
        if(params.yearBuilt.from){
          data = data.filter(property => property.yearBuilt >= params.yearBuilt.from)
        }
        if(params.yearBuilt.to){
          data = data.filter(property => property.yearBuilt <= params.yearBuilt.to)
        }
      }

      if(params.features){       
        let arr = [];
        params.features.forEach(feature => { 
          if(feature.selected)
            arr.push(feature.name);
        });  
        if(arr.length > 0){
          let properties = [];
          data.filter(property =>
            property.features.forEach(feature => {             
              if(arr.indexOf(feature) > -1){                 
                if(!properties.includes(property)){
                  properties.push(property);
                }                
              }
            })
          );
          data = properties;
        }         
        
      }
      
    }

    // console.log(data)

    //for show more properties mock data 
    for (var index = 0; index < 2; index++) {
      data = data.concat(data);        
    }     
     
    this.sortData(sort, data);
    return this.paginator(data, page, perPage)
  }

  public sortData(sort, data){
    if(sort){
      switch (sort) {
        case 'Newest':
          data = data.sort((a, b)=> {return <any>new Date(b.published) - <any>new Date(a.published)});           
          break;
        case 'Oldest':
          data = data.sort((a, b)=> {return <any>new Date(a.published) - <any>new Date(b.published)});           
          break;
        case 'Popular':
          data = data.sort((a, b) => { 
            if(a.ratingsValue/a.ratingsCount < b.ratingsValue/b.ratingsCount){
              return 1;
            }
            if(a.ratingsValue/a.ratingsCount > b.ratingsValue/b.ratingsCount){
              return -1;
            }
            return 0; 
          });
          break;
        case 'Price (Low to High)':
          if(this.appSettings.settings.currency == 'USD'){
            data = data.sort((a,b) => {
              if((a.priceDollar.sale || a.priceDollar.rent) > (b.priceDollar.sale || b.priceDollar.rent)){
                return 1;
              }
              if((a.priceDollar.sale || a.priceDollar.rent) < (b.priceDollar.sale || b.priceDollar.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          if(this.appSettings.settings.currency == 'EUR'){
            data = data.sort((a,b) => {
              if((a.priceEuro.sale || a.priceEuro.rent) > (b.priceEuro.sale || b.v.rent)){
                return 1;
              }
              if((a.priceEuro.sale || a.priceEuro.rent) < (b.priceEuro.sale || b.priceEuro.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          break;
        case 'Price (High to Low)':
          if(this.appSettings.settings.currency == 'USD'){
            data = data.sort((a,b) => {
              if((a.priceDollar.sale || a.priceDollar.rent) < (b.priceDollar.sale || b.priceDollar.rent)){
                return 1;
              }
              if((a.priceDollar.sale || a.priceDollar.rent) > (b.priceDollar.sale || b.priceDollar.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          if(this.appSettings.settings.currency == 'EUR'){
            data = data.sort((a,b) => {
              if((a.priceEuro.sale || a.priceEuro.rent) < (b.priceEuro.sale || b.v.rent)){
                return 1;
              }
              if((a.priceEuro.sale || a.priceEuro.rent) > (b.priceEuro.sale || b.priceEuro.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          break;
        default:
          break;
      }
    }
    return data;
  }

  public paginator(items, page?, perPage?) { 
    var page = page || 1,
    perPage = perPage || 4,
    offset = (page - 1) * perPage,   
    paginatedItems = items.slice(offset).slice(0, perPage),
    totalPages = Math.ceil(items.length / perPage);
    return {
      data: paginatedItems,
      pagination:{
        page: page,
        perPage: perPage,
        prePage: page - 1 ? page - 1 : null,
        nextPage: (totalPages > page) ? page + 1 : null,
        total: items.length,
        totalPages: totalPages,
      }
    };
  }



  public getTestimonials(){
    return [
        { 
            text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.', 
            author: 'Mr. Adam Sandler', 
            position: 'General Director', 
            image: 'assets/images/profile/adam.jpg' 
        },
        { 
            text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.', 
            author: 'Ashley Ahlberg', 
            position: 'Housewife', 
            image: 'assets/images/profile/ashley.jpg' 
        },
        { 
            text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.', 
            author: 'Bruno Vespa', 
            position: 'Blogger', 
            image: 'assets/images/profile/bruno.jpg' 
        },
        { 
            text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.', 
            author: 'Mrs. Julia Aniston', 
            position: 'Marketing Manager', 
            image: 'assets/images/profile/julia.jpg' 
        }
    ];
  }

  public getAgents(){
  let  agent= [        
    { 
        id: 1,
        fullName: 'Jesse Bajnauth',
        organization: 'Dedicated Real Estate Services.',
        email: 'support@residencecrm.com',
        phone: '(224) 267-1346',
        social: {
          facebook: 'lusia',
          twitter: 'lusia',
          linkedin: 'lusia',
          instagram: 'lusia',
          website: 'https://lusia.manuel.com'
        },
        ratingsCount: 6,
        ratingsValue: 480,
        image: 'assets/images/agents/a-1.png' 
    },
    { 
        id: 2,
        fullName: 'Amanda Youseek',
        organization:'Demiurgic Management.',
        email: 'support@residencecrm.com',
        phone: '(212) 457-2308',
        social: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          website: 'https://andy.warhol.com'
        },
        ratingsCount: 4,
        ratingsValue: 400,
        image: 'assets/images/agents/a-2.jpg' 
    },        
    { 
        id: 3,
        fullName: 'Marissa Davis',
        organization: 'Xippi Properties',
        email: 'support@residencecrm.com',
        phone: '(214) 617-2614',
        social: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          website: 'https://tereza.stiles.com'
        },
        ratingsCount: 4,
        ratingsValue: 380,
        image: 'assets/images/agents/a-3.png' 
    },
    { 
      id: 4,
      fullName: 'Jillian Smith',
                  
      organization: 'Property Consultancy Management',
      email: 'support@residencecrm.com',
      phone: '(267) 388-1637',
      social: {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
        website: 'https://michael.blair.com'
      },
      ratingsCount: 6,
      ratingsValue: 480,
      image: 'assets/images/agents/a-4.jpg'  
    },
    { 
        id: 5,
        fullName: 'Arnella Gomez',
        //desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
        organization: 'Arnella Gomez Real Estate ',
        email: 'support@residencecrm.com',
        phone: '(267) 388-1637',
        social: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          website: 'https://michelle.ormond.com'
        },
        ratingsCount: 6,
        ratingsValue: 480, 
        image: 'assets/images/agents/a-5.jpg' 
    },
    { 
      id: 6,
      fullName: 'Pierre Mclean',
      //desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
      organization: 'GDP Investors',
      email: 'support@residencecrm.com',
      phone: '(267) 388-1637',
      social: {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
        website: 'https://michelle.ormond.com'
      },
      ratingsCount: 6,
      ratingsValue: 480, 
      image: 'assets/images/agents/a-6.jpg' 
  },
  { 
    id: 7,
    fullName: 'Stacy Moonilal',
    //desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
    organization: "Stacy's Real Estate ",
    email: 'support@residencecrm.com',
    phone: '(267) 388-1637',
    social: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      website: 'https://michelle.ormond.com'
    },
    ratingsCount: 6,
    ratingsValue: 480, 
    image: 'assets/images/agents/a-7.jpg' 
},
{ 
  id: 8,
  fullName: 'Aking Enterprise',
  //desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
  organization: "Aking Enterprise",
  email: 'support@residencecrm.com',
  phone: '(267) 388-1637',
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    website: 'https://michelle.ormond.com'
  },
  ratingsCount: 6,
  ratingsValue: 480, 
  image: 'assets/images/agents/a-8.png' 
},

{ 
  id: 9,
  fullName: 'Whittaker & Biggs',
  //desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
  organization: "47-49 Derby Street, Leek",
  email: 'support@residencecrm.com',
  phone: '01538 269070',
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    website: 'https://michelle.ormond.com'
  },
  ratingsCount: 6,
  ratingsValue: 480, 
  image: 'assets/images/agents/a-9.jpg' 
},
{ 
  id: 10,
  fullName: 'Savills - Knutsford',
  //desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
  organization: "35/37 Princess Street, Knutsford",
  email: 'support@residencecrm.com',
  phone: '01565 358949',
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    website: 'https://michelle.ormond.com'
  },
  ratingsCount: 6,
  ratingsValue: 480, 
  image: 'assets/images/agents/a-10.png' 
},
{ 
  id: 11,
  fullName: 'Peter E Gilkes and Company',
  //desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
  organization: "44 Market Street, Chorley",
  email: 'support@residencecrm.com',
  phone: '01257 429149',
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    website: 'https://michelle.ormond.com'
  },
  ratingsCount: 6,
  ratingsValue: 480, 
  image: 'assets/images/agents/a-11.jpeg' 
},
{ 
  id: 12,
  fullName: 'Strutt & Parker - Harrogate',
  //desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
  organization: "Princes House, 13 Princes Square, Harrogate",
  email: 'support@residencecrm.com',
  phone: '01423 578931',
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    website: 'https://michelle.ormond.com'
  },
  ratingsCount: 6,
  ratingsValue: 480, 
  image: 'assets/images/agents/a-12.jpeg' 
},
{ 
  id: 13,
  fullName: 'Residential Estates',
  //desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
  organization: "Maple House, 23 Watergate Row, Chester",
  email: 'support@residencecrm.com',
  phone: '01244 725541',
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    website: 'https://michelle.ormond.com'
  },
  ratingsCount: 6,
  ratingsValue: 480, 
  image: 'assets/images/agents/a-14.jpeg' 
},
{ 
  id: 14,
  fullName: 'Briscombe Nutter & Staff',
  //desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
  organization: "9 Barton Road, Worsley",
  email: 'support@residencecrm.com',
  phone: '0161 300 0200',
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    website: 'https://michelle.ormond.com'
  },
  ratingsCount: 6,
  ratingsValue: 480, 
  image: 'assets/images/agents/a-13.png' 
},
{ 
  id: 14,
  fullName: 'Anson Humphrey',
  //desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
  organization: "Circular Realty Investments",
  email: 'support@residencecrm.com',
  phone: '0161 300 0200',
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    website: 'https://michelle.ormond.com'
  },
  ratingsCount: 6,
  ratingsValue: 480, 
  image: 'assets/images/agents/a-15.jpg' 
},
{ 
  id: 14,
  fullName: 'Kerron Brown',
  //desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
  organization: "GenX Realty",
  email: 'support@residencecrm.com',
  phone: '0161 300 0200',
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    website: 'https://michelle.ormond.com'
  },
  ratingsCount: 6,
  ratingsValue: 480, 
  image: 'assets/images/agents/a-2.png' 
},
];

    return agent;
    
  }

  public getrelatedproperty(queryString:string=""){
   
      
     let res= this.http.get(environment.apiurl+"apigetproperties/?"+queryString)
    
     return res;

    
  
  //  return [
  //     {
  //         "id": 1,
  //         "title": "Modern and quirky flat", 
  //         "desc": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //         "propertyType": "Apartment",
  //         "propertyStatus": ["For Sale"],
  //         "city": "New York",
  //         "zipCode": "10033",
  //         "neighborhood": ["Astoria", "Midtown"],
  //         "street": ["Astoria Street #1", "Midtown Street #2"],
  //         "location" : {
  //             "lat": 40.849150,
  //             "lng": -73.935100
  //         },
  //         "formattedAddress" : "611 W 180th St, New York, NY 10033, USA",
  //         "features": ["Air Conditioning", "Barbeque", "Dryer", "Microwave", "Refrigerator", "Fireplace", "Swimming Pool", "TV Cable", "WiFi"],
  //         "featured": false, 
  //         "priceDollar": {
  //             "sale": 1300000,
  //             "rent": null
  //         },
  //         "priceEuro": {
  //             "sale": 1160000,
  //             "rent": null
  //         },
  //         "bedrooms": 2,
  //         "bathrooms": 2,
  //         "garages": 1,
  //         "area": {
  //             "value": 2380,
  //             "unit": "ft²"
  //         },
  //         "yearBuilt": 2007,
  //         "ratingsCount": 3,
  //         "ratingsValue": 280,
  //         "additionalFeatures": [                
  //             {
  //                 "name": "Heat",
  //                 "value": "Natural Gas"
  //             },
  //             {
  //                 "name": "Roof",
  //                 "value": "Composition/Shingle"
  //             },
  //             {
  //                 "name": "Floors",
  //                 "value": "Wall-to-Wall Carpet"
  //             },
  //             {
  //                 "name": "Water",
  //                 "value": "District/Public"
  //             },
  //             {
  //                 "name": "Cross Streets",
  //                 "value": "Orangethorpe-Gilbert"
  //             },
  //             {
  //                 "name": "Windows",
  //                 "value": "Skylights"
  //             },
  //             {
  //                 "name": "Flat",
  //                 "value": "5"
  //             },
  //             {
  //                 "name": "Childroom",
  //                 "value": "2"
  //             }
  //         ],
  //         "gallery": [         
  //             {
  //                 "small": "assets/images/props/flat-1/1-small.jpg",
  //                 "medium": "assets/images/props/flat-1/1-medium.jpg",
  //                 "big": "assets/images/props/flat-1/1-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/flat-1/2-small.jpg",
  //                 "medium": "assets/images/props/flat-1/2-medium.jpg",
  //                 "big": "assets/images/props/flat-1/2-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/flat-1/3-small.jpg",
  //                 "medium": "assets/images/props/flat-1/3-medium.jpg",
  //                 "big": "assets/images/props/flat-1/3-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/flat-1/4-small.jpg",
  //                 "medium": "assets/images/props/flat-1/4-medium.jpg",
  //                 "big": "assets/images/props/flat-1/4-big.jpg"
  //             }
  //         ],
  //         "plans": [
  //             {
  //                 "name": "First floor",
  //                 "desc": "Plan description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //                 "area": {
  //                     "value": 1180,
  //                     "unit": "ft²"
  //                 },
  //                 "rooms": 3,
  //                 "baths": 1,
  //                 "image": "assets/images/others/plan-1.jpg"
  //             },
  //             {
  //                 "name": "Second floor",
  //                 "desc": "Plan description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //                 "area": {
  //                     "value": 1200,
  //                     "unit": "ft²"
  //                 },
  //                 "rooms": 5,
  //                 "baths": 2,
  //                 "image": "assets/images/others/plan-2.jpg"
  //             }
  //         ],
  //         "videos": [
  //             {
  //                 "name": "Video with 'mat-video' plugin",
  //                 "link": "http://themeseason.com/data/videos/video-1.mp4"
  //             },
  //             {
  //                 "name": "Video with 'ngx-embed-video' plugin",
  //                 "link": "https://www.youtube.com/watch?v=-NInBEdSvp8"
  //             }
  //         ],
  //         "published": "2012-08-12 17:17:30",
  //         "lastUpdate": "2019-05-20 14:20:00",
  //         "views": 322
  //     },
  //     {
  //         "id": 3,
  //         "title": "Comfortable family house", 
  //         "desc": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //         "propertyType": "House",
  //         "propertyStatus": ["For Sale", "Open House"],
  //         "city": "Seattle",
  //         "zipCode": "98104",
  //         "neighborhood": ["Belltown"],
  //         "street": ["Belltown Street #1", "Belltown Street #2"],
  //         "location" : {
  //             "lat": 47.602760,
  //             "lng": -122.331440
  //         },
  //         "formattedAddress" : "3rd Ave & James St, Seattle, WA 98104, USA", 
  //         "features": ["Air Conditioning", "Barbeque", "Dryer", "Microwave", "Gym", "Fireplace", "Sauna", "TV Cable", "WiFi"],
  //         "featured": false, 
  //         "priceDollar": {
  //             "sale": 2550000,
  //             "rent": null
  //         },
  //         "priceEuro": {
  //             "sale": 2280000,
  //             "rent": null
  //         },
  //         "bedrooms": 3,
  //         "bathrooms": 1,
  //         "garages": 1,
  //         "area": {
  //             "value": 2100,
  //             "unit": "ft²"
  //         },
  //         "yearBuilt": 2010,
  //         "ratingsCount": 7,
  //         "ratingsValue": 560,
  //         "additionalFeatures": [                
  //             {
  //                 "name": "Heat",
  //                 "value": "Natural Gas"
  //             },
  //             {
  //                 "name": "Roof",
  //                 "value": "Composition/Shingle"
  //             },
  //             {
  //                 "name": "Floors",
  //                 "value": "Wall-to-Wall Carpet"
  //             },
  //             {
  //                 "name": "Water",
  //                 "value": "District/Public"
  //             },
  //             {
  //                 "name": "Cross Streets",
  //                 "value": "Orangethorpe-Gilbert"
  //             },
  //             {
  //                 "name": "Windows",
  //                 "value": "Skylights"
  //             },
  //             {
  //                 "name": "Flat",
  //                 "value": "5"
  //             },
  //             {
  //                 "name": "Childroom",
  //                 "value": "2"
  //             }
  //         ],
  //         "gallery": [            
  //             {
  //                 "small": "assets/images/props/house-1/1-small.jpg",
  //                 "medium": "assets/images/props/house-1/1-medium.jpg",
  //                 "big": "assets/images/props/house-1/1-big.jpg"
  //             },         
  //             {
  //                 "small": "assets/images/props/house-1/2-small.jpg",
  //                 "medium": "assets/images/props/house-1/2-medium.jpg",
  //                 "big": "assets/images/props/house-1/2-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/house-1/3-small.jpg",
  //                 "medium": "assets/images/props/house-1/3-medium.jpg",
  //                 "big": "assets/images/props/house-1/3-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/house-1/4-small.jpg",
  //                 "medium": "assets/images/props/house-1/4-medium.jpg",
  //                 "big": "assets/images/props/house-1/4-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/house-1/5-small.jpg",
  //                 "medium": "assets/images/props/house-1/5-medium.jpg",
  //                 "big": "assets/images/props/house-1/5-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/house-1/6-small.jpg",
  //                 "medium": "assets/images/props/house-1/6-medium.jpg",
  //                 "big": "assets/images/props/house-1/6-big.jpg"
  //             }
  //         ],
  //         "plans": [
  //             {
  //                 "name": "First floor",
  //                 "desc": "Plan description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //                 "area": {
  //                     "value": 1180,
  //                     "unit": "ft²"
  //                 },
  //                 "rooms": 3,
  //                 "baths": 1,
  //                 "image": "assets/images/others/plan-1.jpg"
  //             },
  //             {
  //                 "name": "Second floor",
  //                 "desc": "Plan description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //                 "area": {
  //                     "value": 1200,
  //                     "unit": "ft²"
  //                 },
  //                 "rooms": 5,
  //                 "baths": 2,
  //                 "image": "assets/images/others/plan-2.jpg"
  //             }
  //         ],
  //         "videos": [
  //             {
  //                 "name": "Video with 'mat-video' plugin",
  //                 "link": "http://themeseason.com/data/videos/video-1.mp4"
  //             },
  //             {
  //                 "name": "Video with 'ngx-embed-video' plugin",
  //                 "link": "https://www.youtube.com/watch?v=-NInBEdSvp8"
  //             }
  //         ],
  //         "published": "2011-05-12 18:20:00",
  //         "lastUpdate": "2019-06-18 14:20:00",
  //         "views": 587
  //     },
  //     {
  //         "id": 5,
  //         "title": "House with a pool", 
  //         "desc": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //         "propertyType": "House",
  //         "propertyStatus": ["Sold", "For Sale"],
  //         "city": "Seattle",
  //         "zipCode": "98108",
  //         "neighborhood": ["Queen Anne", "Belltown"],
  //         "street": ["Queen Anne Street #1", "Belltown Street #2"],
  //         "location" : {
  //             "lat": 47.603230,
  //             "lng": -122.330276
  //         },
  //         "formattedAddress": "5921 17th Ave S, Seattle, WA 98108, USA", 
  //         "features": ["Air Conditioning", "Barbeque", "Dryer", "Microwave", "Gym", "Swimming Pool", "Sauna", "TV Cable", "WiFi"],
  //         "featured": true, 
  //         "priceDollar": {
  //             "sale": 4500000,
  //             "rent": null
  //         },
  //         "priceEuro": {
  //             "sale": 4020000,
  //             "rent": null
  //         },
  //         "bedrooms": 1,
  //         "bathrooms": 1,
  //         "garages": 1,
  //         "area": {
  //             "value": 2200,
  //             "unit": "ft²"
  //         },
  //         "yearBuilt": 2007,
  //         "ratingsCount": 6,
  //         "ratingsValue": 480,
  //         "additionalFeatures": [                
  //             {
  //                 "name": "Heat",
  //                 "value": "Natural Gas"
  //             },
  //             {
  //                 "name": "Roof",
  //                 "value": "Composition/Shingle"
  //             },
  //             {
  //                 "name": "Floors",
  //                 "value": "Wall-to-Wall Carpet"
  //             },
  //             {
  //                 "name": "Water",
  //                 "value": "District/Public"
  //             },
  //             {
  //                 "name": "Cross Streets",
  //                 "value": "Orangethorpe-Gilbert"
  //             },
  //             {
  //                 "name": "Windows",
  //                 "value": "Skylights"
  //             },
  //             {
  //                 "name": "Flat",
  //                 "value": "5"
  //             },
  //             {
  //                 "name": "Childroom",
  //                 "value": "2"
  //             }
  //         ],
  //         "gallery": [
  //             {
  //                 "small": "assets/images/props/house-3/1-small.jpg",
  //                 "medium": "assets/images/props/house-3/1-medium.jpg",
  //                 "big": "assets/images/props/house-3/1-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/house-3/2-small.jpg",
  //                 "medium": "assets/images/props/house-3/2-medium.jpg",
  //                 "big": "assets/images/props/house-3/2-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/house-3/3-small.jpg",
  //                 "medium": "assets/images/props/house-3/3-medium.jpg",
  //                 "big": "assets/images/props/house-3/3-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/house-3/4-small.jpg",
  //                 "medium": "assets/images/props/house-3/4-medium.jpg",
  //                 "big": "assets/images/props/house-3/4-big.jpg"
  //             }
  //         ],
  //         "plans": [
  //             {
  //                 "name": "First floor",
  //                 "desc": "Plan description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //                 "area": {
  //                     "value": 1180,
  //                     "unit": "ft²"
  //                 },
  //                 "rooms": 3,
  //                 "baths": 1,
  //                 "image": "assets/images/others/plan-1.jpg"
  //             },
  //             {
  //                 "name": "Second floor",
  //                 "desc": "Plan description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //                 "area": {
  //                     "value": 1200,
  //                     "unit": "ft²"
  //                 },
  //                 "rooms": 5,
  //                 "baths": 2,
  //                 "image": "assets/images/others/plan-2.jpg"
  //             }
  //         ],
  //         "videos": [
  //             {
  //                 "name": "Video with 'mat-video' plugin",
  //                 "link": "http://themeseason.com/data/videos/video-1.mp4"
  //             },
  //             {
  //                 "name": "Video with 'ngx-embed-video' plugin",
  //                 "link": "https://www.youtube.com/watch?v=-NInBEdSvp8"
  //             }
  //         ],
  //         "published": "2017-11-20 10:20:00",
  //         "lastUpdate": "2019-04-14 14:20:00",
  //         "views": 633
  //     },
  //     {
  //         "id": 7,
  //         "title": "Luxury office space", 
  //         "desc": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //         "propertyType": "Office",
  //         "propertyStatus": ["For Sale", "Hot Offer"],
  //         "city": "New York",
  //         "zipCode": "10019",
  //         "neighborhood": ["Englewood", "Austin"],
  //         "street": ["Englewood Street #2", "Austin Street #2"],
  //         "location" : {
  //             "lat": 40.716761,
  //             "lng": -73.999958
  //         },
  //         "formattedAddress": "230 W 55th St, New York, NY 10019, USA", 
  //         "features": ["Air Conditioning", "Barbeque", "Dryer", "Microwave", "Gym", "Swimming Pool", "Sauna", "TV Cable", "WiFi"],
  //         "featured": false, 
  //         "priceDollar": {
  //             "sale": 2500000,
  //             "rent": null
  //         },
  //         "priceEuro": {
  //             "sale": 2200000,
  //             "rent": null
  //         },
  //         "bedrooms": 2,
  //         "bathrooms": 2,
  //         "garages": 1,
  //         "area": {
  //             "value": 3200,
  //             "unit": "ft²"
  //         },
  //         "yearBuilt": 2017,
  //         "ratingsCount": 7,
  //         "ratingsValue": 700,
  //         "additionalFeatures": [                
  //             {
  //                 "name": "Heat",
  //                 "value": "Natural Gas"
  //             },
  //             {
  //                 "name": "Roof",
  //                 "value": "Composition/Shingle"
  //             },
  //             {
  //                 "name": "Floors",
  //                 "value": "Wall-to-Wall Carpet"
  //             },
  //             {
  //                 "name": "Water",
  //                 "value": "District/Public"
  //             },
  //             {
  //                 "name": "Cross Streets",
  //                 "value": "Orangethorpe-Gilbert"
  //             },
  //             {
  //                 "name": "Windows",
  //                 "value": "Skylights"
  //             },
  //             {
  //                 "name": "Flat",
  //                 "value": "5"
  //             },
  //             {
  //                 "name": "Childroom",
  //                 "value": "2"
  //             }
  //         ],
  //         "gallery": [
  //             {
  //                 "small": "assets/images/props/office-2/1-small.jpg",
  //                 "medium": "assets/images/props/office-2/1-medium.jpg",
  //                 "big": "assets/images/props/office-2/1-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/office-2/2-small.jpg",
  //                 "medium": "assets/images/props/office-2/2-medium.jpg",
  //                 "big": "assets/images/props/office-2/2-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/office-2/3-small.jpg",
  //                 "medium": "assets/images/props/office-2/3-medium.jpg",
  //                 "big": "assets/images/props/office-2/3-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/office-2/4-small.jpg",
  //                 "medium": "assets/images/props/office-2/4-medium.jpg",
  //                 "big": "assets/images/props/office-2/4-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/office-2/5-small.jpg",
  //                 "medium": "assets/images/props/office-2/5-medium.jpg",
  //                 "big": "assets/images/props/office-2/5-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/office-2/6-small.jpg",
  //                 "medium": "assets/images/props/office-2/6-medium.jpg",
  //                 "big": "assets/images/props/office-2/6-big.jpg"
  //             }
  //         ],
  //         "plans": [
  //             {
  //                 "name": "First floor",
  //                 "desc": "Plan description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //                 "area": {
  //                     "value": 1180,
  //                     "unit": "ft²"
  //                 },
  //                 "rooms": 3,
  //                 "baths": 1,
  //                 "image": "assets/images/others/plan-1.jpg"
  //             },
  //             {
  //                 "name": "Second floor",
  //                 "desc": "Plan description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //                 "area": {
  //                     "value": 1200,
  //                     "unit": "ft²"
  //                 },
  //                 "rooms": 5,
  //                 "baths": 2,
  //                 "image": "assets/images/others/plan-2.jpg"
  //             }
  //         ],
  //         "videos": [
  //             {
  //                 "name": "Video with 'mat-video' plugin",
  //                 "link": "http://themeseason.com/data/videos/video-1.mp4"
  //             },
  //             {
  //                 "name": "Video with 'ngx-embed-video' plugin",
  //                 "link": "https://www.youtube.com/watch?v=-NInBEdSvp8"
  //             }
  //         ],
  //         "published": "2017-08-12 18:20:00",
  //         "lastUpdate": "2019-03-29 14:20:00",
  //         "views": 470
  //     },
  //     {
  //         "id": 8,
  //         "title": "Centrally located apartment", 
  //         "desc": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //         "propertyType": "Apartment",
  //         "propertyStatus": ["For Rent", "No Fees"],
  //         "city": "Los Angeles",
  //         "zipCode": "90028",
  //         "neighborhood": ["Englewood", "Austin"],
  //         "street": ["Englewood Street #2", "Austin Street #2"],
  //         "location" : {
  //             "lat": 34.100570,
  //             "lng": -118.327440
  //         },
  //         "formattedAddress": "1627 Vine St, Los Angeles, CA 90028, USA", 
  //         "features": ["Air Conditioning", "Refrigerator", "Dryer", "Microwave", "Gym", "Swimming Pool", "Sauna", "TV Cable", "WiFi"],
  //         "featured": true, 
  //         "priceDollar": {
  //             "sale": null,
  //             "rent": 5600
  //         },
  //         "priceEuro": {
  //             "sale": null,
  //             "rent": 5000
  //         },
  //         "bedrooms": 2,
  //         "bathrooms": 2,
  //         "garages": 1,
  //         "area": {
  //             "value": 1600,
  //             "unit": "ft²"
  //         },
  //         "yearBuilt": 2017,
  //         "ratingsCount": 4,
  //         "ratingsValue": 380,
  //         "additionalFeatures": [                
  //             {
  //                 "name": "Heat",
  //                 "value": "Natural Gas"
  //             },
  //             {
  //                 "name": "Roof",
  //                 "value": "Composition/Shingle"
  //             },
  //             {
  //                 "name": "Floors",
  //                 "value": "Wall-to-Wall Carpet"
  //             },
  //             {
  //                 "name": "Water",
  //                 "value": "District/Public"
  //             },
  //             {
  //                 "name": "Cross Streets",
  //                 "value": "Orangethorpe-Gilbert"
  //             },
  //             {
  //                 "name": "Windows",
  //                 "value": "Skylights"
  //             },
  //             {
  //                 "name": "Flat",
  //                 "value": "5"
  //             },
  //             {
  //                 "name": "Childroom",
  //                 "value": "2"
  //             }
  //         ],
  //         "gallery": [
  //             {
  //                 "small": "assets/images/props/apartment/1-small.jpg",
  //                 "medium": "assets/images/props/apartment/1-medium.jpg",
  //                 "big": "assets/images/props/apartment/1-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/apartment/2-small.jpg",
  //                 "medium": "assets/images/props/apartment/2-medium.jpg",
  //                 "big": "assets/images/props/apartment/2-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/apartment/3-small.jpg",
  //                 "medium": "assets/images/props/apartment/3-medium.jpg",
  //                 "big": "assets/images/props/apartment/3-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/apartment/4-small.jpg",
  //                 "medium": "assets/images/props/apartment/4-medium.jpg",
  //                 "big": "assets/images/props/apartment/4-big.jpg"
  //             },
  //             {
  //                 "small": "assets/images/props/apartment/5-small.jpg",
  //                 "medium": "assets/images/props/apartment/5-medium.jpg",
  //                 "big": "assets/images/props/apartment/5-big.jpg"
  //             }
  //         ],
  //         "plans": [
  //             {
  //                 "name": "First floor",
  //                 "desc": "Plan description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //                 "area": {
  //                     "value": 1180,
  //                     "unit": "ft²"
  //                 },
  //                 "rooms": 3,
  //                 "baths": 1,
  //                 "image": "assets/images/others/plan-1.jpg"
  //             },
  //             {
  //                 "name": "Second floor",
  //                 "desc": "Plan description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
  //                 "area": {
  //                     "value": 1200,
  //                     "unit": "ft²"
  //                 },
  //                 "rooms": 5,
  //                 "baths": 2,
  //                 "image": "assets/images/others/plan-2.jpg"
  //             }
  //         ],
  //         "videos": [
  //             {
  //                 "name": "Video with 'mat-video' plugin",
  //                 "link": "http://themeseason.com/data/videos/video-1.mp4"
  //             },
  //             {
  //                 "name": "Video with 'ngx-embed-video' plugin",
  //                 "link": "https://www.youtube.com/watch?v=-NInBEdSvp8"
  //             }
  //         ],
  //         "published": "2016-03-29 05:20:00",
  //         "lastUpdate": "2019-06-26 14:20:00",
  //         "views": 852
  //     }    
  // ]
  }


  public getClients(){

    this.apiserivce.get("apigetagents").subscribe((res:any)=>{
      let clients=[];

      res.data.forEach(item =>{
        clients.push( { name: item.name, image: `${environment.crmurl}${item.image} ` },)
      })
      return clients;
    })
    // return [  
    //     { name: 'aloha', image: 'assets/images/clients/aloha.png' },
    //     { name: 'dream', image: 'assets/images/clients/dream.png' },  
    //     { name: 'congrats', image: 'assets/images/clients/congrats.jpeg' },
    //     { name: 'best', image: 'assets/images/clients/best.png' },
    //     { name: 'original', image: 'assets/images/clients/original.jpeg' },
    //     { name: 'retro', image: 'assets/images/clients/retro.png' },
    //     { name: 'king', image: 'assets/images/clients/king.png' },
    //     { name: 'love', image: 'assets/images/clients/love.png' },
    //     { name: 'the', image: 'assets/images/clients/the.png' },
    //     { name: 'easter', image: 'assets/images/clients/easter.png' },
    //     { name: 'with', image: 'assets/images/clients/with.png' },
    //     { name: 'special', image: 'assets/images/clients/special.png' },
    //     { name: 'bravo', image: 'assets/images/clients/bravo.png' }
    // ];
  }


}
