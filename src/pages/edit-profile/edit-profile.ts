import {Component} from '@angular/core';
import {NavController, Loading, LoadingController, AlertController} from 'ionic-angular';
import {UserService} from "../../services/user.service";
import {ProfilePage} from "../profile/profile";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import * as moment from "moment";

@Component({
    selector: 'page-edit-profile',
    templateUrl: 'edit-profile.html'
})
export class EditProfilePage {

    loading: Loading;

    user : any;
    userPhoto : any;

    gender = [{value: "F", label: "Mujer"}, {value: "M", label: "Hombre"}];

    constructor(
        public navCtrl: NavController,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private userService: UserService,
        public ga: GoogleAnalytics) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('editProfilePage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    getDataUser(){
        this.userService.getUser()
            .subscribe(
                success =>{
                    this.user = success[0];

                    //SET PHOTO
                    let photo = this.userService.photoUser;
                    if (photo === null || photo === "") {
                        this.userPhoto = "assets/images/user.png";
                    }
                    else {
                        this.userPhoto =  this.user.photo + '?r='+ Math.random();
                    }

                    //SET BIRTHDAY
                    if (this.user.birthDate === null || this.user.birthDate === "") {
                        this.user.birthDate = moment().format('YYYY-MM-DD');
                    }
                    else{
                        this.user.birthDate = moment(this.user.birthDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    }

                    //SET GENDER
                    if(this.user.gender === null){
                        this.user.gender = "";
                    }

                    console.log('USER', this.user);
                },
                error =>{
                    console.log('ERROR', error);
                }
            )
    }

    ionViewWillEnter(){
        this.getDataUser();
    }


    saveDataUser(){
        this.showLoading();

        this.userService.updateUser(this.user)
            .subscribe(
                success =>{
                    this.loading.dismiss();

                    let titleAlert = "¡Bien!";
                    let messageAlert = "Tus datos se guardaron satisfactoriamente";

                    let alert = this.alertCtrl.create({
                        title: `<img src="assets/images/success.png"> <h6>`+titleAlert+`</h6>`,
                        message: messageAlert,
                        buttons: [
                            { text: 'Ok',
                                handler: () => {
                                    this.navCtrl.popTo(ProfilePage);
                                }
                            }
                        ]
                    });
                    alert.present();

                },
                error =>{
                    this.loading.dismiss();
                    console.log('ERROR', error);
                }
            )
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Un momento...'
        });
        this.loading.present();
    }

}
