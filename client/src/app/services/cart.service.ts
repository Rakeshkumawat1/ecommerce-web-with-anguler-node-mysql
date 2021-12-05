import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { ProductModelServer } from '../models/product.model';
import { OrderService } from './order.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private serverURL = environment.SERVER_URL;

  // DATA VARIABLE TO STORE THE CART INFORMATION ON THE CLIENT'S LOCAL STORAGE
  private cartDataClient: CartModelPublic = {
    total:0,
    prodData: [{
      incart:0,
      id:0
    }]
  };

  //Data Variable to Store Cart Information on the Server
  private cartDataServer: CartModelServer = {
    total :0,
    data:[{
      numInCart: 0 ,
      product: undefined!
    }]
  };

  // OBSERVABLES FOR THE COMPONENTS TO SUBSCRIBE
  cartTotal$ = new BehaviorSubject<number> (0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

  constructor(private http:HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private toast: ToastrService,
    private spinner: NgxSpinnerService) { 

       this.cartTotal$.next(this.cartDataServer.total);
       this.cartData$.next(this.cartDataServer);

       // Get the information form local storage (if any)
       let info: CartModelPublic = JSON.parse(localStorage.getItem('cart')!);

       // Check if the info variable is null or has some data in it
       if(info !== null && info !== undefined && info.prodData[0].incart !== 0){
         // Local storage is not empety and has some information
         this.cartDataClient = info;
         // loop through each entry and put it in the cartDataServer object
         this.cartDataClient.prodData.forEach(p =>{
           this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) =>{
             if(this.cartDataServer.data[0].numInCart == 0){
               this.cartDataServer.data[0].numInCart = p.incart;
               this.cartDataServer.data[0].product = actualProductInfo;
               // TODO Create CalculateTotal Function and replace it hear
               this.CalculateTotal();
               this.cartDataClient.total = this.cartDataServer.total;
               localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
             }else{
               //CartDataServer already has some entry in it
               this.cartDataServer.data.push({
                 numInCart: p.incart,
                 product: actualProductInfo
               });
               //TODO Create CalculateTotal Function and replace it here
               this.CalculateTotal();
               this.cartDataClient.total = this.cartDataServer.total;
               localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

             }
             this.cartData$.next({ ... this.cartDataServer});
           });
         });
       }
    }


    AddProductToCart(id: number, quantity?: number){
      this.productService.getSingleProduct(id).subscribe(prod => {
        //1. If the cart is empty
        if(this.cartDataServer.data[0].product == undefined){
          this.cartDataServer.data[0].product = prod;
          this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
          // TODO CALCULATE TOTAL AMOUNT
          this.CalculateTotal();
          this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
          this.cartDataClient.prodData[0].id = prod.id;
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({... this.cartDataServer});
          // TODO Display a tost notification
          this.toast.success(`${prod.name} added to the Cart`, 'Product Added', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
        //2. If the cart has some items
        else{
          let index = this.cartDataServer.data.findIndex(p => p.product.id == prod.id);// -1 or a positive value
          // a. if that item is already in the cart => index is positive value
          if(index !== -1){
            if(quantity !== undefined && quantity <= prod.quantity){
              this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
            }else {
             this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;

            }
            this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            // TODO DISPLAY A TOAST NOTIFICATION
            this.toast.info(`${prod.name} quantity updated in the Cart`, 'Product updated', {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
          }
          else{
            this.cartDataServer.data.push({
              numInCart: 1,
              product: prod
            });
            this.cartDataClient.prodData.push({
              incart: 1,
              id:prod.id
            });
            // localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            // TODO DISPLAY A TOAST NOTIFICATION
            this.toast.success(`${prod.name} added to the Cart`, 'Product Added', {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });

            // TODO CALCULATE TOTAL AMOUNT
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            this.cartData$.next({ ... this.cartDataServer});
          } // END OF ELSE
        }
      });
    }

    UpdateCartItems(index: number, increase: boolean){
      let data = this.cartDataServer.data[index];

      if(increase){
        data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
        this.cartDataClient.prodData[index].incart = data.numInCart;
        // todo calculae total amount
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({ ... this.cartDataServer});
      } else {
        data.numInCart--;

        if(data.numInCart < 1){
          // TODO DELETE THE PRODUCT FOROM CART
          this.DeleteProductFromCart(index);
          this.cartData$.next({ ... this.cartDataServer});
        } else{
          this.cartData$.next({ ... this.cartDataServer});
          this.cartDataClient.prodData[index].incart = data.numInCart;
          // todo calculae total amount
          this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        }
      }
    }

    DeleteProductFromCart(index: number){
      if(window.confirm('Are you sure you want to remove the item?')){
        this.cartDataServer.data.splice(index, 1);
        this.cartDataClient.prodData.splice(index, 1);
        // todo calculate total amount
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;

        if(this.cartDataClient.total == 0){
          this.cartDataClient = {total: 0, prodData: [{ incart: 0, id: 0}]};
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        }else {
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

        }
        if(this.cartDataServer.total == 0){
          this.cartDataServer = {total: 0, data: [{ numInCart: 0, product: undefined!}]};
          this.cartData$.next({ ... this.cartDataServer});
        } else {
          this.cartData$.next({ ... this.cartDataServer});
        }
      }else{
        // if the user clicks the cancel button
        return;
      }
    }


    private CalculateTotal(){
      let Total = 0;

      this.cartDataServer.data.forEach(p =>{
        const {numInCart} = p;
        const {price} = p.product;

        Total += numInCart * price;
      });
      this.cartDataServer.total = Total;
      this.cartTotal$.next(this.cartDataServer.total);
    }

    CheckoutFromCart(userId: number){
      this.http.post(`${this.serverURL}/orders/payment`, null)
        .subscribe((res: {success: boolean } | any ) =>{// any is not 
        if(res.success){
          this.resetServerData();
          this.http.post(`${this.serverURL}/orders/new`, {
            userId: userId,
            products: this.cartDataClient.prodData

          }).subscribe(( data: OrderResponse | any ) => {
            this.orderService.getSingleOrder(data.order_id).then(prods =>{
              if(data.success){
                const navigationExtras: NavigationExtras = {
                  state: {
                    message: data.message,
                    products: prods,
                    orderId: data.order_id,
                    total: this.cartDataClient.total
                  }
                };

                // todo hide spinner
                this.spinner.hide();
                this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                  this.cartDataClient = { total: 0, prodData: [{ incart: 0, id: 0}]};
                  this.cartTotal$.next(0);
                  localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                });
              }

            });
          })
        } else {
          this.spinner.hide();
          this.router.navigateByUrl('/checkout').then();
          this.toast.error(`Sorry, failed to book the order`, 'Order Status', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
      });
    }

    private resetServerData(){
      this.cartDataServer = {
        total: 0,
        data: [{
          numInCart: 0,
          product: undefined!
        }]
      };
      this.cartData$.next({ ... this.cartDataServer});
    }

    CalculateSubTotal(index: number) :number{
      let subTotal = 0;
      const p = this.cartDataServer.data[index];
      subTotal = p.product.price * p.numInCart;
      return subTotal;
    }
    
}

interface OrderResponse {
  order_id: number;
  success: boolean;
  message: string;
  products:[{
    id: string,
    numInCart: string
  }];
}

interface PaymentResponse{
  success: boolean;
}