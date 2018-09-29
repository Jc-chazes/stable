import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PhysicalProgressPage} from "../physical-progress/physical-progress";
import {GoogleAnalytics} from "@ionic-native/google-analytics";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
      public navCtrl: NavController,
      public ga: GoogleAnalytics) {}

  ionViewDidEnter(){
      this.ga.startTrackerWithId('UA-76827860-8')
          .then(() => {
              console.log('Google analytics is ready now');
              this.ga.trackView('statusFitPage');
          })
          .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  showPhysicalProgress(){
    this.navCtrl.push(PhysicalProgressPage);
  }

}
