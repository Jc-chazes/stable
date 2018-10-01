import { Injectable } from '@angular/core';
import { AppService } from "./app.service";
import { AuthService } from "./auth.service";
import 'rxjs/add/operator/map';
import { AppStateService } from './app-state.service';
import { Firebase } from '@ionic-native/firebase';

@Injectable()
export class NotificationsService {

    constructor(
        private appService: AppService,
        private authService: AuthService,
        private appState: AppStateService,
        private firebaseNative: Firebase) { }


    getNotifications(page) {
        let userId = this.authService.userId;
        let url = this.appService.gateway + `/api/notifications/by-user/${userId}?cbp=10&page=${page}&orderby=id&order=desc`;
        return this.authService.get(url)
            .map(response => {
                let res = response.json();
                return res;
            });
    }

    searchNotification(string) {
      let userId = this.authService.userId;
        let url = this.appService.gateway + `/api/notifications/search-by-user/${userId}/${string}`;
        return this.authService.get(url)
            .map(response => {
                let res = response.json();
                return res;
            });
    }

    getUnreadNotifications() {
        let userId = this.authService.userId;
        let url = this.appService.gateway + `/api/notifications/unread/${userId}`;
        return this.authService.get(url)
            .map(response => {
                let res = response.json();
                // this.firebaseNative.setBadgeNumber( res.unread ).then();
                this.setUnreadCounter(res.unread);
                return res;
            });
    }

    updateNotificationStatus(notificationUserId) {
      let url = this.appService.gateway + `/api/notifications/update-status/${notificationUserId}`;
      return this.authService.get(url)
          .map(response => {
              let res = response.json();
              return res;
          });
    }

    decrementUnreadCounter(){
        let { notifications } = this.appState.currentState;
        --notifications.unreadCount;
        this.appState.setState(notifications);
        this.firebaseNative.setBadgeNumber( notifications.unreadCount ).then();
    }

    incrementUnreadCounter(){
        let { notifications } = this.appState.currentState;
        ++notifications.unreadCount;
        this.appState.setState(notifications);
        this.firebaseNative.setBadgeNumber( notifications.unreadCount ).then();
    }

    setUnreadCounter(counter){
        let { notifications } = this.appState.currentState;
        notifications.unreadCount = counter;
        this.appState.setState(notifications);
        this.firebaseNative.setBadgeNumber( counter ).then();
    }


}
