import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DebtsService} from "../../services/debts.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import * as moment from "moment";

@Component({
    selector: 'page-debts',
    templateUrl: 'debts.html'
})
export class DebtsPage {

    selectedList : string = 'memberships';

    membershipsDebts : any;
    productsDebts : any;
    lessonsDebts: any;

    thereAreMembershipsDebts : boolean;
    thereAreProductsDebts : boolean;
    thereAreLessonsDebts: boolean;

    currency: string;

    constructor(
        public navCtrl: NavController,
        private debtsService: DebtsService,
        public ga: GoogleAnalytics) {
        this.currency = localStorage.getItem('currencyCode');
    }

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('debtsPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        this.getMembershipsDebts();
        this.getProductsAndLessonsDebts();
    }

    getMembershipsDebts(){
        this.debtsService.getMembershipsDebts()
            .subscribe(
                success =>{
                    let data = success;

                    if(data.length > 0){
                        this.membershipsDebts = data;
                        this.thereAreMembershipsDebts = true;
                    }
                    else{
                        this.thereAreMembershipsDebts = false;
                    }
                },
                error =>{
                    console.log('ERROR', error);
                    this.thereAreMembershipsDebts = false;
                }
            );
    }

    getProductsAndLessonsDebts(){
        this.debtsService.getProductsAndLessonsDebts()
            .subscribe(
                success =>{
                    let res = success;

                    if(res.length > 0){
                        let products = [];
                        let lessons = [];

                        for(let i of res){
                            i.insDate = moment(i.insDate).format('DD/MM/YYYY');

                            if(i.stockId){
                                products.push(i);
                            }
                            else if(i.lessonRecordId){
                                lessons.push(i);
                            }
                        }

                        if(products.length > 0){
                            this.productsDebts = products;
                            this.thereAreProductsDebts = true;
                        }
                        else{
                            this.thereAreProductsDebts = false;
                        }

                        if(lessons.length > 0){
                            this.lessonsDebts = lessons;
                            this.thereAreLessonsDebts = true;
                        }
                        else{
                            this.thereAreLessonsDebts = false;
                        }
                    }

                },
                error =>{
                    console.log('ERROR', error);
                }
            )
    }

}
