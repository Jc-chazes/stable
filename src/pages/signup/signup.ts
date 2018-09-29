import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {UserService} from "../../services/user.service";
import {SearcherPage} from "../searcher/searcher";
import {GoogleAnalytics} from '@ionic-native/google-analytics';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignupPage {

    newUser : any = {
        name : "",
        lastName : "",
        email : "",
        password: ""
    };

    aceptTerms: boolean = false;

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        private userService: UserService,
        public ga: GoogleAnalytics) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('signupPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    validateData(){
        const regexEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if(this.newUser.name == "" || this.newUser.lastName == "" || this.newUser.email == "" || this.newUser.password == ""){
            let alert = this.alertCtrl.create({
                title: '¡Uy...!',
                message: 'Por favor completa todos los campos',
                buttons: ['OK']
            });
            alert.present();

        }
        else if(!regexEmail.test(this.newUser.email)){
            let alert = this.alertCtrl.create({
                title: '¡Uy...!',
                message: 'Por favor ingresa un correo electrónico válido',
                buttons: ['OK']
            });
            alert.present();
        }
        else if(this.aceptTerms == false){
            let alert = this.alertCtrl.create({
                title: '¡Uy...!',
                message: 'Por favor acepta los términos y condiciones para poder continuar',
                buttons: ['OK']
            });
            alert.present();
        }
        else{
            this.userService.userDataToCreate = this.newUser;
            this.navCtrl.push(SearcherPage);
        }
    }

    clicCheckbox(){
        console.log('Aceptó los términos y condiciones?',this.aceptTerms);
    }
}
