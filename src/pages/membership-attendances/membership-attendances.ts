import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MembershipsService} from "../../services/memberships.service";
import {AttendancesService} from "../../services/attendances.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import * as moment from 'moment';

@Component({
    selector: 'page-membership-attendances',
    templateUrl: 'membership-attendances.html'
})
export class MembershipAttendancesPage {

    attendances : any;
    thereAreAttendances : boolean;

    constructor(
        public navCtrl: NavController,
        private membershipsService: MembershipsService,
        private attendancesService: AttendancesService,
        private ga: GoogleAnalytics) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('membershipAttendancesPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        let membership = this.membershipsService.membershipDetail;

        this.attendancesService.getAttendancesByMembership(membership.id)
            .subscribe(
                success =>{
                    let data = success;

                    if(data.length > 0){
                        let arr = [];
                        for (let i of data){
                            i.dateLesson = moment(i.dateLesson, 'DD-MM-YYYY').format('DD/MM/YYYY');
                            i.startTime = moment(i.startTime, 'hh:mm:ss').format('hh:mm a');

                            arr.push(i);
                        }
                        this.attendances = arr;
                        this.thereAreAttendances = true;
                    }
                    else{
                        this.thereAreAttendances = false;
                    }
                },
                error =>{
                    this.thereAreAttendances = false;
                }
            );
    }

}
