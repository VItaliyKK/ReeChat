import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss']
})
export class SingupComponent implements OnInit {
  showPassword:boolean = false
  loginError:string = ''
  emailInput:string = ''
  firstNameInput:string = ''
  lastNameInput:string = ''
  passwordInput:string = ''
  authStateListener: Subscription

  constructor(private socialAuthService: SocialAuthService, 
              private authServ: AuthService,
              private router: Router) { }

  ngOnInit() {
  };

  signInWithGoogle(): void { 
    this.authStateListener = this.socialAuthService.authState.subscribe( user => {
      this.authServ.processReceivedData(user)
    })
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then( user => {
      this.authServ.singUpWithProviders(user)
    })
  };

  signInWithFB(): void {
    this.authStateListener = this.socialAuthService.authState.subscribe( user => {
      this.authServ.processReceivedData(user)
    })
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then( user => {
      this.authServ.singUpWithProviders(user)
    })
  };

  signOut(): void {
    this.socialAuthService.signOut();
  };

  // registration user through the form
  singUp(){
    let newUser:IUser = {
      email: this.emailInput,
      firstName: this.firstNameInput,
      lastName: this.lastNameInput,
      id: '',
      photoUrl: ''
    };
    // create new user in list of registered users
    this.authServ.singUp(newUser).then( data => {
      newUser.id = data.user.uid
      // add new user in firestore 'users' list
      this.authServ.addNewUserInDatabase(newUser).then( () => {
        // then login in system
        this.authServ.logIn(newUser.email, newUser.password).then( () => {
          this.loginError = ''
          this.authServ.setLocalStorageUser(newUser)
          this.authServ.currentUser = newUser
          this.router.navigateByUrl('/chats')
        }).catch(error => {
          this.loginError = error.message
        })
      }).catch(error => {
        this.loginError = error.message
      })
    }).catch(error => {
      this.loginError = error.message
    })
  };
}
