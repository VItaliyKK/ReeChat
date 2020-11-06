import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { IChat } from 'src/app/shared/interfaces/chat.interface';
import { IMessage } from 'src/app/shared/interfaces/message.interface';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { MainService } from 'src/app/shared/services/main.service';
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
  chuckNorrisRequest
  dialogListener:Subscription

  constructor(private router: Router,
              private firestore:AngularFirestore,
              private mainService: MainService,
              private dialogService: DialogService, 
              private activeRoute: ActivatedRoute) { 
    this.router.events.subscribe( (e) => {
      if (e instanceof NavigationEnd){
        if (this.router.url.includes('chats') && this.activeRoute.snapshot.paramMap.get('idDialog')) {
          this.dialogID = this.activeRoute.snapshot.paramMap.get('idDialog')
          this.messages = []
          this.getDialog()
          this.getMessages()
        }
      }
    })};

  ngOnInit(): void {
  };

  getDialog(){ 
    this.dialogListener = this.dialogService.getDialog(this.dialogID).subscribe( data => {
      const dialog: IChat = data.data()
      const idUser = dialog.chatUsers[0] == JSON.parse(localStorage.getItem('user')).id 
          ? dialog.chatUsers[1]
          : dialog.chatUsers[0]
      this.mainService.getUserData(idUser).toPromise().then( docs => {
        this.chatUser = docs.data(); 
        // this.getMessages()
      })
    })
  }

  // get messages for current dialog
  getMessages(){
    this.dialogService.getMessages(this.dialogID).onSnapshot( dataMess => {
      if (!dataMess.empty){
        //if get updated messages with current dialog
        if (dataMess.docs[0].data().idDialog == this.dialogID) {
          this.messages = []
        }
        dataMess.forEach( docs => {
          const message: IMessage = docs.data() as IMessage
          if (message.idDialog == this.dialogID){
            this.messages.push(message)
          }
        })
      } 
    })
  };

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
           setTimeout((params) => {
            this.replyChuckNorris(params)
          }, 5000, {'chatID': this.dialogID, 'whoSended': this.chatUser.id});
        })
      }).catch( error => {
        console.log(error.message);
      }) 
    }
  };

  replyChuckNorris(any){
    this.dialogService.replyChuckNorris().then( res => {
      let newMessageChuckNorris: IMessage = {
        date: new Date(),
        id: this.firestore.createId(),
        idDialog: any.chatID,
        value: (res as any).value,
        sendBy: any.whoSended
      }
      this.dialogService.sendNewMessage(newMessageChuckNorris).then( d => {
        //update lastMessage and lastActive for chat
        this.dialogService.updateNewMessage(any.chatID, newMessageChuckNorris.value, newMessageChuckNorris.date)
      })
    })
  };
}
