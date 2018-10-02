import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {NotificationsService} from './../../services/notifications.service';
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import * as moment from "moment";
import { AppStateService } from '../../services/app-state.service';

@Component({
    selector: 'page-notifications',
    templateUrl: 'notifications.html'
})
export class NotificationsPage {

    thereAreNotifications: boolean;
    listNotifications = [];
    posInitial = 1;
    searchWord = '';
    shownGroup = null;
    constructor(public navCtrl: NavController,
                private notificationsService: NotificationsService,
                public ga: GoogleAnalytics,
                private appState: AppStateService) {

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
    }

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('notificationsPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
        this.notificationsService.getUnreadNotifications().subscribe();
    }

    ionViewWillEnter() {
        this.posInitial = 1;
        this.searchWord = null;
        this.listNotifications = [];
        this.getNotifications();
    }

    getNotifications(infiniteScroll?) {
        // this.listNotifications = [];
        this.listNotifications =  this.searchWord != null && this.searchWord != undefined ?  [] : this.listNotifications;
        this.posInitial = this.searchWord != null && this.searchWord != undefined ? 1 : this.posInitial ;
        this.notificationsService.getNotifications(this.posInitial,this.searchWord)
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
                }, () => {
                    () => {
                    }
                }
            );
    }


    searchNotification(ev: any,infiniteScroll?){
      let val = ev.target.value;
      this.listNotifications = [];
      this.posInitial = 1;
      if(val){
        this.notificationsService.searchNotification(val)
        .subscribe(
            response =>{

              if (response.length != 0) {
                this.posInitial++;
                this.thereAreNotifications = true;
                if(this.posInitial <= 1){
                    this.listNotifications = [];
                }
                for (let notify of response) {
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
            error =>{
            }
        )
      }else{

        this.getNotifications();
      }
    }

    clearNotification(ev: any){
      this.posInitial = 1;
      this.listNotifications = [];

    }

    toggleGroup(group) {

        if (this.isGroupShown(group)) {
            this.shownGroup = null;
        } else {
            this.shownGroup = group;
            if(this.listNotifications[group].statusNtUser == '0'){
              if(localStorage.getItem('statusNotificationMobile') == 'Y'){
                this.notificationsService.updateNotificationStatus(this.listNotifications[group].notificationUserId)
                .subscribe(
                    success => {
                      this.notificationsService.decrementUnreadCounter();
                      this.listNotifications[group].statusNtUser = '1';
                    },
                    error => {


                    });
              }
            }
        }


    }


    isGroupShown(group) {
        return this.shownGroup === group;
    }


  }
