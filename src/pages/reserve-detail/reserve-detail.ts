import {Component} from '@angular/core';
import {NavController, AlertController, Loading, LoadingController} from 'ionic-angular';
import {ReservesService} from "../../services/reserves.service";
import {ReservesPage} from "../reserves/reserves";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {AuthService} from "../../services/auth.service";
import * as moment from "moment";

@Component({
    selector: 'page-reserve-detail',
    templateUrl: 'reserve-detail.html'
})
export class ReserveDetailPage {

    loading: Loading;
    reserve: any;
    showBtnDelete: boolean;
    statusRatingLessons: string;
    showSectionComment: boolean;
    comment = '';

    constructor(
        public navCtrl: NavController,
        private alertCtrl : AlertController,
        private loadingCtrl : LoadingController,
        private reservesService: ReservesService,
        private authService: AuthService,
        public ga: GoogleAnalytics) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('reserveDetailPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        this.reserve = this.reservesService.reserveDetail;
        this.statusRatingLessons = localStorage.getItem('statusRatingLessons');
        this.showBtnDelete = (moment(this.reserve.data.startDate, 'YYYY-MM-DD HH:mm:ss').format() >= moment().format());
    }

    deleteReserve(){
        let alert = this.alertCtrl.create({
            title: `<img src="assets/images/error.png" class="icon-booking">
                    <p class="title-booking">¿ESTAS SEGURO DE HACER ESTO?</p>`,
            subTitle: 'Eliminarás tu clase reservada.',
            buttons: [
                {text: 'Cancelar'},
                {
                    text: 'Confirmar',
                    handler: () => {
                        this.showLoading();

                        let lessonRecordId = this.reserve.data.lessonRecordId;
                        let reserveId = this.reserve.data.id;

                        this.reservesService.deleteReserve(lessonRecordId, reserveId)
                            .subscribe(
                                success =>{
                                    this.loading.dismiss();

                                    this.ga.startTrackerWithId('UA-76827860-8')
                                        .then(() => {
                                            console.log('Google analytics is ready now');
                                            this.ga.trackEvent('Reservas', 'eliminar', this.authService.userLogged.establishmentName+' / '+ this.authService.establishmentId +' / '+this.reserve.discipline , 1);
                                        })
                                        .catch(e => console.log('Error starting GoogleAnalytics', e));

                                    let alert = this.alertCtrl.create({
                                        title: `<img src="assets/images/success.png" class="icon-booking"> <h6 class="title-booking">`+'Reserva Eliminada'+`</h6>`,
                                        subTitle: 'Tu reserva se eliminó con éxito',
                                        buttons: [{
                                            text: 'OK',
                                            handler: () => {this.navCtrl.popTo(ReservesPage)}
                                        }]
                                    });
                                    alert.present();
                                },
                                error =>{
                                    this.loading.dismiss();
                                    let err = error.json();
                                    let message = "";

                                    switch (err.msgApp) {
                                        case "GLOBAL.ERROR_TITULO":
                                            message = "Por favor verifica tu conexión e intentalo nuevamente.";
                                            break;
                                        case "DISCARD_LESSON_LIMIT":
                                            message = "El límite de tiempo para cancelar tu reserva fue superado.";
                                            break;
                                        case "RESERVE_ERROR_LIMIT":
                                            var limitText = moment.duration(err.limit, "minutes").asHours();
                                            message = "Tu centro permite cancelar la reserva hasta con "+limitText+" horas de anticipación. Si se trata de un caso excepcional comunicate con ellos por favor";
                                            break;
                                        case "DISCIPLINAS.ELIMINAR":
                                            message = "No se puede eliminar esta disciplina, por estar asociado a información del cliente.";
                                            break;
                                    }

                                    let alert = this.alertCtrl.create({
                                        title: `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">`+'No se pudo eliminar la reserva'+`</h6>`,
                                        subTitle: message,
                                        buttons: ['OK']
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

    paintStars(reserve, score){
        reserve.stars = ['star-outline','star-outline','star-outline','star-outline','star-outline'];
        for(let item in reserve.stars){
            if(parseInt(item) < score){
                reserve.stars[item] = 'star';
            }
        }
    }

    setScore(reserve, score) {
        let cont = 0;
        for (let star of reserve.stars) {
            if (star != 'star') {
                cont++;
            }
        }

        if (cont == 5) {
            this.reservesService.sendRaiting(reserve.id, {'score': score})
                .subscribe(
                    success => {
                        this.paintStars(reserve,score);
                    },
                    error => {
                        console.log('error', error);
                    }
                );
        } else {
            console.log('YA ESTÁ CALIFICADO');
        }
    }

    showSetComment(){
        this.showSectionComment = true;
    }

    hideSetComment(){
        this.comment = '';
        this.showSectionComment = false;
    }

    setComment(){
        this.reservesService.sendComment(this.reserve.id, {'comment': this.comment})
            .subscribe(
                success => {
                    let alert = this.alertCtrl.create({
                        title: `<img src="assets/images/success.png"> <h6 class="title-booking">` + '¡GRACIAS!' + `</h6>`,
                        message: 'Tu comentario es muy importante para nosotros',
                        buttons: [
                            {
                                text: 'Ok',
                                handler: () => {
                                    this.navCtrl.popTo(ReservesPage);
                                }
                            }
                        ]
                    });
                    alert.present();

                },
                error => {

                }
            )
    }
}
