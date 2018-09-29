import {Component} from '@angular/core';
import {NavController, AlertController, Loading, LoadingController} from 'ionic-angular';
import {ProgressService} from "../../services/progress.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {PhysicalProgressPage} from "../physical-progress/physical-progress";
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'page-progress-detail',
    templateUrl: 'progress-detail.html'
})
export class ProgressDetailPage {

    loading: Loading;
    report: any;

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private progressService : ProgressService,
        public authService: AuthService,
        public ga: GoogleAnalytics) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('progressDetailPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        this.report = this.progressService.progressDetail;
        console.log('REPORTE', this.report);
    }

    deleteRecord(record){
        let alert = this.alertCtrl.create({
            title: `<img src="assets/images/error.png" class="icon-booking">
                    <p class="title-booking">¿ESTAS SEGURO DE HACER ESTO?</p>`,
            message: 'Eliminarás un registro de tu progreso',
            buttons: [
                {text: 'Cancelar'},
                {
                    text: 'Confirmar',
                    handler: () => {
                        this.showLoading();
                        this.progressService.delete(record)
                            .subscribe(
                                response =>{
                                    console.log('response', response);
                                    this.loading.dismiss();
                                    let alert = this.alertCtrl.create({
                                        title: `<img src="assets/images/success.png" class="icon-booking">
                                                <p class="title-booking">REGISTRO ELIMINADO</p>`,
                                        message: 'Tu registro se eliminó con éxito',
                                        buttons: [{
                                            text: 'Ok',
                                            handler: () => {this.navCtrl.popTo(PhysicalProgressPage)}
                                        }]
                                    });
                                    alert.present();
                                },
                                error =>{
                                    console.log('error', error);
                                    this.loading.dismiss();
                                    let alert = this.alertCtrl.create({
                                        title: `<img src="assets/images/sad-face.png" class="icon-booking">
                                                <p class="title-booking">Ups...</p>`,
                                        message: 'No se pudo eliminar tu registro',
                                        buttons: ['Ok']
                                    });
                                    alert.present();
                                }
                            )
                    }
                }
            ]
        });
        alert.present();
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Un momento...'
        });
        this.loading.present();
    }

}
