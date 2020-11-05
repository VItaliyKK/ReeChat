import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ChatsComponent } from './components/chats/chats.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { SingupComponent } from './components/singup/singup.component';
import { AuthGuard } from './shared/guards/auth.guard';


const routes: Routes = [
  {path: 'chats', component: ChatsComponent, canActivate: [AuthGuard], children: [
    {path: ':idDialog', component: DialogComponent},
  ]},
  {path: 'login', component: LoginComponent},
  {path: 'singup', component: SingupComponent},
  {path: '**', redirectTo: 'chats'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
