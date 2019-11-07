import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-yearly',
  templateUrl: './yearly.component.html'
})
export class YearlyComponent implements OnInit {
  public items = [
    { name: 'free', price: 0, desc: 'Simplest package to get you started', properties: '10', agentProfiles: '1', agencyProfiles: '0', featuredProperties: '0' },
    { name: 'basic', price: 569, desc: 'The most popular package we offer', properties: '100', agentProfiles: '3', agencyProfiles: '1', featuredProperties: '0' },
    { name: 'premium', price: 929, desc: 'The perfect package for your small business', properties: '250', agentProfiles: '10', agencyProfiles: '5', featuredProperties: '50' },
    { name: 'professional', price: 1899, desc: 'Our most advanced & complete package', properties: 'Unlimited', agentProfiles: 'Unlimited', agencyProfiles: 'Unlimited', featuredProperties: 'Unlimited' }
  ]
  constructor() { }

  ngOnInit() {
  }

}
