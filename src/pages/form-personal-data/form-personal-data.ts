import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {FormCardDataPage} from "../form-card-data/form-card-data";
import {UserService} from "../../services/user.service";
import {CulqiService} from "../../services/culqi.service";
import {EstablishmentsService} from "../../services/establishments.service";
import {PayUService} from "../../services/payu.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {PlansService} from "../../services/plans.service";
import {AuthService} from "../../services/auth.service";
import {ValidationService} from "../../services/validation.service";

@Component({
    selector: 'page-form-personal-data',
    templateUrl: 'form-personal-data.html'
})
export class FormPersonalDataPage {

    user: any = {
        name : "",
        lastName : "",
        email : "",
        celPhone : "",
        address : "",
        city: ""
    };

    usePayU: boolean;
    userFromMexico: boolean;
    userWithPayU: any = {
        name: '',
        lastName: '',
        email: '',
        celPhone: '',
        dni: '',
        birthdate: ''
    };
    choosedCard = '';
    errors: any = {};

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        private userService: UserService,
        private culqiService: CulqiService,
        private payuService: PayUService,
        private establishmentsService: EstablishmentsService,
        public ga: GoogleAnalytics,
        private plansService: PlansService,
        private authService: AuthService,
        private validationService: ValidationService) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('formPersonalDataPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        this.choosedCard = '';
        this.validateEstablishment();
    }

    validateEstablishment(){
        let estID = this.establishmentsService.selectedEstablishmentId;

        if( estID == 19 ||
            estID == 119 ||
            estID == 172 ||
            estID == 207 ||
            estID == 179 ||
            estID == 171 ||
            estID == 183 ||
            estID == 84 ||
            estID == 260 ||
            estID == 261 ||
            estID == 321 ||
            estID == 233 ){
            this.usePayU = true;
            this.userFromMexico = ( estID == 19 ||
                                    estID == 172 ||
                                    estID == 171 ||
                                    estID == 183 ||
                                    estID == 84 ||
                                    estID == 260 ||
                                    estID == 261 ||
                                    estID == 321 ||
                                    estID == 233);
            this.showPayUForm();
        }
        else{
            this.usePayU = false;
            this.userFromMexico = false;
            this.showCulqiForm();
        }
    }

    showPayUForm(){
        this.userService.getUser()
            .subscribe(
                success =>{
                    let data = success[0];
                    this.userWithPayU.name = data.name;
                    this.userWithPayU.lastName = data.lastName;
                    this.userWithPayU.email = data.email;
                    this.userWithPayU.celPhone = data.celPhone;
                },
                error =>{
                    console.log('ERROR', error);
                }
            );

    }

    showCulqiForm(){
        this.userService.getUser()
            .subscribe(
                success =>{
                    let data = success[0];
                    this.user.name = data.name;
                    this.user.lastName = data.lastName;
                    this.user.email = data.email;
                    this.user.celPhone = data.celPhone;
                    this.user.address = data.address;
                },
                error =>{
                    console.log('ERROR', error);
                }
            );
    }

    showFormCardData(){
        if(this.user.name == "" || this.user.lastName == "",
           this.user.email == "" || this.user.celPhone == "",
           this.user.address == "" || this.user.city == ""){

            let alert = this.alertCtrl.create({
                title: 'Ups...',
                message: 'Por favor completa todos los campos',
                buttons: ['Ok']
            });
            alert.present();
        }
        else{
            this.culqiService.userData = this.user;

            this.ga.startTrackerWithId('UA-76827860-8')
                .then(() => {
                    console.log('Google analytics is ready now');
                    this.ga.trackEvent('Market', 'continuar', this.authService.userLogged.establishmentName+ ' / '+this.authService.establishmentId+' / '+this.plansService.planDetail.name, this.plansService.planDetail.price);
                })
                .catch(e => console.log('Error starting GoogleAnalytics', e));

            this.navCtrl.push(FormCardDataPage);
        }
    }

    /*Market Payu*/
    validateDataPayu(){
        this.errors = [];
        this.errors.name = !this.validationService.validString(this.userWithPayU.name);
        this.errors.lastName = !this.validationService.validString(this.userWithPayU.lastName);
        this.errors.email = !this.validationService.validEmail(this.userWithPayU.email);
        this.errors.celPhone = !this.validationService.validString(this.userWithPayU.celPhone);
        this.errors.dni = !this.validationService.validString(this.userWithPayU.dni);
        this.errors.choosedCard = !this.validationService.validString(this.choosedCard);
        if (this.userFromMexico) {
            this.errors.birthdate = !this.validationService.validString(this.userWithPayU.birthdate);
        }

        for (const err in this.errors) {
            if (this.errors[err]) {
                return false;
            }
        }

        return true;
    }

    goToFormCardDataPayu(){
        if(!this.validateDataPayu()){
            let alert = this.alertCtrl.create({
                title: 'Ups...',
                message: 'Por favor completa correctamente todos los campos',
                buttons: ['Ok']
            });
            alert.present();
        }
        else{
            this.payuService.getIP();
            this.payuService.requestData.user.name = this.userWithPayU.name;
            this.payuService.requestData.user.lastName = this.userWithPayU.lastName;
            this.payuService.requestData.user.email = this.userWithPayU.email;
            this.payuService.requestData.user.celPhone = this.userWithPayU.celPhone;
            this.payuService.requestData.user.dni = this.userWithPayU.dni;
            if(this.userFromMexico){
                this.payuService.requestData.user.birthdate = this.userWithPayU.birthdate;
            }
            this.payuService.requestData.card.paymentMethod = this.choosedCard;
            this.payuService.requestData.card.name = this.userWithPayU.name + ' ' + this.userWithPayU.lastName;

            this.ga.startTrackerWithId('UA-76827860-8')
                .then(() => {
                    console.log('Google analytics is ready now');
                    this.ga.trackEvent('Market', 'continuar', this.authService.userLogged.establishmentName+ ' / '+this.authService.establishmentId+' / '+this.plansService.planDetail.name, this.plansService.planDetail.price);
                })
                .catch(e => console.log('Error starting GoogleAnalytics', e));

            this.navCtrl.push(FormCardDataPage);
        }
    }

}
