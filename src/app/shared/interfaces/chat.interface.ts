export interface IChat{
    lastMessage: string;
    lastActive: Date;
    chatUsers: string [];
    id:string;
    photoUrl?: string;
    lastName?: string;
    firstName?: string;
}