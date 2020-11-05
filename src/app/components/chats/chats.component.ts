import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatsService } from 'src/app/shared/services/chats.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  searchValue:string = ''
  currentUser:IUser | SocialUser;
  chats:any[] = []

  constructor( private authServ: AuthService,
              private chatsService: ChatsService, 
              private router: Router) { }

  ngOnInit(): void {
  };

  logOut():void{
    if (this.authServ.loggedIn){ // if login was via Facebook or Google
      this.authServ.signOut()
      this.authServ.loggedIn = false
    }
    localStorage.removeItem('user')
    this.router.navigateByUrl('/login')
  };
}
