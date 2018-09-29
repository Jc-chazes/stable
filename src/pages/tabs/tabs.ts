import {Component, ViewChild} from '@angular/core';
import { Tabs, Events } from 'ionic-angular';
import {SchedulePage} from "../schedule/schedule";
import {ShopPage} from "../shop/shop";
import {HomePage} from '../home/home';
import {NotificationsPage} from '../notifications/notifications';
import {ManagmentPage} from "../managment/managment";
// para el manejo de las notificaciones
// declare var Pusher: any;
import {LocalNotifications} from '@ionic-native/local-notifications';
import {AuthService} from "./../../services/auth.service";
import {NavController} from 'ionic-angular';
import { AppStateService } from '../../services/app-state.service';
import { DevicesService } from '../../services/devices.service';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = SchedulePage;
    tab2Root = ShopPage;
    tab3Root = HomePage;
    tab4Root = NotificationsPage;
    tab5Root = ManagmentPage;
    // pusher: any;
    cont = 0;
    urlNotification = "";
    notificationCount = 0;

    appState: any;

    @ViewChild("nametab") nametab: Tabs;

    constructor(private localNotifications: LocalNotifications,
                public navCtrl: NavController,
                public events: Events,
                private authService: AuthService,
                private appStateService: AppStateService,
                private devices: DevicesService) {

        this.appStateService.onStateChange.subscribe( state => {
          this.notificationCount = state.notifications.unreadCount;
        });
        this.appStateService.setState({
          notifications: {
            unreadCount: localStorage.getItem('unreadNotificationsCount')
        } });


    }

    ionViewDidLoad(){
        this.devices.populate().subscribe();
        this.events.subscribe('gototab', () => {
            this.nametab.select(2);
        })
    }


}
