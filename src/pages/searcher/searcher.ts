import {Component} from '@angular/core';
import {NavController, Loading, LoadingController, AlertController} from 'ionic-angular';
import {UserService} from "../../services/user.service";
import {EstablishmentsService} from "../../services/establishments.service";
import {AuthService} from "../../services/auth.service";
import {CentersPreviewPage} from "../centers-preview/centers-preview";
import {OnboardingPage} from "../onboarding/onboarding";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {LoginPage} from "../login/login";
import {NotificationsService} from "../../services/notifications.service";
import { AppStateService } from '../../services/app-state.service';
@Component({
    selector: 'page-searcher',
    templateUrl: 'searcher.html'
})
export class SearcherPage {

    establishments: any;
    arrEstablishments: any;

    loading: Loading;

    constructor(
        public ga: GoogleAnalytics,
        public navCtrl: NavController,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private authService: AuthService,
        private userService: UserService,
        private establishmentService: EstablishmentsService,
        private notificationsService: NotificationsService,
        private appStateService: AppStateService) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('searcherPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        this.getEstablishments();
    }

    getEstablishments(){
        this.establishmentService.getAllEstablishments()
            .subscribe(
                success =>{
                    let data = [];
                    for(let item of success){
                        if(item.statusApp === "Y"){
                            data.push(item);
                        }
                    }
                    this.arrEstablishments = data;
                },
                error =>{
                    console.log('ERROR', error);
                }
            );
    }

    searchEstablishment(ev: any) {
        // Reset items back to all of the items
        this.establishments = this.arrEstablishments;

        // set val to the value of the searchbar
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if(this.establishments){
            if (val && val.trim() != '') {
                this.establishments = this.establishments.filter((establishment) => {
                    return (establishment.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
                })
            }
            else if(val == '' || val === undefined){
                this.establishments = [];
            }
        }
        else{
            this.getEstablishments();
        }

    }

    clearEstablishments(ev: any){
        this.establishments = [];
    }

    chooseEstablishment(establishment){
        let alert = this.alertCtrl.create({
            title: establishment.name,
            message: '¿Quieres registrarte en ' + establishment.name + ' ?',
            buttons: [
                {
                    text: 'Cancelar'
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        this.showLoading();

                        let newBody = {
                            name: this.userService.userDataToCreate.name,
                            lastName: this.userService.userDataToCreate.lastName,
                            email: this.userService.userDataToCreate.email,
                            password: this.userService.userDataToCreate.password,
                            establishmentId: establishment.id,
                            roleId: 5
                        };

                        this.userService.createFinalUser(newBody)
                            .subscribe(
                                response =>{
                                    let user = {
                                        email: this.userService.userDataToCreate.email,
                                        password: this.userService.userDataToCreate.password
                                    };

                                    this.authService.login(user)
                                        .subscribe(
                                            success =>{
                                                this.loading.dismiss();
                                                if(success.data.length > 0){
                                                    localStorage.setItem( 'id_token', success.token);

                                                    if(success.data.length == 1){
                                                        this.authService.userId = success.data[0].id;
                                                        this.authService.userLogged = success.data[0];
                                                        this.authService.establishmentId = success.data[0].establishmentId;
                                                        this.authService.statusPhysicalConditionsRegister = success.data[0].statusPhysicalConditionsRegister;
                                                        this.authService.statusSchedule = success.data[0].statusSchedule;

                                                        this.establishmentService.establishmentsByUser = success.data;
                                                        this.establishmentService.selectedEstablishmentId = success.data[0].establishmentId;

                                                        localStorage.setItem('userLogged',JSON.stringify(success.data[0]));
                                                        localStorage.setItem('establishmentSelected', success.data[0].establishmentId);
                                                        localStorage.setItem('statusWaitingList', success.data[0].statusWaitingList);
                                                        localStorage.setItem('statusPhysicalConditionsRegister', success.data[0].statusPhysicalConditionsRegister);
                                                        localStorage.setItem('statusSchedule', success.data[0].statusSchedule);
                                                        localStorage.setItem('statusUploadPhotoProgress', success.data[0].statusUploadPhotoProgress);
                                                        localStorage.setItem('statusRatingLessons', success.data[0].statusRatingLessons);
                                                        localStorage.setItem('QR', success.data[0].QRApp);
                                                        localStorage.setItem('statusLimitMembershipTest', success.data[0].statusLimitMembershipTest);
                                                        localStorage.setItem('statusNotificationMobile', establishment.statusNotificationMobile);
                                                        if(establishment.statusNotificationMobile == 'Y'){
                                                          this.notificationsService.getUnreadNotifications()
                                                          .subscribe(
                                                              success => {

                                                                localStorage.setItem('unreadNotificationsCount', success.unread);
                                                                this.appStateService.setState({
                                                                  notifications: {
                                                                    unreadCount: success.unread
                                                                } });
                                                              },
                                                              error => {
                                                                  let err = error.json();

                                                              });
                                                        }
                                                        this.ga.startTrackerWithId('UA-76827860-8')
                                                            .then(() => {
                                                                console.log('Google analytics is ready now');
                                                                this.ga.trackEvent('Usuario', 'se registra', this.authService.userLogged.establishmentName + ' / '+ this.authService.establishmentId);
                                                            })
                                                            .catch(e => console.log('Error starting GoogleAnalytics', e));

                                                        this.navCtrl.push(OnboardingPage);
                                                    }
                                                    else if(success.data.length > 1){
                                                        this.establishmentService.establishmentsByUser = success.data;
                                                        this.navCtrl.setRoot(CentersPreviewPage);
                                                    }
                                                }
                                                else if(success.data.length == 0){
                                                    this.navCtrl.push(SearcherPage);
                                                }
                                            },
                                            error=>{
                                                this.loading.dismiss();

                                                let err = error.json();
                                                let message = "";

                                                switch (err.title) {
                                                    case "ERROR_DB_BODY":
                                                        message = "Error de conexión";
                                                        break;
                                                    case "USER_NO_FOUND":
                                                        message = "Hubo un problema al momento de iniciar sesión. Por favor comunicate con nosotros por Facebook para poder ayudarte";
                                                        break;
                                                    case "CLIENTES.ALERTAS.USER_NO_FOUND":
                                                        message = "Usuario no encontrado";
                                                        break;
                                                }

                                                let alert = this.alertCtrl.create({
                                                    title: `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">`+'Ups...'+`</h6>`,
                                                    message: message,
                                                    buttons: ['OK']
                                                });
                                                alert.present();
                                            }
                                        );
                                },
                                error =>{
                                    this.loading.dismiss();

                                    let err = error.json();
                                    let title = "";
                                    let message = "";
                                    let buttons = [];

                                    switch (err.title) {
                                        case "ERROR_DB_BODY":
                                            title = `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">`+''+`</h6>`;
                                            message = "Por favor verifica tu conexión a internet e intentalo nuevamente";
                                            buttons = ['OK'];
                                            break;
                                        case "CLIENTES.ERROR.USUARIO_DUPLICADO_TITULO":
                                            title = `<img src="assets/images/icon-hand.png" class="icon-booking"> <h6 class="title-booking">`+'¡HOLA!'+`</h6>`;
                                            message = "Ya te encuentras registrado en este establecimiento. Por favor contáctate con ellos y solicita tus accesos";
                                            buttons = [
                                                {text: 'OK'},
                                                {
                                                    text: 'Iniciar Sesión',
                                                    handler: () => {this.navCtrl.setRoot(LoginPage)}
                                                }
                                            ];
                                            break;
                                    }

                                    let alert = this.alertCtrl.create({
                                        title: title,
                                        subTitle: message,
                                        buttons: buttons
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
            content: 'Un momento...',
            enableBackdropDismiss: false
        });
        this.loading.present();
    }

}
