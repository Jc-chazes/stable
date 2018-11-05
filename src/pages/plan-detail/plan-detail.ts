import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PlansService} from "../../services/plans.service";
import {FormPersonalDataPage} from "../form-personal-data/form-personal-data";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {AuthService} from "../../services/auth.service";
import {NavigationService} from "../../services/navigation.service";
import { AlertController } from 'ionic-angular';
import {AppStateService} from "../../services/app-state.service";
import {ShopPage} from "../shop/shop";

@Component({
    selector: 'page-plan-detail',
    templateUrl: 'plan-detail.html'
})
export class PlanDetailPage {
  sessions : any;
    plan : any;
    sessionsCiclo : any = [];
    currency: string;
  optionSession:any ="-1";
  id : any;

    constructor(
        public navCtrl: NavController,
        private plansService: PlansService,
        public ga: GoogleAnalytics,
        private authService: AuthService,
        private NavigationService : NavigationService,
        private alertCtrl: AlertController,
        private appStateService:AppStateService) {
        this.currency = localStorage.getItem('currencyCode');
    }
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Hola',
      subTitle: 'Escoja sus sesiones para continuar',
      buttons: ['cancelar']
    });
    alert.present();
  }
    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('planDetailPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        this.plan = this.plansService.planDetail;
      this.sessions = this.plansService.getSessionsCiclo(this.plan.id);
      this.sessions.subscribe((res)=>{
        this.sessionsCiclo = res.data;
        console.log(res.data)
      });

        console.log('PLAN', this.plan);



    }

  calendarCiclo(){
    this.ga.startTrackerWithId('UA-76827860-8')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackEvent('Market', 'planDetail - obtener', this.authService.userLogged.establishmentName+' / '+this.authService.establishmentId+' / '+this.plan.name, this.plan.price);
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));

      if (this.id === undefined || this.id === -1){
       this.presentAlert();
      }else{
        this.appStateService.setState({cycle:1});
        this.NavigationService.navigateTo("SCHEDULE");
        this.navCtrl.push(ShopPage);
      }

  }

    showFormPersonalData(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackEvent('Market', 'planDetail - obtener', this.authService.userLogged.establishmentName+' / '+this.authService.establishmentId+' / '+this.plan.name, this.plan.price);
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));


    }

   onChangeSession(e){
      this.id = e;
     console.log(this.id);
     this.appStateService.setState({lessonId:e})
  }

}
