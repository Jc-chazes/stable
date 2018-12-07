import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {NotificationsService} from './../../services/notifications.service';
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import * as moment from "moment";
import {CommunicationsService} from "../../services/communications.service";

@Component({
    selector: 'page-communications',
    templateUrl: 'communications.html'
})
export class CommunicationsPage {
    new : Array<any> = [] ;
    segment = 'news';
    slides = [
        {
            image: "assets/images/img-promo.jpg",
        },
        {
            image: "assets/images/img-promo2.png",
        },
        {
            image: "assets/images/img-promo.jpg",
        },
        {
            image: "assets/images/img-promo2.png",
        }
    ];
    thereAreNotifications: boolean;
    listNotifications = [];
    posInitial = 1;

    constructor(public navCtrl: NavController,
                private notificationsService: NotificationsService,
                public communication : CommunicationsService,
                public ga: GoogleAnalytics) {

        moment.locale('es', {
            relativeTime: {
                future: 'en %s',
                past: 'Hace %s ',
                s:  'unos segundos',
                ss: '%sS',
                m:  'un minuto',
                mm: '%d Minutos',
                h:  'una hora',
                hh: '%d Horas',
                d:  'un día',
                dd: '%d días',
                M:  'Un Mes',
                MM: '%d meses',
                y:  'un Año',
                yy: '%d años'
            }
        });
        this.ga.startTrackerWithId('UA-76827860-10')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('notificationsPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter() {
        this.getNotifications();

        this.communication.getNewAll().subscribe(response =>{
          console.log(response);
        
          this.new = this.orderByNewPosition(response)
        })

    }

     orderByNewPosition(news) {
        return news.sort((a, b) => a.position - b.position );
      }
    getNotifications(infiniteScroll?) {
        this.notificationsService.getNotifications(this.posInitial)
            .subscribe(
                success => {
                    if (success.length != 0) {
                        this.posInitial++;
                        this.thereAreNotifications = true;
                        if(this.posInitial <= 1){
                            this.listNotifications = [];
                        }
                        for (let notify of success) {
                            notify.timeAgo = moment(notify.insDate).fromNow();
                            this.listNotifications.push(notify);
                        }
                        if (infiniteScroll) {
                            infiniteScroll.complete();
                            console.log(this.listNotifications);
                        }
                    }
                    else {
                        if (this.listNotifications.length < 1) {
                            this.thereAreNotifications = false;
                        } else {
                            this.thereAreNotifications = true;
                        }
                        if (infiniteScroll) {
                            infiniteScroll.complete();
                        }
                    }
                },
                error => {
                    console.error(JSON.stringify(error));
                }
            );
    }

}
