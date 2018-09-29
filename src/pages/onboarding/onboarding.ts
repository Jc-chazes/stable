import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {TabsPage} from "../tabs/tabs";

@Component({
    selector: 'page-onboarding',
    templateUrl: 'onboarding.html'
})
export class OnboardingPage {

    constructor(
        public navCtrl: NavController,
        public ga: GoogleAnalytics) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('onboardingPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    goToSchedule(){
        this.navCtrl.setRoot(TabsPage);
    }


}
