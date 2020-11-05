import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private firestore: AngularFirestore) { }

  getUserData(idUser:string): Observable<any>{
    return this.firestore.collection('users').doc(idUser).get()
  }
}
