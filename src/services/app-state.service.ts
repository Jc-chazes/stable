import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AppStateService{

  initialState: any = {
    notifications: {
      unreadCount: 0
    }
  };

  private onStateChangeSubject = new BehaviorSubject<any>(this.initialState);

  onStateChange = this.onStateChangeSubject.asObservable();

  get currentState(): any{
    return this.onStateChangeSubject.value;
  }

  setState(partialState){
    let newState = Object.assign(this.onStateChangeSubject.value,partialState);
    console.log(newState);
    this.onStateChangeSubject.next(newState);
  }

  forceUpdate(){
    this.onStateChangeSubject.next({ ...this.onStateChangeSubject.value });
  }



}
