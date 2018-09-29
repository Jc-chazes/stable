import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MembershipsService} from "../../services/memberships.service";
import {MembershipPaymentsPage} from "../membership-payments/membership-payments";
import {MembershipFreezesPage} from "../membership-freezes/membership-freezes";
import {MembershipAttendancesPage} from "../membership-attendances/membership-attendances";
import {GoogleAnalytics} from "@ionic-native/google-analytics";

@Component({
    selector: 'page-membership-detail',
    templateUrl: 'membership-detail.html'
})
export class MembershipDetailPage {

    membership : any;

    tabAttendances = MembershipAttendancesPage;
    tabPayments = MembershipPaymentsPage;
    tabFreezes = MembershipFreezesPage;

    currency: string;

    constructor(
        public navCtrl: NavController,
        private membershipsService: MembershipsService,
        public ga: GoogleAnalytics) {
        this.currency = localStorage.getItem('currencyCode');
    }

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('membershipDetailPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        this.membership = this.membershipsService.membershipDetail;
    }

}
