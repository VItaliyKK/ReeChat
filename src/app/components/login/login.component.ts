import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showPassword:boolean = false
  loginError:string = ''
  emailInput:string = ''
  passwordInput:string = ''
  authStateListener: Subscription 
  preloaderShow:boolean = false

  constructor(private socialAuthService: SocialAuthService, 
              private authServ: AuthService,
              private router: Router,
              private mainService: MainService) { }

  ngOnInit() {
  };

  ngOnDetroy(){
    this.authStateListener.unsubscribe()
  }

  signInWithGoogle(): void {
    this.authStateListener = this.socialAuthService.authState.subscribe( user => {
      if (user) {
        this.authServ.checkIfUserAlreadyRegister(user)
      }
    })
    this.authServ.signInWithGoogle();
  };

  signInWithFB(): void {
    this.authStateListener = this.socialAuthService.authState.subscribe( user => {
      if (user){
        this.authServ.checkIfUserAlreadyRegister(user)
      }
    })
    this.authServ.signInWithFB();
  };

  signOut(): void {
    this.socialAuthService.signOut();
  };

  // login user through the form
  logIn(){
    this.preloaderShow = true
    this.authServ.logIn(this.emailInput, this.passwordInput)
      .then( data => { 
        // get user data
        this.mainService.getUserData(data.user.uid).subscribe( doc => {
          this.preloaderShow = false
          this.loginError = ''
          this.authServ.loggedIn = true
          this.authServ.currentUser = doc.data()
          this.authServ.setLocalStorageUser(doc.data()) 
          this.router.navigateByUrl('/chats')
        })
      })
      .catch(error => {
        this.loginError = error.message
        this.preloaderShow = false
      })
  };
}

