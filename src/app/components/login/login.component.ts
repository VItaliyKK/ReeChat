import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/shared/interfaces/user.interface';
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

  constructor(private authService: SocialAuthService, 
              private authServ: AuthService,
              private router: Router,
              private mainService: MainService) { }

  ngOnInit() {
    this.authStateListener = this.authService.authState.subscribe( us => {
      this.authServ.loggedIn = (us != null);
      this.authServ.currentUser = us
      this.authServ.setLocalStorageUser(us) 
      this.router.navigateByUrl('/chats')
      console.log(us)
    })
  };

  ngOnDetroy(){
    this.authStateListener.unsubscribe()
  }

  subscribeOnAuthState(us:SocialUser){
    this.authServ.loggedIn = (us != null);
    this.authServ.currentUser = us
    this.authServ.setLocalStorageUser(us) 
    this.router.navigateByUrl('/chats')
    console.log(us)
  }

  signInWithGoogle(): void { 
    this.authServ.signInWithGoogle();
  };

  signInWithFB(): void {
    this.authServ.signInWithFB();
  };

  signOut(): void {
    this.authService.signOut();
  };

  logIn(){
    this.authServ.logIn(this.emailInput, this.passwordInput)
      .then( data => {
        this.mainService.getUserData(data.user.uid).subscribe( doc => {
          this.loginError = ''
          this.authServ.currentUser = doc.data()
          this.authServ.setLocalStorageUser(doc.data()) 
          this.router.navigateByUrl('/chats')
        })
      })
      .catch(error => {this.loginError = error.message})
  };
}

