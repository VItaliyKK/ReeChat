import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { IUser } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: SocialUser | IUser
  loggedIn: boolean;
  authStateListener: Subscription 


  constructor(private firestore: AngularFirestore, 
              private authFire: AngularFireAuth, 
              private router: Router,
              private authService: SocialAuthService) { }

  singUp(newUser:IUser):Promise<firebase.default.auth.UserCredential>{
    return this.authFire.createUserWithEmailAndPassword(newUser.email, newUser.password)
  };

  singUpWithProviders(us:SocialUser){
    let newUser:IUser = {
      email: us.email,
      firstName: us.firstName,
      lastName: us.lastName,
      id: us.id,
      photoUrl: us.photoUrl
    }
    this.addNewUserInDatabase(newUser).then( () => { //add new User in database list "users"
      this.router.navigateByUrl('/chats')
    })
  };

  addNewUserInDatabase(newUser: IUser): Promise<void>{
    return this.firestore.collection('users').doc(newUser.id).set(Object.assign({}, newUser))
  };

  signInWithGoogle(): void { 
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  };

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID); 
  };

  logIn(email:string, password:string): Promise<firebase.default.auth.UserCredential>{
    return this.authFire.signInWithEmailAndPassword(email, password)
  };

  signOut(): void {
    this.authService.signOut().then( () => {
      localStorage.removeItem('user')
    })
  };

  setLocalStorageUser(currentUser: IUser){
    localStorage.setItem('user', JSON.stringify(currentUser))
  };

  getLocalStorageUser():IUser{
    return JSON.parse(localStorage.getItem('user')) 
  };

  // process reived user data
  processReceivedData(us:SocialUser){
    this.loggedIn = (us != null);
    this.currentUser = us
    this.setLocalStorageUser(us) 
    console.log('USER:', us)
  };

  checkIfUserAlreadyRegister(usr: SocialUser){
    this.firestore.collection('users').doc(usr.id).get().toPromise().then( data => {
      if (data.exists) {
        // if user has already registered
        this.processReceivedData(usr)
        this.router.navigateByUrl('/chats')
      } else {
        // if user has not yet registered
        this.singUpWithProviders(usr) 
      }
    })
  };
}
