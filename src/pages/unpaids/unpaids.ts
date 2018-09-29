import {Component} from '@angular/core';
import {NavController, Loading, LoadingController} from 'ionic-angular';
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {LessonsService} from "../../services/lessons.service";

@Component({
    selector: 'page-unpaids',
    templateUrl: 'unpaids.html'
})
export class UnpaidsPage {

    loading: Loading;

    unpaids: any[];
    thereAreUnpaids: boolean;

    currency: string;

    constructor(
        public navCtrl: NavController,
        private loadingCtrl: LoadingController,
        private lessonsService: LessonsService,
        public ga: GoogleAnalytics) {
        this.currency = localStorage.getItem('currencyCode');
    }

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('unpaidsPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        this.getUnpaids();
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Un momento...'
        });
        this.loading.present();
    }

    getUnpaids(){
        this.showLoading();

        this.lessonsService.getUnpaidLessons()
            .subscribe(
                success =>{
                    this.loading.dismiss();
                    let data = success;

                    if(data.length > 0){
                        this.unpaids = data;
                        this.thereAreUnpaids = true;
                    }
                    else{
                        this.thereAreUnpaids = false;
                    }
                },
                error =>{
                    this.loading.dismiss();
                    this.thereAreUnpaids = false;

                }
            )
    }
}