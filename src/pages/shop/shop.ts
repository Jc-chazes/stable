import {Component} from '@angular/core';
import {NavController, Loading, LoadingController, AlertController} from 'ionic-angular';
import {PlansService} from "../../services/plans.service";
import {PlanDetailPage} from "../plan-detail/plan-detail";
import {ProductDetailPage} from "../product-detail/product-detail";
import {FormPersonalDataPage} from "../form-personal-data/form-personal-data";
import {CulqiService} from "../../services/culqi.service";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {AuthService} from "../../services/auth.service";
import { MembershipsService } from '../../services/memberships.service';
import { ProductsService } from "../../services/products.service";
import { EstablishmentsService } from '../../services/establishments.service';
import { constants } from '../../helpers/constanst';
@Component({
    selector: 'page-shop',
    templateUrl: 'shop.html'
})
export class ShopPage {

    loading: Loading;
    plans : any[];
    products : any[];
    thereArePlans : boolean = true;
    thereAreProducts : boolean = true;
    currency: string;
    segment: string = 'memberships';

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        private plansService: PlansService,
        private culqiService: CulqiService,
        public ga: GoogleAnalytics,
        private authService: AuthService,
        private productsService: ProductsService,
        private alertCtrl: AlertController,
        private memberships: MembershipsService,
        private establishments: EstablishmentsService
    ) {
        this.currency = JSON.parse(localStorage.getItem('userEstablishments'))[0].currency
    }

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('marketPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    getList(){
        this.showLoading();
        if(localStorage.getItem('statusLimitMembershipTest')){
              this.plansService.getAvailablePlansForUser().subscribe(
                data =>{
                    this.loading.dismiss();
                    if(data.length > 0){
                        let temp = [];

                        for(let i of data){
                            if(i.status == "1"){
                                temp.push(i);
                            }
                        }

                        this.plans = temp;
                        this.thereArePlans = this.plans.length > 0;
                    }
                    else{
                        this.thereArePlans = false;
                    }
                },
                error =>{
                    this.loading.dismiss();
                    this.thereArePlans = false;
                }
            );
        }else{
            this.plansService.getOnlinePlans().subscribe(
              data =>{
                  this.loading.dismiss();
                  if(data.length > 0){
                      let temp = [];

                      for(let i of data){
                          if(i.status == "1"){
                              temp.push(i);
                          }
                      }

                      this.plans = temp;
                      this.thereArePlans = this.plans.length > 0;
                  }
                  else{
                      this.thereArePlans = false;
                  }
              },
              error =>{
                  this.loading.dismiss();
                  this.thereArePlans = false;
              }
          );
        }

        this.products = [];
        this.productsService.getOnlineProducts()
            .subscribe(
                success => {
                    for (const product of success) {
                        if ((product.typeOfSale == '2' || product.typeOfSale == '3') && product.stock != 0) {
                            this.products.push(product);
                        }
                    }

                }, error => {}
            );
    }

    ionViewWillEnter(){
        this.culqiService.planData = {};
        this.productsService.productToBuy = {};
        this.getList();
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            enableBackdropDismiss: false
        });
        this.loading.present();
    }

    viewPlanDetail(plan){
        this.plansService.planDetail = plan;
        this.navCtrl.push(PlanDetailPage);
    }

    viewProductDetail(){
        this.navCtrl.push(ProductDetailPage);
    }

    showFormPersonalData(plan){

            this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackEvent('Market', 'obtener', this.authService.userLogged.establishmentName+' / '+ this.authService.establishmentId +' / '+plan.name, plan.price);
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
            if( this.establishments.currentEstablishment.statusOnsitePaymentMembership ){
                this.alertCtrl.create({
                    title: 'Método de pago',
                    message: 'Eliga el método de pago para la membresía elegida',
                    buttons: [
                        {
                            text: 'Cancelar'
                        },
                        {
                            text: 'Aceptar',
                            handler: (data)=>{
                                switch (data){
                                    case 'ONLINE':

                                        if(this.establishments.currentEstablishment.marketPlatform.code == constants.MARKET_PLATFORMS.PAYU
                                          || this.establishments.currentEstablishment.marketPlatform.code == constants.MARKET_PLATFORMS.CULQI  ){
                                            this.culqiService.planData = plan;
                                            this.navCtrl.push(FormPersonalDataPage);
                                          }else {
                                            let alert = this.alertCtrl.create({
                                                title: 'Lo sentimos',
                                                message: 'Tu centro no dispone de opción de pago online',
                                                buttons: ['Ok']
                                            });
                                            alert.present();
                                          }

                                        break;
                                    case 'ONSITE':
                                        this.showOnsitePaymentSelectedAlert(plan);
                                        break;
                                }

                            }
                        }
                    ],
                    inputs: [
                        {
                            type: 'radio',
                            label: 'Online',
                            value: 'ONLINE',
                            checked: true,
                            name: 'paymentMethod'
                        },
                        {
                            type: 'radio',
                            label: 'Presencial',
                            value: 'ONSITE',
                            name: 'paymentMethod'
                        }
                    ]
                }).present();
            }else{


              if(this.establishments.currentEstablishment.marketPlatform.code == constants.MARKET_PLATFORMS.PAYU
                || this.establishments.currentEstablishment.marketPlatform.code == constants.MARKET_PLATFORMS.CULQI  ){
                  this.culqiService.planData = plan;
                  this.navCtrl.push(FormPersonalDataPage);

                }else{
                  let alert = this.alertCtrl.create({
                      title: 'Lo sentimos',
                      message: 'Tu centro no dispone de opción de pago online',
                      buttons: ['Ok']
                  });
                  alert.present();

                }

            }


    }

    showNextPage(product) {
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackEvent('Market', 'obtener', this.authService.userLogged.establishmentName+' / '+ this.authService.establishmentId +' / '+product.title, product.price);
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));

        this.productsService.productToBuy = product;
        this.navCtrl.push(FormPersonalDataPage);
    }

    showOnsitePaymentSelectedAlert(plan){
        this.alertCtrl.create({
            title: 'Confirmar compra',
            message: `Recuerde acercase a pagar la membresía al establecimieto.
            Solamente podrá reservar 1 clase hasta que no pague completamenete la membresía.`,
            buttons: [
                {
                    text: 'Cancelar'
                },
                {
                    text: 'Confirmar',
                    handler: ()=>{
                        this.obtainMembership(plan);
                    }
                }
            ]
        }).present();
    }

    obtainMembership(plan){
        this.loading = this.loadingCtrl.create({ enableBackdropDismiss: false });
        this.loading.present();
        const establishmentId = this.authService.establishmentId;
        const userId = this.authService.userLogged.id;
        this.memberships.createMembership({
            flagOnsitePayment: 1,
            discount: 0,
            endDate: null,
            establishmentId: establishmentId,
            insUser: userId,
            planId: plan.id,
            realDiscount: 0,
            roleId: null,
            sellerId: userId,
            startDate: plan.startDate || new Date(),
            typeMembership: "0",
            userEstablishmentId: userId
        }).subscribe( result => {
            this.alertCtrl.create({ message: 'Su membresía ha sido adquirida' }).present();
            this.loading.dismiss();
        }, error => {
            console.error('ERROR',error);
            this.loading.dismiss();
        });
    }
}
