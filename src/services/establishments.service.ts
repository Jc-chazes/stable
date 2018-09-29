import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";
import 'rxjs/add/operator/map';

@Injectable()
export class EstablishmentsService {

    establishmentsByUser : any;
    selectedEstablishmentId : any;
    establishmentsKeys : any = {
        keyPublic : "",
        keyPrivate : "",
    };

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
