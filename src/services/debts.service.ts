import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";
import 'rxjs/add/operator/map';

@Injectable()
export class DebtsService {

    constructor(
        private appService: AppService,
        private authService: AuthService){}

    getMembershipsDebts(){
        let userId = this.authService.userId;
        let establishmentId = this.authService.establishmentId;
        let url = this.appService.gateway + '/api/unpaid/'+establishmentId+'/'+userId+'/for-memberships';

        return this.authService.get(url)
            .map(response => {
                let res = response.json();
                return res;
            });
    }

    getProductsAndLessonsDebts(){
        let userId = this.authService.userId;
        let establishmentId = this.authService.establishmentId;
        let url = this.appService.gateway + '/api/unpaid/'+establishmentId+'/'+userId+'/by-user';

        return this.authService.get(url)
            .map(response => {
                let res = response.json();
                return res;
            });
    }

}