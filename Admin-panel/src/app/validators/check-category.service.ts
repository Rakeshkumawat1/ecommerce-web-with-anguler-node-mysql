import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckCategoryService {
  SERVER_URL = environment.SERVER_URL;

  constructor(private httpClient: HttpClient) { }

  categoryValidate(): AsyncValidatorFn{
    return (control: AbstractControl): Observable<{[key: string]: any } | null> =>{
      console.log(control.value);
      return this.httpClient.get(`${this.SERVER_URL}/products/categoryvalidate/${control.value}`)
      .pipe(
        map((res: categoryValidateResponse | object | any) => {
          if(res.status){
            console.log("category already taken");
            return {taken: true};
          }
          return null;
        })
      )
    }
  }

}

interface categoryValidateResponse {
  message: string;
  status: boolean;
  error: string;
  title: string;
  
}
