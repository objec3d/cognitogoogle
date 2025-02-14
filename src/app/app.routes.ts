import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

export const routes: Routes = [
    {
      path: '',
      redirectTo: 'signIn',
      pathMatch: 'full',
    },
    {
      path: 'profile',
      component: ProfileComponent,
    },
    {
      path: 'signIn',
      component: SignInComponent,
    },
    {
      path: 'signUp',
      component: SignUpComponent,
    },
    {
      path: '**',
      redirectTo: 'signIn',
    },
  ];
