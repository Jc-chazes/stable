import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";
import 'rxjs/add/operator/map';

@Injectable()
export class FreezesService {

    constructor(
        private appService: AppService,
        private authService: AuthService){}

    getFreezesByMembership(membershipId){
        let url = this.appService.gateway + '/api/memberships/'+membershipId+'/freezes';

        return this.authService.get(url)
            .map(response => {
                let info = response.json();
                return info;
            });
    }

}