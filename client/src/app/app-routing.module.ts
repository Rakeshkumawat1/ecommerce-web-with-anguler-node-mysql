import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './component/cart/cart.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { ProductComponent } from './component/product/product.component';
import { ProfileComponent } from './component/profile/profile.component';
import { RegisterComponent } from './component/register/register.component';
import { ThankyouComponent } from './component/thankyou/thankyou.component';
import { ProfileGuard } from './guard/profile.guard';

const routes: Routes = [
  {
    path: '' , component: HomeComponent
  },
  {
    path: 'product/:id' , component: ProductComponent
  },
  {
    path: 'cart' , component: CartComponent
  },
  {
    path: 'checkout' , component: CheckoutComponent
  },
  {
    path: 'thankyou' , component: ThankyouComponent
  },
  {
    path: 'login' , component: LoginComponent
  },
  {
    path: 'profile' , component: ProfileComponent, canActivate:[ProfileGuard]
  },
  {
    path: 'register' , component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
