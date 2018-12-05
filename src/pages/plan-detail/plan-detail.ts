import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PlansService} from "../../services/plans.service";
import {FormPersonalDataPage} from "../form-personal-data/form-personal-data";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {AuthService} from "../../services/auth.service";
import { PayUService } from '../../services/payu.service';
import { CulqiService } from '../../services/culqi.service';

@Component({
    selector: 'page-plan-detail',
    templateUrl: 'plan-detail.html'
})
export class PlanDetailPage {

    plan : any;

    currency: string;

    constructor(
        public navCtrl: NavController,
        private plansService: PlansService,
        public ga: GoogleAnalytics,
        private authService: AuthService,
        private culqiService: CulqiService) {
        this.currency = localStorage.getItem('currencyCode');
    }

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('planDetailPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        this.plan = this.plansService.planDetail;
        console.log('PLAN', this.plan);
    }

    showFormPersonalData(){
        this.culqiService.planData = this.plan;
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackEvent('Market', 'planDetail - obtener', this.authService.userLogged.establishmentName+' / '+this.authService.establishmentId+' / '+this.plan.name, this.plan.price);
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));

        this.navCtrl.push(FormPersonalDataPage);
    }

}
