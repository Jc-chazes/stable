import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";
import 'rxjs/add/operator/map';

@Injectable()
export class ProductsService {

    productToBuy: any = {};

    constructor(
        private appService: AppService,
        private authService: AuthService){}

    getProductsByUser(){
        let userId = this.authService.userId;
        let url = this.appService.gateway + '/api/stock/'+userId+'/by-user?cbp=all';

        return this.authService.get(url)
            .map(response => {
                let res = response.json();
                return res;
            });
    }

    getOnlineProducts() {
        const establishmentId = this.authService.establishmentId;
        const urlOnlineProducts = `${this.appService.gateway}/api/items/${establishmentId}/by-establishment?cbp=all`;
        return this.authService.get(urlOnlineProducts)
            .map(response => {
                return response.json();
            });
    }

}