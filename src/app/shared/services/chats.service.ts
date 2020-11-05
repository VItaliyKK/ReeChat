import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(private firestoree: AngularFirestore) { }

  getChats(userId: string): firebase.default.firestore.Query<firebase.default.firestore.DocumentData>{
    return this.firestoree.collection('chats').ref.where('chatUsers', 'array-contains', userId).orderBy('lastActive', 'desc')
  };
}
 