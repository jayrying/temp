import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { AppService } from 'src/app/app.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  public clients=[];
  public config: SwiperConfigInterface = { };
  constructor(public appService:AppService,public apiserivce:ApiService) { }

  ngOnInit() {
    this.getClients();
  }

  getClients(){
    
    this.apiserivce.get("apigetagents").subscribe((res:any)=>{
    

      res.data.forEach(item =>{
        this.clients.push( { name: item.name, image: `${environment.crmurl}${item.image} ` },)
      })
     
    })
  }
  ngAfterViewInit(){
    this.config = {
      observer: true,
      slidesPerView: 7,
      spaceBetween: 16,       
      keyboard: true,
      navigation: false,
      pagination: false,
      grabCursor: true,        
      loop: false,
      preloadImages: false,
      lazy: true,  
      autoplay: {
        delay: 6000,
        disableOnInteraction: false
      },
      speed: 500,
      effect: "slide",
      breakpoints: {
        320: {
          slidesPerView: 1
        },
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        },
        960: {
          slidesPerView: 4,
        },
        1280: {
          slidesPerView: 5,
        },
        1500: {
          slidesPerView: 6,
        }
      }
    }
  }

}