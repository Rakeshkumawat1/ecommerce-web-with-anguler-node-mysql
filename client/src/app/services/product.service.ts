import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModelServer, ServerResponse } from 'src/app/models/product.model';
import { from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = environment.SERVER_URL;
  constructor( private http: HttpClient) {}

  /* This is to fetch all products from the backend server */
  getAllProducts(numberOfResults = 10) : Observable<ServerResponse>{

    return this.http.get<ServerResponse>(this.SERVER_URL + '/products', {
      params: {
        limit: numberOfResults.toString()
      }
    });

  }
  /* GET SINGLE PRODUCT FROM SERVER */
  getSingleProduct(id: number): Observable<ProductModelServer>{
    return this.http.get<ProductModelServer>(this.SERVER_URL + '/products/' + id);
  }

  /* GET PRODUCTS FROM ONE CATEGORY */
  getProductsCategory(catName: string): Observable<ProductModelServer[]>{
    return this.http.get<ProductModelServer[]>(this.SERVER_URL + '/products/category/' +catName);
  }
    
}
