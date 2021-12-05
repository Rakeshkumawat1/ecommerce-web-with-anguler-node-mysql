import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import {ProductModelServer, ServerResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})




export class HomeComponent implements OnInit {

  products: ProductModelServer[] = [];

  
  constructor(private productService: ProductService,
    private cartService: CartService,
    private router: Router) { }
  
 
  ngOnInit(): void {
    this.productService.getAllProducts().subscribe( ( prods: ServerResponse) => {
      //console.log(prods);
      this.products = prods.products;

     // this.productService.getAllProducts().subscribe((prods:{count: Number, products: any[]})=> {});
      // this.products = prods.products;
       //console.log(this.products);
    });
  }

selectProduct(id: number){
  this.router.navigate(['/product', id]).then();
}

AddToCart(id: number){ 
  this.cartService.AddProductToCart(id);

}
  

}