import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CommunicationsService {

  constructor(
    private appService: AppService,
    private authService: AuthService){}


  getNewAll(){
    let establishmentId = this.authService.establishmentId;
    let url = this.appService.gateway + '/api/communications/get-news/'+establishmentId;

    return this.authService.get(url)
      .map(response =>{
        let res = response.json();
        return res;
      });
  }

}
