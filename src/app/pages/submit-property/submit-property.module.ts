import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';  
import { InputFileModule } from 'ngx-input-file';
import { SubmitPropertyComponent } from './submit-property.component';

export const routes = [
  { path: '', component: SubmitPropertyComponent, pathMatch: 'full'  }
];

@NgModule({
  declarations: [SubmitPropertyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgmCoreModule, 
    InputFileModule
  ]
})
export class SubmitPropertyModule { }
