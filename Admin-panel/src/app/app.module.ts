import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { AllProductsComponent } from './component/all-products/all-products.component';
import { MainContentComponent } from './component/main-content/main-content.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { AddCategoryComponent } from './component/add-category/add-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddProductComponent } from './component/add-product/add-product.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AllProductsComponent,
    MainContentComponent,
    SidebarComponent,
    AddCategoryComponent,
    AddProductComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
