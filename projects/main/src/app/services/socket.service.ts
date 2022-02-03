// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { filter } from 'rxjs/operators';
// import { environment } from '../../environments/environment';
// import { ISubmit } from '../models/submit';
// import { io } from 'socket.io-client';
// import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class SocketService {

//   private messageSubject: BehaviorSubject<ISubmit> = new BehaviorSubject<ISubmit>(null);
//   message$: Observable<ISubmit> = this.messageSubject.asObservable();
//   socket = io(environment.apiHost);

//   constructor(private auth: AuthService) {
//     this.socket.on('result', result => {
//       console.log(result);
//       this.messageSubject.next(result);
//     });
//   }

//   get myResult$(): Observable<ISubmit> {
//     return this.message$.pipe(
//       filter(result => result.user === (this.auth.me && this.auth.me._id))
//     );
//   }
// }
