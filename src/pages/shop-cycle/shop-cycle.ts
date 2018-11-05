import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppStateService} from "../../services/app-state.service";

/**
 * Generated class for the ShopCyclePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-shop-cycle',
  templateUrl: 'shop-cycle.html',
})
export class ShopCyclePage {
  myPosition :number;
  lessonObject :any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public appStateService:AppStateService) {
    this.lessonObject = this.appStateService.currentState.lesson;
    this.myPosition = this.appStateService.currentState.myPosition
  }

  ionViewWillEnter() {

  }

}
