import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private firestore: AngularFirestore) { }

  getMessages(idDialog): firebase.default.firestore.Query<firebase.default.firestore.DocumentData> {
    return this.firestore.collection('messages').ref.where('dialogID', '==', idDialog).orderBy('lastActive', 'desc')
  }
}
