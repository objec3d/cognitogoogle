import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IUser, CognitoService } from '../cognito.service';
import { FetchUserAttributesOutput, type fetchUserAttributes } from 'aws-amplify/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [FormsModule]
})
export class ProfileComponent implements OnInit {

  loading: boolean;
  user: IUser;

  constructor(private cognitoService: CognitoService) {
    this.loading = false;
    this.user = {} as IUser;
  }

  public ngOnInit(): void {
    this.cognitoService.getUser()
    .then((user: FetchUserAttributesOutput) => {
      console.log(user);
      this.user.email = user.email!;
      this.user.name = user.name!;
    });
  }

  public update(): void {
    this.loading = true;

    /*this.cognitoService.updateUser(this.user)
    .then(() => {
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });*/
  }

}