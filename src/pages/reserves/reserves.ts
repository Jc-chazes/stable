import {Component} from '@angular/core';
import {NavController, Loading, LoadingController} from 'ionic-angular';
import {ReserveDetailPage} from "../reserve-detail/reserve-detail";
import {ReservesService} from "../../services/reserves.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import * as moment from 'moment';

@Component({
    selector: 'page-reserves',
    templateUrl: 'reserves.html'
})
export class ReservesPage {
    loading: Loading;
    showFunctionLoading: boolean = false;

    reservesFuture: any[] = [];
    reservesPassed: any[] = [];

    statusBooking: string;
    statusRatingLessons: string;
    segment: string = 'future';
    shareBD: boolean = false;
    constructor(
        public navCtrl: NavController,
        private loadingCtrl: LoadingController,
        private reservesService: ReservesService,
        public ga: GoogleAnalytics) {
    }

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('reservesPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        this.statusBooking = localStorage.getItem('statusSchedule');
        this.statusRatingLessons = localStorage.getItem('statusRatingLessons');
        if (this.reservesFuture.length == 0 || this.reservesPassed.length == 0) {
            this.showFunctionLoading = true;
            this.showLoading();
        }
        this.shareBD = localStorage.getItem('statusShareBD') == 'Y' ? true : false;
        this.getReserves();

    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Un momento...'
        });
        this.loading.present();
    }

    getReserves(){
        this.reservesFuture = [];
        this.reservesPassed = [];

        this.reservesService.getReserves()
            .subscribe(
                success =>{
                    if(this.showFunctionLoading){
                        this.loading.dismiss();
                    }
                    let data = success;

                    if (data.length > 0) {
                        for(let i of data) {
                            let item = {
                                data: i,
                                id: i.id,
                                date: moment(i.startDate).format('DD/MM/YYYY'),
                                hour: moment(i.startDate).format('hh:mm a'),
                                discipline: i.disciplineName,
                                instructorName: i.instructorName,
                                stars: ['star-outline','star-outline','star-outline','star-outline','star-outline'],
                                comment: i.comment,
                                type: i.type,
                                establishmentName: i.establishmentName
                            };

                            if(moment(i.startDate, 'YYYY-MM-DD HH:mm:ss').format() >= moment().format()){
                                this.reservesFuture.push(item);
                            } else {
                                this.reservesPassed.push(item);
                                this.paintStars(item, item.data.score);
                            }
                        }

                        if (this.reservesFuture.length > 0) {
                            this.reservesFuture.sort(
                                (a, b) => {
                                    const aDate = moment(a.date, 'DD/MM/YYYY');
                                    const bDate = moment(b.date, 'DD/MM/YYYY');

                                    if (aDate.isBefore(bDate)) {
                                        return -1;
                                    }

                                    if (aDate.isAfter(bDate)) {
                                        return 1;
                                    }

                                    return 0;
                                }
                            );
                        }

                        if (this.reservesPassed.length > 0) {
                            this.reservesPassed.sort(
                                (a, b) => {
                                    const aDate = moment(a.date, 'DD/MM/YYYY');
                                    const bDate = moment(b.date, 'DD/MM/YYYY');

                                    if (aDate.isBefore(bDate)) {
                                        return 1;
                                    }

                                    if (aDate.isAfter(bDate)) {
                                        return -1;
                                    }

                                    return 0;
                                }
                            );
                        }
                    }
                },
                error =>{
                    if(this.showFunctionLoading){
                        this.loading.dismiss();
                    }
                }
            )
    }

    viewDetail(reserve){
        this.reservesService.reserveDetail = reserve;
        this.navCtrl.push(ReserveDetailPage);
    }

    paintStars(reserve, score){
        reserve.stars = ['star-outline','star-outline','star-outline','star-outline','star-outline'];
        for(let item in reserve.stars){
            if(parseInt(item) < score){
                reserve.stars[item] = 'star';
            }
        }
    }

    setScore(reserve, score) {
        let cont = 0;
        for (let star of reserve.stars) {
            if (star != 'star') {
                cont++;
            }
        }

        if (cont == 5) {
            this.reservesService.sendRaiting(reserve.id, {'score': score})
                .subscribe(
                    success => {
                        this.paintStars(reserve,score);
                    },
                    error => {
                        console.log('error', error);
                    }
                );
        } else {
            console.log('YA ESTÁ CALIFICADO');
        }
    }

}
