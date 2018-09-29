import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";
import {EstablishmentsService} from "./establishments.service";
import 'rxjs/add/operator/map';

@Injectable()
export class MeasurementsService {


    constructor(
        private appService: AppService,
        private authService: AuthService,
        private establishmentsService: EstablishmentsService){}

    getAllMeasurements(){
        let establishmentId = this.establishmentsService.selectedEstablishmentId;
        let url = this.appService.gateway + '/api/measurement/' + establishmentId +'/by-establishment?cbp=ALL';

        return this.authService.get(url)
            .map( response=> {
                let res = response.json();
                return res;
            })
    }

}