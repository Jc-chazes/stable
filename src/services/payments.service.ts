import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";
import 'rxjs/add/operator/map';

@Injectable()
export class PaymentsService {

    constructor(
        private appService: AppService,
        private authService: AuthService){}

    getPaymentsByMembership(membershipId){
        let url = this.appService.gateway + '/api/memberships/'+membershipId+'/payments';

        return this.authService.get(url)
            .map(response => {
                let res = response.json();
                return res;
            });
    }

    createPayment(payment){
        let url = this.appService.gateway + '/api/payments';

        return this.authService.post(url, payment)
            .map(response => {
                let res = response.json();
                return res;
            });
    }
}