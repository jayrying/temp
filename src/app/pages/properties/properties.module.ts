import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core'; 
import { MatVideoModule } from 'mat-video';
import { SharedModule } from '../../shared/shared.module';
import { PropertiesComponent } from './properties.component';
import { PropertyComponent } from './property/property.component';
import { FormsModule } from '@angular/forms';

export const routes = [
  { path: '', component: PropertiesComponent, pathMatch: 'full' },
  { path: ':QueryString', component: PropertiesComponent },
  { path: 'property/:id', component: PropertyComponent }
];

@NgModule({
  declarations: [
    PropertiesComponent, 
    PropertyComponent
  ],
  exports: [
    PropertiesComponent, 
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgmCoreModule, 
    MatVideoModule,
    SharedModule,
    FormsModule
  ]
})
export class PropertiesModule { }
