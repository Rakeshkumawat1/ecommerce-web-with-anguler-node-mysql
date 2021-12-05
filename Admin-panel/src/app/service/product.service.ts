import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private SERVER_URL = environment.SERVER_URL;

  constructor(private httpClient: HttpClient) { }

  getAllProducts(): Observable<any[]> {
    return  this.httpClient.get<any[]>(this.SERVER_URL + '/products');
  }

  deleteProduct(productId: any): Observable<any> {
    return this.httpClient.delete<{ message?: string, status: string }>(`http://localhost:3000/api/products/delete/${productId}`)
      .pipe(
        switchMap(async (data) => {
          const prods = await this.getAllProducts().toPromise();
          return {
            ...data,
            ...prods
          };
        })
      );
  }

  addCategory(formData: any): Observable<{message: string}>{
    const{cname} = formData;
    console.log(formData);
    return this.httpClient.post<{ message: string }>(`${this.SERVER_URL}/products/addcategory/` + cname,{
      cname
    });
  }

  addProduct(formData: any): Observable<{message: string}>{
    const{title, image, images, description, price, quantity, short_desc} = formData;
    const cat_id = 1;
    console.log(formData);
    return this.httpClient.post<{message: string }>(`${this.SERVER_URL}/products/addproduct`,{
      title,
      image,
      images,
      description,
      price,
      quantity,
      short_desc,
      cat_id

    });
    }
  
  
}
