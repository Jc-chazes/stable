import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";
import 'rxjs/add/operator/map';

@Injectable()
export class MembershipsService {

    membershipDetail : any;

    constructor(
        private appService: AppService,
        private authService: AuthService){}

    getMemberships(){
        let userId = this.authService.userId;
        let url = this.appService.gateway + '/api/memberships/' +userId+ '/by-user?orderby=id&status=ALL';

        return this.authService.get(url)
            .map( response => {
                let res = response.json();
                console.log('res',res)
                return res;
            });
    }

    createMembership(membership){
        let url = this.appService.gateway + '/api/memberships';

        return this.authService.post(url, membership)
            .map( response=> {
                var res = response.json();
                return res;
            });
    }

    buyMembership(membership){
        let url = this.appService.gateway + '/api/memberships/add-membership-payment-byapp';

        return this.authService.post(url, membership)
            .map( response=> {
                var res = response.json();
                return res;
            });
    }

}