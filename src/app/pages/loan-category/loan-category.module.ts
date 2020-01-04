import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanCategoryComponent } from './loan-category.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

export const routes = [
  { path: '', component: LoanCategoryComponent, pathMatch: 'full'  }
];

@NgModule({
  declarations: [LoanCategoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class LoanCategoryModule { }
