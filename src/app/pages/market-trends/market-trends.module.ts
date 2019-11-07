import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketTrendsComponent } from './market-trends.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

export const routes = [
  { path: '', component: MarketTrendsComponent, pathMatch: 'full'  }
];

@NgModule({
  declarations: [MarketTrendsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class MarketTrendsModule { }
