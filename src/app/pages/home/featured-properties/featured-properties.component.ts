import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-featured-properties',
  templateUrl: './featured-properties.component.html',
  styleUrls: ['./featured-properties.component.scss']
})
export class FeaturedPropertiesComponent implements OnInit {
  @Input('properties') featuredProperties;
  constructor() { }

  ngOnInit() {
  }

}
