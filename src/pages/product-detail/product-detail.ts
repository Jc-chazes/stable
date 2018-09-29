import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FormPersonalDataPage} from "../form-personal-data/form-personal-data";
import {GoogleAnalytics} from "@ionic-native/google-analytics";

@Component({
    selector: 'page-product-detail',
    templateUrl: 'product-detail.html'
})
export class ProductDetailPage {

    constructor(
        public navCtrl: NavController,
        public ga: GoogleAnalytics) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('productDetailPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    showFormPersonalData(){
        console.log('HOLAS');
        this.navCtrl.push(FormPersonalDataPage);
    }

}
