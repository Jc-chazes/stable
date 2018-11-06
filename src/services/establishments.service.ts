import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Establishment } from '../core/models/establishment.model';

@Injectable()
export class EstablishmentsService {

    establishmentsByUser : any;
    selectedEstablishmentId : any;
    establishmentsKeys : any = {
        keyPublic : "",
        keyPrivate : "",
    };
    private currentEstablishmentSubject = new BehaviorSubject<Establishment>( new Establishment() );
    public currentEstablishmentRx = this.currentEstablishmentSubject.asObservable();
    public get currentEstablishment(): Establishment{
      return this.currentEstablishmentSubject.value;
    }

    constructor(
        private appService: AppService,
        private authService: AuthService){}

    getAllEstablishments(){
        let url = this.appService.gateway + '/auth/establishment-get';

        return this.authService.get(url)
            .map(response =>{
               let res = response.json();
               return res;
            });
    }

    getEstablishmentById(){
        let url = this.appService.gateway + '/api/establishment/'+ this.selectedEstablishmentId;

        return this.authService.get(url)
            .map(response =>{
                let res = response.json();
                console.log('res',res[0].statusCycleModel)
                localStorage.setItem('statusCycleModel',res[0].statusCycleModel)
                return res;
                
                
            });
    }
    //For the select
    getAll(){
      const orgEstablishments = localStorage.getItem('orgEstablishments');
      let url = this.appService.gateway + '/api/establishment/'+orgEstablishments+'/get-all-establishments';
      return this.authService.get(url)
          .map(response =>{
             let res = response.json();
             return res;
          });
  }


}
