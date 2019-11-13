import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-our-agents',
  templateUrl: './our-agents.component.html',
  styleUrls: ['./our-agents.component.scss']
})
export class OurAgentsComponent implements OnInit {
  public agents;
  public config: SwiperConfigInterface = { };
  constructor(public appService:AppService) { }

  ngOnInit() {
    this.agents = this.appService.getAgents();
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
