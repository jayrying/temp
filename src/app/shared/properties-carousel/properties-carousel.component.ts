import { Component, OnInit, Input } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Property } from 'src/app/app.models';

@Component({
  selector: 'app-properties-carousel',
  templateUrl: './properties-carousel.component.html',
  styleUrls: ['./properties-carousel.component.scss']
})
export class PropertiesCarouselComponent implements OnInit {
  @Input('properties') properties: Array<Property> = [];
  propertiesFiltered = [];
  public config: SwiperConfigInterface = {};

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.propertiesFiltered = this.getPropertiesFiltered();
    }, 1000);
  }

  getPropertiesFiltered() {
    return this.properties ? this.properties.map((e) => {
      // console.log('e', e);
      return {
        gallery: e.gallery
      };
    }) : [];
  }

  ngAfterViewInit(){
    this.config = {
      observer: true,
      slidesPerView: 4,
      spaceBetween: 16,       
      keyboard: true,
      navigation: { nextEl: '.prop-next', prevEl: '.prop-prev'},
      pagination: true,
      grabCursor: true,        
      loop: false,
      preloadImages: true,
      lazy: false,    
      breakpoints: {
        600: {
          slidesPerView: 1
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