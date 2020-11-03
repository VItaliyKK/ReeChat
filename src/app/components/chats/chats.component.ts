import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  ddd:string = ''
  constructor( private storage: AngularFireStorage) { }

  ngOnInit(): void {
    console.log(this.storage.storage.maxUploadRetryTime)
  }

}
