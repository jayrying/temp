import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LuxuryTravelComponent } from './luxurytravel.component';

export const routes = [
  { path: '', component: LuxuryTravelComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    LuxuryTravelComponent  
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule 
  ]
})
export class LuxuryTravelModule { }
