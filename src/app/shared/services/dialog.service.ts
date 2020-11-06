import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IMessage } from '../interfaces/message.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DialogService {
  public apiURL = "https://api.chucknorris.io/jokes/random";

  constructor(private firestore: AngularFirestore, private httpClient: HttpClient) { }

  getMessages(idDialog): firebase.default.firestore.Query<firebase.default.firestore.DocumentData> {
    return this.firestore.collection('messages').ref.where('idDialog', '==', idDialog).orderBy('date', 'desc')
  }

  sendNewMessage(message: IMessage): Promise<void>{
    return this.firestore.collection('messages').doc(message.id).set(message)
  }

  getDialog(idChat:string): Observable<any>{
    return this.firestore.collection('chats').doc(idChat).get()
  }

  async replyChuckNorris(): Promise<Object>{
    return this.httpClient.get(this.apiURL).toPromise()
  }

  updateNewMessage(idDialog:string, lastMessage:string, lastActive: Date): Promise<void>{
    return this.firestore.collection('chats').doc(idDialog).update({
      'lastActive': lastActive,
      'lastMessage': lastMessage,
    })
  }
}
