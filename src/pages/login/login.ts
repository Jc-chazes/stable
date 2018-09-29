import {Component} from '@angular/core';
import {NavController, Loading, LoadingController, AlertController} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {AuthService} from "../../services/auth.service";
import {EstablishmentsService} from "../../services/establishments.service";
import {CentersPreviewPage} from "../centers-preview/centers-preview";
import {SearcherPage} from "../searcher/searcher";
import {SignupPage} from "../signup/signup";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {NotificationsService} from "../../services/notifications.service";
import { AppStateService } from '../../services/app-state.service';
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    loading: Loading;
    user : any = {
        email : "",
        password: ""
    };

    constructor(
        public navCtrl: NavController,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private authService: AuthService,
        private establishmentService: EstablishmentsService,
        public ga: GoogleAnalytics,
        private notificationsService: NotificationsService,
        private appStateService: AppStateService) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('loginPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    validateLogin(){
        const regexEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if(this.user.email == "" || this.user.password == ""){
            let alert = this.alertCtrl.create({
                title: `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">`+'Uy...'+`</h6>`,
                message: 'Por favor completa los campos',
                buttons: ['OK']
            });
            alert.present();
        }
        else if(!regexEmail.test(this.user.email)){
            let alert = this.alertCtrl.create({
                title: `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">`+'Uy...'+`</h6>`,
                message: 'Por favor ingresa un correo electrónico válido',
                buttons: ['OK']
            });
            alert.present();
        }
        else{
            this.showLoading();
            this.authService.login(this.user)
                .subscribe(
                    success =>{
                        this.loading.dismiss();
                        console.log('Data', success);

                        if(success.data.length > 0){
                            localStorage.setItem( 'id_token', success.token);

                            //Filtrando si los establecimientos asociados al usuario tienen app habilitada
                            let arrE = [];
                            for(let i of success.data){
                                if(i.statusApp == "Y"){
                                    arrE.push(i);
                                }
                            }
                            localStorage.setItem('userEstablishments', JSON.stringify(arrE));
                            this.establishmentService.establishmentsByUser = arrE;

                            //Si el usuario solo pertenece a un establecimiento
                            if(success.data.length == 1){

                                //Verificar que el establecimiento tenga app habilitada
                                if(success.data[0].statusApp != "N"){
                                    this.authService.userLogged = success.data[0];
                                    this.authService.establishmentId = success.data[0].establishmentId;
                                    this.authService.userId = success.data[0].id;
                                    this.authService.statusPhysicalConditionsRegister = success.data[0].statusPhysicalConditionsRegister;
                                    this.authService.statusSchedule = success.data[0].statusSchedule;

                                    this.establishmentService.selectedEstablishmentId = success.data[0].establishmentId;

                                    localStorage.setItem('userLogged',JSON.stringify(success.data[0]));
                                    localStorage.setItem('establishmentSelected', success.data[0].establishmentId);
                                    localStorage.setItem('statusPhysicalConditionsRegister', success.data[0].statusPhysicalConditionsRegister);
                                    localStorage.setItem('statusSchedule', success.data[0].statusSchedule);
                                    localStorage.setItem('statusWaitingList', success.data[0].statusWaitingList);
                                    localStorage.setItem('statusUploadPhotoProgress', success.data[0].statusUploadPhotoProgress);
                                    localStorage.setItem('statusRatingLessons', success.data[0].statusRatingLessons);
                                    localStorage.setItem('statusShareBD', success.data[0].shareBd);
                                    localStorage.setItem('orgEstablishments', success.data[0].orgEstablishments);
                                    localStorage.setItem('QR', success.data[0].QRApp);
                                    localStorage.setItem('statusLimitMembershipTest', success.data[0].statusLimitMembershipTest);
                                    localStorage.setItem('statusNotificationMobile', success.data[0].statusNotificationMobile);
                                    if(success.data[0].statusNotificationMobile == 'Y'){
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
                                            this.ga.trackEvent('Usuario', 'inicia sesión', this.authService.userLogged.establishmentName + ' / '+ this.authService.establishmentId);
                                        })
                                        .catch(e => console.log('Error starting GoogleAnalytics', e));

                                    this.navCtrl.setRoot(TabsPage);
                                }
                                else{
                                    //Si no avisarle que su centro no tiene habilitada la app
                                    let alert = this.alertCtrl.create({
                                        title: `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">`+'Ups...'+`</h6>`,
                                        message: "Tu centro no tiene habilitada la app",
                                        buttons: ['OK']
                                    });
                                    alert.present();
                                }
                            }
                            else if(success.data.length > 1){
                                //Si tiene muchos centros asociados que vaya a otra vista para elegir el centro.
                                this.navCtrl.push(CentersPreviewPage);
                            }
                        }
                        else if(success.data.length == 0){
                            //Si el usuario está en la BD pero no está asociado a un centro, que busque uno.
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
                                message = "Verifica tus datos por favor";
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
        }

    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Un momento...',
            enableBackdropDismiss: false
        });
        this.loading.present();
    }

    goToSignUp(){
        this.navCtrl.push(SignupPage);
    }

}
