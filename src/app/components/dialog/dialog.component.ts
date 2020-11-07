import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { IChat } from 'src/app/shared/interfaces/chat.interface';
import { IMessage } from 'src/app/shared/interfaces/message.interface';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { MainService } from 'src/app/shared/services/main.service';
import { ReplyChuckNorrisParams } from 'src/app/shared/types/replyChuckNorrisParams.type';
import { DialogService } from '../../shared/services/dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  dialogID: string;
  messages: IMessage[] = []
  newMessageValue:string = ''
  chatUser: IUser | SocialUser
  currentUserId:string
  dialogListener:Subscription
  preloaderShow: boolean = false
  setWidthDialogFull: boolean = false

  constructor(private router: Router,
              private firestore:AngularFirestore,
              private mainService: MainService,
              private dialogService: DialogService, 
              private activeRoute: ActivatedRoute) { 
    this.router.events.subscribe( (e) => {
      if (e instanceof NavigationEnd){
        // subscribe on changes url for updating current chat
        if (this.router.url.includes('chats') && this.activeRoute.snapshot.paramMap.get('idDialog')) {
          this.dialogID = this.activeRoute.snapshot.paramMap.get('idDialog')
          this.messages = []
          this.preloaderShow = true
          this.getDialog()
          this.getMessages()
        }
      }
    })};

  ngOnInit(): void {
  };

  ngOnDetroy(){
    this.dialogListener.unsubscribe()
  }

  getDialog(){ 
    // get current dialog
    this.dialogListener = this.dialogService.getDialog(this.dialogID).subscribe( data => {
      const dialog: IChat = data.data()
      this.currentUserId = dialog.chatUsers[0] == JSON.parse(localStorage.getItem('user')).id 
          ? dialog.chatUsers[1]
          : dialog.chatUsers[0]
      // get user data (first name, last name, photoUrl, id)    
      this.mainService.getUserData(this.currentUserId).toPromise().then( docs => {
        this.preloaderShow = false
        this.chatUser = docs.data(); 
      })
    })
  }

  // get messages for current dialog
  getMessages(){
    this.dialogService.getMessages(this.dialogID).onSnapshot( dataMess => {
      if (!dataMess.empty){
        //if got updated messages for current dialog
        if (dataMess.docs[0].data().idDialog == this.dialogID) {
          this.messages = []
        }
        dataMess.forEach( docs => {
          const message: IMessage = docs.data() as IMessage
          //check if firebase updated messages for current dialog
          // ** if you switch to another chat, firebase can send messages from the previous chat
          if (message.idDialog == this.dialogID){
            this.messages.push(message)
          }
        })
      } 
    })
  };

  // send message by auth user
  sendMessage(){
    if (this.newMessageValue) {
      let newMessage: IMessage = {
        date: new Date(),
        id: this.firestore.createId(),
        idDialog: this.dialogID,
        value: this.newMessageValue,
        sendBy: JSON.parse(localStorage.getItem('user')).id
      }
      //send new sessage in chat
      this.dialogService.sendNewMessage(newMessage)
      .then( () => {
        //update lastMessage and lastActive for chat
        this.dialogService.updateNewMessage(this.dialogID, newMessage.value, newMessage.date)
        .then( () => {
          this.newMessageValue = ''
          // create a delayed response (10 seconds) using ChuckNorrisAPI
           setTimeout((params) => {
            this.replyChuckNorris(params)
          }, 10000, {'chatID': this.dialogID, 'whoSended': this.chatUser.id});
        })
      }).catch( error => {
        // if message didn`t sended
        console.log(error.message);
      }) 
    }
  };

  //send message via "enter"
  sendMessageViaKeyboardEvent(e:KeyboardEvent){
    if (e && e.key == 'Enter') {
      this.sendMessage()
    }
  }

  replyChuckNorris(paramsMessage: ReplyChuckNorrisParams){
    // get Chuck Norris reply
    this.dialogService.replyChuckNorris().then( res => {
      let newMessageChuckNorris: IMessage = {
        date: new Date(),
        id: this.firestore.createId(),
        idDialog: paramsMessage.chatID,
        value: (res as any).value,
        sendBy: paramsMessage.whoSended
      }
      // add Chuck Norris's reply to Firebase "message"
      this.dialogService.sendNewMessage(newMessageChuckNorris).then( () => {
        // update lastMessage and lastActive for chat
        this.dialogService.updateNewMessage(paramsMessage.chatID, newMessageChuckNorris.value, newMessageChuckNorris.date)
      })
    })
  };
}
