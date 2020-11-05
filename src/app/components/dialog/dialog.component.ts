import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DialogService } from '../../shared/services/dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  dialogID: string

  constructor(private router: Router,
              private dialogService: DialogService, 
              private activeRoute: ActivatedRoute) { 
    this.router.events.subscribe( (e) => {
      if (e instanceof NavigationEnd){
        if (this.activeRoute.snapshot.paramMap.get('idDialog')) {
          this.dialogID = this.activeRoute.snapshot.paramMap.get('idDialog')
          console.log(this.dialogID)
          this.getMessages()
        }
      }
    })};

  ngOnInit(): void {
  };

  getMessages(){
    this.dialogService.getMessages(this.dialogID).onSnapshot( data => {
      data.forEach( docs => {
        console.log(docs.data());
      })
    })
  }

}
