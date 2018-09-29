import {Component} from '@angular/core';
import {NavController, App, ActionSheetController} from 'ionic-angular';
import {UserService} from "../../services/user.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";


@Component({
    selector: 'page-qrcode',
    templateUrl: 'qr-code.html'
})
export class QrCodePage {
    qrData = null;
    createdCode = null;
    user : any;

    constructor(
        public appCtrl: App,
        public ga: GoogleAnalytics,
        public navCtrl: NavController,
        public actionsheetCtrl: ActionSheetController,
        private userService: UserService) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('qrCodePage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
        console.log('INICIo');

    }


    createCode() {
        this.createdCode = this.qrData;
        console.log(this.qrData)
    }


    getDataUser(){
        this.userService.getUser()
            .subscribe(
                success =>{
                    this.user = success[0];
                    this.qrData = '' + this.user.id;
                    console.log(this.qrData);
                    this.createCode();
                },
                error =>{
                    console.log('ERROR', error);
                }
            );
    }


    ionViewWillEnter(){
        this.getDataUser();
    }




}
