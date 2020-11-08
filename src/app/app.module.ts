import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { firebaseParams, providersList } from 'src/environments/environment.prod';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SingupComponent } from './components/singup/singup.component';
import { ChatsComponent } from './components/chats/chats.component';
import { DialogComponent } from './components/dialog/dialog.component'; 
import { PreloaderComponent } from './components/preloader/preloader.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SingupComponent,
    ChatsComponent,
    DialogComponent,
    PreloaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseParams.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule, 
    AngularFireStorageModule,
    SocialLoginModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(providersList.googleLoginProvider)
          },{ 
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(providersList.facebookLoginProvider)
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
