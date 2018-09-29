import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MembershipsService} from "../../services/memberships.service";
import {FreezesService} from "../../services/freezes.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";

@Component({
    selector: 'page-membership-freezes',
    templateUrl: 'membership-freezes.html'
})
export class MembershipFreezesPage {

    freezes : any;
    thereAreFreezes : boolean;

    constructor(
        public navCtrl: NavController,
        private membershipsService: MembershipsService,
        private freezesService: FreezesService,
        public ga: GoogleAnalytics) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('membershipFreezesPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        let membership = this.membershipsService.membershipDetail;

        this.freezesService.getFreezesByMembership(membership.id)
            .subscribe(
                success =>{
                    let data = success;

                    if(data.length > 0){
                        this.freezes = data;
                        this.thereAreFreezes = true;
                    }
                    else{
                        this.thereAreFreezes = false;
                    }
                },
                error =>{
                    this.thereAreFreezes = false;
                }
            );
    }

}
