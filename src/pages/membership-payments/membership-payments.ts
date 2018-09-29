import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MembershipsService} from "../../services/memberships.service";
import {PaymentsService} from "../../services/payments.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import * as moment from "moment";

@Component({
    selector: 'page-membership-payments',
    templateUrl: 'membership-payments.html'
})
export class MembershipPaymentsPage {

    payments : any;
    thereArePayments : boolean;
    currency: string;

    constructor(
        public navCtrl: NavController,
        private membershipsService: MembershipsService,
        private paymentsService: PaymentsService,
        public ga: GoogleAnalytics) {
        this.currency = localStorage.getItem('currencyCode');
    }

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('membershipPaymentsPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        let membership = this.membershipsService.membershipDetail;

        this.paymentsService.getPaymentsByMembership(membership.id)
            .subscribe(
                success =>{
                    let data = success;

                    if(data.length > 0){
                        let arr = [];
                        for(let i of data){
                            i.date = moment(i.date, 'DD-MM-YYYY').format('DD/MM/YYYY');
                            arr.push(i);
                        }
                        this.payments = arr;
                        this.thereArePayments = true;
                    }
                    else{
                        this.thereArePayments = false;
                    }
                },
                error =>{
                    this.thereArePayments = false;
                }
            );
    }

}
