import { Data } from '@angular/router';

export interface IMessage{
    date:Date;
    id:string;
    idDialog:string;
    value: string;
    sendBy: string;
}