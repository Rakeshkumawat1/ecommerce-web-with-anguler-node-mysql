import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {  UserService} from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  myUser: any;


  constructor(private authService: SocialAuthService,
              private userService: UserService,
              private router: Router) {
  }


  ngOnInit(): void {
    this.userService.userData$
      .pipe(
        map((user: SocialUser | ResponseModel ) => {
          if (user instanceof SocialUser) {
            return {
              ...user,
              email: 'test@test.com',

            };
          } else {
            return user;
          }
        })
      )
      .subscribe((data: ResponseModel | SocialUser) => {
        console.log(data);
        this.myUser = data;

      });
  }

  logout() {
    this.userService.logout();
  }
  
}

interface ResponseModel{
  token: string;
  auth: boolean;
  email: string;
  username: string;
  fname: string;
  lname: string;
  photoUrl: string;
  userId: number;
}