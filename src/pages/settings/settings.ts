import {Component} from '@angular/core';
import {App, NavController, AlertController} from 'ionic-angular';
import {AuthService} from "../../services/auth.service";
import {LoginPage} from "../login/login";
import {PasswordPage} from "../password/password";
import {GoogleAnalytics} from '@ionic-native/google-analytics';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})

export class SettingsPage {
    version = 0.3;    
    constructor(
        public app : App,
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        private authService: AuthService,
        public ga: GoogleAnalytics) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('settingsPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    goToPassword(){
        this.navCtrl.push(PasswordPage);
    }

    logout(){
        let alert = this.alertCtrl.create({
            title: 'Cerrar Sesión',
            message: '¿Estás seguro que deseas cerrar sesión?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        this.ga.startTrackerWithId('UA-76827860-8')
                            .then(() => {
                                console.log('Google analytics is ready now');
                                this.ga.trackEvent('Usuario', 'cierra sesión', this.authService.userLogged.establishmentName + ' / '+this.authService.establishmentId);
                            })
                            .catch(e => console.log('Error starting GoogleAnalytics', e));

                        this.authService.logout();
                        this.app.getRootNav().setRoot(LoginPage);
                    }
                }
            ]
        });
        alert.present();
    }

}
