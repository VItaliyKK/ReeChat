import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IChat } from '../interfaces/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(private firestore: AngularFirestore) { }

  getChats(userId: string): firebase.default.firestore.Query<firebase.default.firestore.DocumentData>{
    return this.firestore.collection('chats').ref.where('chatUsers', 'array-contains', userId).orderBy('lastActive', 'desc')
  };

  createNewChat(chat:IChat):Promise<void>{
    return this.firestore.collection('chats').doc(chat.id).set(chat)
  }
}
 