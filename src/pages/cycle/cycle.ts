import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {FormCardDataPage} from "../form-card-data/form-card-data";
import {SchedulePage} from "../schedule/schedule";
import {UserService} from "../../services/user.service";
import {CulqiService} from "../../services/culqi.service";
import {EstablishmentsService} from "../../services/establishments.service";
import {PayUService} from "../../services/payu.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {PlansService} from "../../services/plans.service";
import {AuthService} from "../../services/auth.service";
import {ValidationService} from "../../services/validation.service";
import {NavigationService} from '../../services/navigation.service';
import { RoomsLayoutsService } from '../../services/rooms-layouts.service';
import {Room} from "../../shared/models/room";
import {RoomLayout} from "../../shared/models/room-layout.model";
import {ShopCyclePage} from "../shop-cycle/shop-cycle";
import { Lesson } from '../../shared/models/lesson';
import {AppStateService} from "../../services/app-state.service";


@Component({
  selector: 'page-cycle',
  templateUrl: 'cycle.html',
})
export class CyclePage {
  user: any = {
    email: "",
    phone: "",
    dni: "",
    date: "",
  };
  roomLayoutList: any;
  ///////////
  roomLayout: RoomLayout;
  stateLesson: any = this.appStateService.currentState.lesson
  roomList: Room[];
  room ={
    id:   this.stateLesson.roomId,
  name: this.stateLesson.disciplineName,
  description: '',
  establishmentId: '',
  ocupacy: '',
  insDate: '',
  insUser: '',
  updDate: '',
  updUser: '',
  disDate: '',
  disUser: ''
  };
  myPosition:number = 0;
  lesson = {
    id:this.stateLesson.lessonId
  }

  constructor( public navCtrl: NavController,
               public alertCtrl: AlertController,
               private userService: UserService,
               private culqiService: CulqiService,
               private payuService: PayUService,
               private establishmentsService: EstablishmentsService,
               public ga: GoogleAnalytics,
               private plansService: PlansService,
               private authService: AuthService,
               private validationService: ValidationService,
               private NavigationService : NavigationService,
               private roomsLayouts:RoomsLayoutsService,
               private appStateService : AppStateService) {
  }

  positions(e){
    this.myPosition = e.number;
    this.appStateService.setState({myPosition:e.number,positionXY:e})
  }
  ionViewDidLoad() {
    this.userService.getUser()
      .subscribe(
        success =>{
          let data = success[0];
          this.user.email = data.email;
          this.user.dni= data.dni
        },
        error =>{
          console.log('ERROR', error);
        }
      );

        console.log('state')


          this.roomsLayouts.findOne( this.room ,this.lesson as Lesson)
            .subscribe( result => {
              console.log('room28',result)
              console.log(JSON.stringify({
                ...result,
                positions: result.positions.map( pos => ({
                  x: pos.x,
                  y: pos.y,
                  ratioSize: pos.ratioSize,
                  number: pos.number
                }))
              }));
              // let rawRoom = this.roomList.find( r => r.id == this.room.id );
              result.capacity = 60;

              this.roomLayout = result;
              console.log('resultdaos',this.roomLayout)
            })
        }

    // this.roomsLayouts.findOne(new Room()).subscribe(layout=>{
    //   console.log('layout',layout)
    //   this.roomLayoutList = layout
    // })


  ////////
  showFormCardData(){
    if(this.user.email == "" || this.user.phone == "",
    this.user.date == "" || this.user.dni== "" || this.appStateService.currentState.myPosition === 0){

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
  // validateDataPayu(){
  //   this.errors = [];
  //   this.errors.email = !this.validationService.validEmail(this.userWithPayU.email);
  //   this.errors.celPhone = !this.validationService.validString(this.userWithPayU.celPhone);
  //   this.errors.dni = !this.validationService.validString(this.userWithPayU.dni);
  //   this.errors.choosedCard = !this.validationService.validString(this.choosedCard);
  //   if (this.userFromMexico) {
  //     this.errors.birthdate = !this.validationService.validString(this.userWithPayU.birthdate);
  //   }
  //
  //   for (const err in this.errors) {
  //     if (this.errors[err]) {
  //       return false;
  //     }
  //   }
  //
  //   return true;
  // }
  //
  // goToFormCardDataPayu(){
  //   if(!this.validateDataPayu()){
  //     let alert = this.alertCtrl.create({
  //       title: 'Ups...',
  //       message: 'Por favor completa correctamente todos los campos',
  //       buttons: ['Ok']
  //     });
  //     alert.present();
  //   }
  //   else{
  //     this.payuService.getIP();
  //     // this.payuService.requestData.user.name = this.userWithPayU.name;
  //     // this.payuService.requestData.user.lastName = this.userWithPayU.lastName;
  //     this.payuService.requestData.user.email = this.userWithPayU.email;
  //     this.payuService.requestData.user.celPhone = this.userWithPayU.celPhone;
  //     this.payuService.requestData.user.dni = this.userWithPayU.dni;
  //     if(this.userFromMexico){
  //       this.payuService.requestData.user.birthdate = this.userWithPayU.birthdate;
  //     }
  //     this.payuService.requestData.card.paymentMethod = this.choosedCard;
  //     this.payuService.requestData.card.name = this.userWithPayU.name + ' ' + this.userWithPayU.lastName;
  //
  //     this.ga.startTrackerWithId('UA-76827860-8')
  //       .then(() => {
  //         console.log('Google analytics is ready now');
  //         this.ga.trackEvent('Market', 'continuar', this.authService.userLogged.establishmentName+ ' / '+this.authService.establishmentId+' / '+this.plansService.planDetail.name, this.plansService.planDetail.price);
  //       })
  //       .catch(e => console.log('Error starting GoogleAnalytics', e));
  //
  //     this.navCtrl.push(FormCardDataPage);
  //   }

}






