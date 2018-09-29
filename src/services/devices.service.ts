import { Injectable, NgZone } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AuthService } from '../services/auth.service';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { AppService } from './app.service';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AppStateService } from './app-state.service';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { NotificationsPage } from '../pages/notifications/notifications';
import { NotificationsService } from './notifications.service';


/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DevicesService {

    constructor(
        private firebaseNative: Firebase,
        private authService: AuthService,
        private platform: Platform,
        private device: Device,
        private appService: AppService,
        private localNotifications: LocalNotifications,
        private appState: AppStateService,
        private ngZone: NgZone,
        private notifications: NotificationsService
    ) { }

    private async getToken(): Promise<string>{
        let token = null;    
        try{
            if (this.platform.is('android')) {
                token = await this.firebaseNative.getToken()
            } 
            if (this.platform.is('ios')) {
                token = await this.firebaseNative.getToken();
                const perm = await this.firebaseNative.grantPermission();
            } 
            if (!this.platform.is('cordova')) {
            }
        }catch(err){
            // alert(`Error obteniendo token: ${err}`);
        }    
        return token;
    }

    /**
     * Initialize required resources. Call after platform is ready.
     */
    public populate(): Observable<boolean> {
        return Observable.fromPromise(
            this.getToken()
        ).flatMap( token => {
            if(!token){
                return Observable.of(false);
            }
            // alert(token);
            return this.addDeviceToUser(
                token,
                { id: this.authService.userId, establishmentId: this.authService.establishmentId }
            ).map( resp  => {
                // alert('Success device!');
                this.listenToNotifications();
                return true;
            }).catch( err => {
                // alert( err );
                return Observable.of(false);
            })
        });
    }

    private addDeviceToUser(token,user): Observable<any> {
        let uuid= this.device.uuid;
        let device = {
            id            :this.device.uuid,
            model         :this.device.model,
            platform      :this.device.platform,
            version       :this.device.version,
            manufacturer  :this.device.manufacturer,
            serial        :this.device.serial,
            isVirtual     :this.device.isVirtual,
            add           :new Date(),
            token
        }
        return this.authService.post(
            `${this.appService.gateway}/api/users/${user.id}/devices`,
            { device, user } )
    }

    listenToNotifications() {

        this.firebaseNative.onNotificationOpen().subscribe( (msg) => {

            this.ngZone.run( () => {
                this.notifications.incrementUnreadCounter();
            });

    
            let messageText: string;
            let messageTitle: string;
            if (this.platform.is('android')) {
                messageText = msg.body;
                messageTitle = msg.title;
            }
            
            if (this.platform.is('ios')) {
                messageText = msg.aps.alert;
            }
            
            // console.log(messageTitle)
    
            //alert(messageTitle)
    
            this.localNotifications.schedule({
                title: messageTitle,
                text: messageText,
                foreground: true,
                smallIcon: msg.smallIcon || 'res://icon.png',
                icon: msg.icon || 'file://assets/images/icon.png'
            });     
        });
    }

}
