import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { IChat } from 'src/app/shared/interfaces/chat.interface';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatsService } from 'src/app/shared/services/chats.service';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  searchValue:string = ''
  currentUser:IUser | SocialUser;
  chats:IChat[] = []
  foundUsersAmongAllUsers: IUser[] = []
  foundUsersListEmpty: boolean = true
  searching:boolean = false
  chatNoSelected: boolean = true

  constructor( private authServ: AuthService,
              private chatsService: ChatsService, 
              private firestore: AngularFirestore,
              private mainService: MainService,
              private router: Router) { 
      this.router.events.subscribe( (e) => {
        if (e instanceof NavigationEnd){
          //show messages when no chat is selected
          this.chatNoSelected = this.router.url.lastIndexOf('/') == 0 ? true : false
        }
      })
      }

  ngOnInit(): void {
    this.currentUser = this.authServ.currentUser || JSON.parse(localStorage.getItem('user'))
    this.getChats(this.currentUser.id)

  };

  logOut():void{
    if (this.authServ.loggedIn){ // if login was via Facebook or Google
      this.authServ.signOut()
      this.authServ.loggedIn = false
    }
    localStorage.removeItem('user') 
    this.router.navigateByUrl('/login')
  };

  // get all chats user
  getChats(userID: string){
    this.chatsService.getChats(userID).onSnapshot( data => {
      // check if user have any chats
      if (!data.empty) { 
        this.chats = []
        data.forEach( docChat => { 
          //upload data for each user chat
          let gotChat: IChat = docChat.data() as IChat
          this.mainService.getUserData(gotChat.chatUsers[0] == this.currentUser.id ? gotChat.chatUsers[1] : gotChat.chatUsers[0])
          .subscribe( doc => { 
            gotChat.firstName = doc.data().firstName
            gotChat.lastName = doc.data().lastName
            gotChat.photoUrl = doc.data().photoUrl
            this.chats.push(gotChat)
          })
        })
      }
    })
  };

  // search by values: lastName and firstName
  onChangeSearchChats(){
    if (this.searchValue){
      this.searching = true
      this.foundUsersAmongAllUsers.length = 0
      this.foundUsersListEmpty = true
      const val = this.searchValue.charAt(0).toUpperCase() + this.searchValue.substring(1)
      let fieldsSearch = ['lastName', 'firstName']
      // search by values: lastName and firstName
      fieldsSearch.forEach( field => { 
        this.firestore.collection("users").ref.orderBy(field).startAt(val).endAt(val +"\uf8ff")
        .get().then( docs => {
          if (!docs.empty) {
            this.foundUsersListEmpty = false
            docs.forEach( doc => {
              const isExistInList = this.foundUsersAmongAllUsers.findIndex(p => p.id == (doc.data() as IUser).id)
              isExistInList != -1
                  ? this.foundUsersAmongAllUsers.splice(isExistInList, 1, doc.data() as IUser)
                  : this.foundUsersAmongAllUsers.push(doc.data() as IUser)
            })
          }
        })
      })
    } else {
      this.searching = false
    }
  };

  //when selected found user -> check if chat already exist -> go to chat
  goToChat(selectedUserID:string){
    //check if choose yourself account
    if (selectedUserID != this.currentUser.id) {
      const chatAlreadyExist = this.checkIfChatAlreadyExist(selectedUserID, this.currentUser.id)
      if (chatAlreadyExist){ // -- if chat already exist
        this.clearSearch()
        this.router.navigateByUrl('/chats/' + chatAlreadyExist.id)
      } else { // -- if chat does not exist yet
        let newChat:IChat = {
          id: this.firestore.createId(),
          chatUsers: [selectedUserID, this.currentUser.id],
          lastMessage: '',
          lastActive: new Date()
        }
        this.chatsService.createNewChat(newChat).then( () => {
          this.clearSearch()
          this.router.navigateByUrl('/chats/' + newChat.id)
        })
      }
    }
  };

  checkIfChatAlreadyExist(idUser1:string, idUser2:string):IChat | undefined{
    let chatIsExist = this.chats.find( chat => {
      return chat.chatUsers.includes(idUser1) && chat.chatUsers.includes(idUser2)
    });
    return chatIsExist 
  };

  clearSearch(){
    this.searching = false
    this.foundUsersAmongAllUsers.length = 0
    this.foundUsersListEmpty = true
    this.searchValue = ''
  }
}
