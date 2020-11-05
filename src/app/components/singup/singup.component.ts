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

  constructor(private authService: SocialAuthService, 
              private authServ: AuthService,
              private router: Router) { }

  ngOnInit() {
    // this.authStateListener = this.authService.authState.subscribe( user => {
    //   this.authServ.loggedIn = (user != null);
    //   this.authServ.currentUser = user
    //   this.authServ.setLocalStorageUser(user) 
    //   this.router.navigateByUrl('/chats')
    //   console.log(user)
    // })
  };

  // ngOnDetroy(){
  //   this.authStateListener.unsubscribe()
  // }

  singUpWithProviders(us:SocialUser){
    console.log(us)
    this.authServ.loggedIn = (us != null);
    this.authServ.currentUser = us
    this.authServ.setLocalStorageUser(us) 
    this.authServ.addNewUserInDatabase({
      email: us.email, 
      firstName: us.firstName,
      lastName: us.lastName,
      id: us.id,
      photoUrl: us.photoUrl}).then( () => {
        this.router.navigateByUrl('/chats')
      })
  };

  signInWithGoogle(): void { 
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  singUp(){
    let newUser:IUser = {
      email: this.emailInput,
      firstName: this.firstNameInput,
      lastName: this.lastNameInput,
      id: '',
      photoUrl: '',
      password: this.passwordInput
    }
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
          // this.resetForm()
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

  // resetForm(){
  //   this.emailInput = ''
  //   this.firstNameInput = ''
  //   this.lastNameInput = ''
  //   this.passwordInput = ''
  // };
}
