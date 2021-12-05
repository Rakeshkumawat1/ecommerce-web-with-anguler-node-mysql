import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCategoryComponent } from './component/add-category/add-category.component';
import { AddProductComponent } from './component/add-product/add-product.component';
import { AllProductsComponent } from './component/all-products/all-products.component';
import { MainContentComponent } from './component/main-content/main-content.component';

const routes: Routes = [
  {
    path: '',
    component: MainContentComponent
  },
  {
    path: 'products/all-products',
    component: AllProductsComponent
  },
  {
    path: 'products/add-new-category',
    component: AddCategoryComponent
  },
  {
    path: 'products/add-new-product',
    component: AddProductComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
