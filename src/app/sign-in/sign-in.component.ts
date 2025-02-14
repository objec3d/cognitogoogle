import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

import { IUser, CognitoService } from '../cognito.service';
import { signInWithRedirect, getCurrentUser } from 'aws-amplify/auth';
import { Hub } from "aws-amplify/utils";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  imports: [FormsModule, NgClass]
})
export class SignInComponent {

  loading: boolean;
  user: IUser;

  constructor(private router: Router,
              private cognitoService: CognitoService) {
    this.loading = false;
    this.user = {} as IUser;

    Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          getCurrentUser().then(user => {
            this.user.email = user.userId;
            this.user.name = user.username;
          });
          break;
        case "signInWithRedirect_failure":
          // handle sign in failure
          break;
        case "customOAuthState":
          const state = payload.data; // this will be customState provided on signInWithRedirect function
          console.log(state);
          break;
      }
    });
  }

  public signIn(): void {
    this.loading = true;
    this.cognitoService.signIn({ username: this.user.email, password: this.user.password })
    .then(() => {
      this.router.navigate(['/profile']);
    }).catch(() => {
      this.loading = false;
    });
  }

  public googleSignInClick() {
    signInWithRedirect({
      provider: "Google"
    });
  }

}