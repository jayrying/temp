import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { AppService } from 'src/app/app.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-our-agents',
  templateUrl: './our-agents.component.html',
  styleUrls: ['./our-agents.component.scss']
})
export class OurAgentsComponent implements OnInit {
  public agents;
  public config: SwiperConfigInterface = { };
  constructor(public appService:AppService,public apiservice:ApiService) { }

  ngOnInit() {
    this.agents = this.appService.getAgents();
    //this.getukagent();
  }

  ngAfterViewInit(){
    this.config = {
      observer: true,
      slidesPerView: 4,
      spaceBetween: 16,       
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,        
      loop: false,
      preloadImages: false,
      lazy: true,  
      breakpoints: {
        600: {
          slidesPerView: 1,
        },
        960: {
          slidesPerView: 2,
        },
        1280: {
          slidesPerView: 3,
        }
      }
    }
  }
  getukagent(){
    this.apiservice
    .externalApi("https://api.zoopla.co.uk/api/v1/property_listings.js?radius=40&area=bahamas&&output_type=outcode&api_key=6c4qn9zh4kd8yd8c9rngqr9a")
    .subscribe((res:any)=>{
      console.log("resooo",res)
     
  res.listing.forEach(item =>{
  
    this.agents.push({
     
      id: item.listing_id,
      fullName: item.agent_name,
      organization: item.agent_address,
      email: 'support@residencecrm.com',
      phone: item.agent_phone,
      social: {
        facebook: 'lusia',
        twitter: 'lusia',
        linkedin: 'lusia',
        instagram: 'lusia',
        website: 'https://lusia.manuel.com'
      },
      ratingsCount: 6,
      ratingsValue: 480,
      image:item.agent_logo 
  })
  })
  
  
    })
  }
}






// import { Component, OnInit } from '@angular/core';
// import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
// import { AppService } from 'src/app/app.service';
// import { environment } from 'src/environments/environment';
// import { ApiService } from 'src/app/services/api.service';

// @Component({
//   selector: 'app-our-agents',
//   templateUrl: './our-agents.component.html',
//   styleUrls: ['./our-agents.component.scss']
// })
// export class OurAgentsComponent implements OnInit {
//   public agents=[];
//   public config: SwiperConfigInterface = { };
//   constructor(public appService:AppService,public apiservice:ApiService) { }

//   ngOnInit() {
//    //this.getAgents();
//   this.agents = this.appService.getAgents();
//   }
//   getAgents(){
 
//     this.apiservice.get("apigetagents").subscribe((res:any)=>{
//       console.log(res)
//       res.data.forEach(item =>{
//         this.agents.push( { 
//           id: item.id,
//           fullName: item.name,
//           desc: item.description,            
//           organization: item.comanyName,
//           email: item.primaryEmail,
//           phone: item.phone,
//           social: {
            
//             skype: item.skype,
//             whatsapp: item.whatsapp,
//             website: item.website
//           },
//           ratingsCount: 6,
//           ratingsValue: 480,
//           image:`${environment.crmurl}${item.image} `
//       },)
//       })
//     })
  
//   }

//   ngAfterViewInit(){
//     this.config = {
//       observer: true,
//       slidesPerView: 4,
//       spaceBetween: 16,       
//       keyboard: true,
//       navigation: true,
//       pagination: false,
//       grabCursor: true,        
//       loop: false,
//       preloadImages: false,
//       lazy: true,  
//       breakpoints: {
//         600: {
//           slidesPerView: 1,
//         },
//         960: {
//           slidesPerView: 2,
//         },
//         1280: {
//           slidesPerView: 3,
//         }
//       }
//     }
//   }

// }
