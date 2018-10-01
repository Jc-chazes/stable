import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

/**
 * Navigation within admin (tabs)
 */
@Injectable()
export class NavigationService{
    
    enum 

    private navigationSubject = new BehaviorSubject<number>(null);

    public onNavigate = this.navigationSubject.asObservable();

    public navigateTo( tab: 'SCHEDULE' | 'MARKET' | 'STATUS' | 'NOTIFICATIONS' | 'PROFILE' ){
        let tabIndex = 0;
        switch( tab ){
            case 'SCHEDULE': tabIndex = 0; break;
            case 'MARKET': tabIndex = 1; break;
            case 'STATUS': tabIndex = 2; break;
            case 'NOTIFICATIONS': tabIndex = 3; break;
            case 'PROFILE': tabIndex = 4; break;
        }
        this.navigationSubject.next(tabIndex);
    }

}