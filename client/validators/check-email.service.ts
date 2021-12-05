// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
// import { Observable, timer } from 'rxjs';
// import {  map, switchMap } from 'rxjs/operators';
// import { ResponseModel } from 'src/app/services/user.service';
// import { environment } from 'src/environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class CheckEmailService {
//   SERVER_URL = environment.SERVER_URL;

//   constructor(private httpClient: HttpClient) { }
//   searchEmail(text: any) {
//     return timer(2000)
//       .pipe(
//         switchMap(() => this.httpClient.get(`${this.SERVER_URL}/users/validate/${text}`)),
//       ); // PIPE ENDS HERE
//   }

//   emailValidate(): AsyncValidatorFn {
//     return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
//       console.log(control.value);
//       return this.searchEmail(control.value)
//         .pipe(
//           // map((res: emailValidateResponse) => {
//           //   if (res.status) {
//           //     return {taken: true};
//           //   }
//           //   return null;
//           // })
//         ); // PIPE ENDS HERE
//     };
//   }
// }

// interface emailValidateResponse{
//   message: string, 
//   status: boolean, 
//    user: userModel

// }
// interface userModel{
//   token: string;
//   auth: boolean;
//   email: string;
//   username: string;
//   fname: string;
//   lname: string;
//   photoUrl: string;
//   userId: number;
//   type: string;
//   role: number;

// }

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import {environment} from 'src/environments/environment';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Observable, timer} from 'rxjs';
import { ResponseModel } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class CheckEmailService {
  SERVER_URL = environment.SERVER_URL;


  constructor(private httpClient: HttpClient) {
  }

  // searchEmail(text: any) {
     
  //   return  timer(2000)
  //   .pipe(
  //     switchMap(() => this.httpClient.get(`${this.SERVER_URL}/users/validate/${text}`))
  //     );

  //      // switchMap(() => this.httpClient.get(`${this.SERVER_URL}/users/validate/${text}`)),
  //     // PIPE ENDS HERE
  // }


  emailValidate(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      console.log(control.value);
      //console.log("done");
      //console.log(this.searchEmail(control.value));
      return this.httpClient.get(`${this.SERVER_URL}/users/validate/${control.value}`)
      .pipe(
        map((res: emailValidateResponse | object | any) =>{
          //console.log(res.status);
          if (res.status) {
            console.log("email already taken");
                    return {taken: true};
                  }
                  return null;
        })
      )

      // return this.searchEmail(control.value)
      //   .pipe(
      //     map((res: emailValidateResponse | object ) => {
      //       // console.log(status);
      //       if (status) {
      //         return {taken: true};
      //       }
      //       return null;
      //     })
      //   ); // PIPE ENDS HERE
    };
  }
}
interface emailValidateResponse{
  message: string, 
  status: boolean, 
   user: ResponseModel

}