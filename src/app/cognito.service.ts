import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Amplify } from 'aws-amplify';
import { fetchUserAttributes, signUp, confirmSignUp, signIn, signOut, getCurrentUser, type ConfirmSignUpInput, type SignInInput, GetCurrentUserOutput, type FetchUserAttributesOutput } from 'aws-amplify/auth';

export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  private authenticationSubject: BehaviorSubject<any>;

  constructor() {
    (Amplify.configure({
      Auth: {
        Cognito: {
          userPoolClientId: 'REPLACEME',
          userPoolId: 'REPLACEME',
          loginWith: { // Optional
            oauth: {
              domain: 'REPLACEME',
              //scopes: ['openid','email','phone','profile','aws.cognito.signin.user.admin'],
              scopes: ['openid','email','profile','aws.cognito.signin.user.admin'],
              redirectSignIn: ['http://localhost:4200/profile'],
              redirectSignOut: ['http://localhost:4200/signIn'],
              responseType: 'code',
            },
            username: true,
            email: false, // Optional
            phone: false, // Optional
          }
    }}}));

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public signUp(user: IUser): Promise<any> {
    return signUp({
      username: user.email,
      password: user.password,
    });
  }

  public confirmSignUp({
    username,
    confirmationCode
  }: ConfirmSignUpInput): Promise<any> {
    return confirmSignUp({username, confirmationCode});
  }

  public signIn({ username, password }: SignInInput): Promise<any> {
    return signIn({username, password})
    .then(() => {
      this.authenticationSubject.next(true);
    });
  }

  public signOut(): Promise<any> {
    return signOut()
    .then(() => {
      this.authenticationSubject.next(false);
    });
  }

  public isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
      .then((user: any) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      }).catch(() => {
        return false;
      });
    }
  }

  public getUser(): Promise<FetchUserAttributesOutput> {
    return fetchUserAttributes();
  }

}