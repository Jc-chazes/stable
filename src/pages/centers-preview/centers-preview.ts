import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AuthService} from "../../services/auth.service";
import {EstablishmentsService} from "../../services/establishments.service";
import {TabsPage} from "../tabs/tabs";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {NotificationsService} from "../../services/notifications.service";
import { AppStateService } from '../../services/app-state.service';
@Component({
    selector: 'page-centers-preview',
    templateUrl: 'centers-preview.html'
})
export class CentersPreviewPage {

    establishments : any;

    constructor(
        public navCtrl: NavController,
        private authService: AuthService,
        private establishmentService: EstablishmentsService,
        public ga: GoogleAnalytics,
        private notificationsService: NotificationsService,
        private appStateService: AppStateService) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('centersPreviewPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        this.establishments = this.establishmentService.establishmentsByUser;
    }

    selectedEstablishment(establishment){
        this.establishmentService.selectedEstablishmentId = establishment.establishmentId;

        this.authService.userId = establishment.id;
        this.authService.userLogged = establishment;
        this.authService.establishmentId = establishment.establishmentId;
        this.authService.statusPhysicalConditionsRegister = establishment.statusPhysicalConditionsRegister;
        this.authService.statusSchedule = establishment.statusSchedule;

        this.establishmentService.currentEstablishment.setEstablishmentDataInLocalStorage(establishment);
        if(establishment.statusNotificationMobile == 'Y'){
          this.notificationsService.getUnreadNotifications()
          .subscribe(
              success => {

                localStorage.setItem('unreadNotificationsCount', success.unread);
                this.appStateService.setState({
                  notifications: {
                    unreadCount: success.unread
                } });
              },
              error => {
                  let err = error.json();

              });
        }
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackEvent('Usuario', 'inicia sesión', this.authService.userLogged.establishmentName + ' / ' + this.authService.establishmentId);
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));

        this.navCtrl.setRoot(TabsPage);
    }

}
