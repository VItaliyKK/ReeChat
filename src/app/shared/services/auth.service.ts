import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
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


  constructor(private firestore: AngularFirestore, private authFire: AngularFireAuth, private authService: SocialAuthService) { }

  singUp(newUser:IUser):Promise<any>{
    return this.authFire.createUserWithEmailAndPassword(newUser.email, newUser.password)
  }

  addNewUserInDatabase(newUser: IUser): Promise<void>{
    return this.firestore.collection('users').doc(newUser.id).set(Object.assign({}, newUser))
  }

  signInWithGoogle(): void { 
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID); 
  }

  logIn(email:string, password:string): Promise<any>{
    return this.authFire.signInWithEmailAndPassword(email, password)
  }

  signOut(): void {
    this.authService.signOut();
  }

  setLocalStorageUser(currentUser: IUser){
    localStorage.setItem('user', JSON.stringify(currentUser))
  }

  getLocalStorageUser():IUser{
    return JSON.parse(localStorage.getItem('user')) 
  }
}
