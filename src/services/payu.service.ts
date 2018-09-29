import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { EstablishmentsService } from './establishments.service';
import * as moment from 'moment';
import 'rxjs/add/operator/map';

@Injectable()
export class PayUService {
    public requestData = {
        user: {
            name: '',
            lastName: '',
            email: '',
            celPhone: '',
            dni: '',
            birthdate: ''
        },
        payment: {
            amount: '',
            currency: '',
            description: '',
            referenceCode: ''
        },
        card: {
            paymentMethod: '',
            name: '',
            cardNumber: '',
            expirationDate: '',
            securityCode: ''
        },
        establishmentId: null,
        ipAddress: ''
    };

    constructor(private http: Http,
                private appService: AppService,
                private authService: AuthService,
                private establishmentService: EstablishmentsService){}

    public getIP(){
        let urlIP = "https://api.ipify.org?format=json";
        return this.http.get(urlIP)
            .map((response: Response) => {
                return response.json().ip;
            })
            .subscribe(
                data => { this.requestData.ipAddress = data }
            );
    }

    public createTransaction(plan, card){
        const userId = this.authService.userId;
        const establishmentId = this.establishmentService.selectedEstablishmentId;
        const varReferenceCode = `E${establishmentId}_SALEPLAN${plan.id}_U${userId}_R${Math.floor(Math.random() * 101)}`;

        this.requestData.payment.amount = plan.price;
        this.requestData.payment.currency = plan.currency;
        this.requestData.payment.description = 'Compra por app del plan ' + plan.name;
        this.requestData.payment.referenceCode = varReferenceCode;

        this.requestData.card.cardNumber = card.number;
        this.requestData.card.expirationDate = card.expDate;
        this.requestData.card.securityCode = card.cvv;

        this.requestData.establishmentId = parseInt(establishmentId);

        const membershipData = {
            planId: plan.id,
            planPrice: plan.price,
            typeMembership: '1',
            startData: moment().format('YYYY-MM-DD'),
            userEstablishmentId: userId,
            establishmentId: parseInt(establishmentId),
            commentPayment: 'Compra del plan ' + plan.name + ' realizada por el app',
            sellerId: null,
            discount: 0,
            insUser: userId,
        };
        this.requestData['membership'] = membershipData;


        const urlCreteTransaction = `${this.appService.gateway}/api/online-payments/payment/payu?origin=1`;
        return this.authService.post(urlCreteTransaction, this.requestData)
            .map(
                response => {
                    return response.json();
                }
            )
    }

    public createProductTransaction (product, card) {
        const userId = this.authService.userId;
        const establishmentId = this.establishmentService.selectedEstablishmentId;
        const varReferenceCode = `E${establishmentId}_SALEPRODUCT${product.id}_U${userId}_R${Math.floor(Math.random() * 101)}`;

        this.requestData.payment.amount = product.price;
        this.requestData.payment.currency = product.currency;
        this.requestData.payment.description = 'Compra del producto ' + product.title;
        this.requestData.payment.referenceCode = varReferenceCode;

        this.requestData.card.cardNumber = card.number;
        this.requestData.card.expirationDate = card.expDate;
        this.requestData.card.securityCode = card.cvv;

        this.requestData.establishmentId = parseInt(establishmentId);

        const productData = {
            type: '1',
            itemId: product.id,
            quantity: 1,
            totalPrice: product.price,
            buyer: this.authService.userId,
            voucherId: null,
            paymentMethodId: null,
            voucherNumber: null
        };
        this.requestData['product'] = productData;

        const urlCreteTransaction = `${this.appService.gateway}/api/online-payments/payment/payu?origin=1`;
        return this.authService.post(urlCreteTransaction, this.requestData)
            .map(
                response => {
                    return response.json();
                }
            )
    }
}
