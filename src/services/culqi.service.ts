import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

import 'rxjs/add/operator/map';
import {EstablishmentsService} from "./establishments.service";

@Injectable()
export class CulqiService {

    userData : any;
    cardData : any;
    planData : any;

    constructor(
        public http: Http,
        private establishmentService: EstablishmentsService){}

    createToken(){
        /*Split month and year*/
        const date = this.cardData.expDate;
        const array_date = date.split("/");
        const exp_month = array_date[0];
        const exp_year = array_date[1];

        /*Set JSON to Culqi*/
        const info = {
            card_number: this.cardData.number,
            expiration_month: exp_month,
            expiration_year: exp_year,
            cvv: this.cardData.cvv,
            email: this.userData.email
        };

        const urlToken =  'https://api.culqi.com/v2/tokens';
        //const keyPublic = 'pk_test_FodP0bNbPeER0ZjL';
        const keyPublic = this.establishmentService.establishmentsKeys.keyPublic;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization','Bearer '+ keyPublic);

        console.log('INFO', info);
        return this.http.post(urlToken, info, {headers: headers})
            .map(response => {
                let res = response.json();
                return res;
            });
    }

    createCharge(idToken){

        let jsonPeru = {
            amount: this.planData.price * 100,
            currency_code: "PEN",
            email: this.userData.email,
            antifraud_details: {
                address: this.userData.address,
                address_city: this.userData.city,
                country_code: "PE",
                first_name: this.userData.name,
                last_name: this.userData.lastName,
                phone_number: this.userData.celPhone,
            },
            source_id: idToken
        }

        const urlCharge = 'https://api.culqi.com/v2/charges';
        //const keyPrivate = 'sk_test_yHJheHTmhqXuFfCN';
        const keyPrivate = this.establishmentService.establishmentsKeys.keyPrivate;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization','Bearer '+ keyPrivate);

        return this.http.post(urlCharge, jsonPeru , {headers : headers})
            .map(response =>{
            let res = response.json();
            return res;
        });
    }
}