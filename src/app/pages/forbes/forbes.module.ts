import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ForbesComponent } from './forbes.component';

export const routes = [
  { path: '', component: ForbesComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    ForbesComponent  
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule 
  ]
})
export class ForbesModule { }
