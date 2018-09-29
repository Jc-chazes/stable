import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';
import * as moment from 'moment';

@Injectable()
export class ValidationService {

    constructor(private alertCtrl: AlertController){}

    public validString(value): boolean {
        return value !== '' && value != null;
    }

    public validNumber(value): boolean {
        return value !== '' && value != null && value > 0;
    }

    public validNumberZero(value): boolean {
        return value !== '' && value !== null && value >= 0;
    }

    public validEmail(value): boolean {
        const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        let valido = false;
        valido = (emailRegex.test(value));
        return value !== '' && value != null && valido === true;
    }

    public validOption(value): boolean {
        if (value === '' || value == null) {
            return false;
        } else {
            if (!value || value.id <= 0) {
                return false;
            }
        }
        return true;
    }

    public validCheckbox(value) {
        return (value !== false);
    }

    public validNameCard(name, lastName) {
        const nameRegex = /^[a-zA-Z ]*$/;
        let validText = false;
        let validLength = false;

        if (nameRegex.test(name) && nameRegex.test(lastName)) {
            validText = true;
        } else {
            validText = false;
        }

        if (name.length + lastName.length > 150) {
            validLength = false;
        } else {
            validLength = true;
        }

        return validText && validLength;
    }

    public validCreditCardLuhn(value) {
        // The Luhn Algorithm. It's so pretty.
        let nCheck = 0;
        let nDigit = 0;
        let bEven = false;

        for (let n = value.length - 1; n >= 0; n--) {
            const cDigit = value.charAt(n);
            nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;
        }

        const status = (nCheck % 10) === 0;
        if(status == false) {
            let alert = this.alertCtrl.create({
                title: 'Número de tarjeta inválido',
                message: 'Verifica los números de tu tarjeta',
                buttons: ['Ok']
            });
            alert.present();
        }
        return status;
    }

    public validNumberAndTypeCard(number, type) {
        if(number.length < 13){
            let alert = this.alertCtrl.create({
                title: 'Número de tarjeta inválido',
                message: 'El número de tarjeta debe poseer entre 13 y 16 dígitos',
                buttons: ['Ok']
            });
            alert.present();
        } else {
            let typeCardRegex = /^4[0-9]{12}(?:[0-9]{3})?$/i;
            switch (type) {
                case 'VISA':
                    typeCardRegex = /^4[0-9]{12}(?:[0-9]{3})?$/i;
                    break;
                case 'MASTERCARD':
                    typeCardRegex = /^5[1-5][0-9]{14}$/i;
                    break;
                case 'DINERS':
                    typeCardRegex = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/i;
                    break;
                case 'AMEX':
                    typeCardRegex = /^3[47][0-9]{13}$/i;
                    break;
            }

            if (typeCardRegex.test(number)) {
                return true;
            } else {
                let alert = this.alertCtrl.create({
                    title: 'Número de tarjeta inválido',
                    message: 'El número de tarjeta no corresponde con el tipo de tarjeta seleccionada',
                    buttons: ['Ok']
                });
                alert.present();
                return false;
            }
        }
    }

    public validCardCVV(cvv, type) {
        let cantDig = 0;
        switch (type) {
            case 'VISA':
                cantDig = 3;
                break;
            case 'MASTERCARD':
                cantDig = 3;
                break;
            case 'DINERS':
                cantDig = 3;
                break;
            case 'AMEX':
                cantDig = 4;
                break;
        }

        if (cvv.length === cantDig) {
            return true;
        } else {
            let alert = this.alertCtrl.create({
                title: 'CVV inválido',
                message: 'El código de seguridad no corresponde con el tipo de tarjeta seleccionada',
                buttons: ['Ok']
            });
            alert.present();
            return false;
        }
    }

    public validExpDateCard(date) {
        if(date.length < 7){
            let alert = this.alertCtrl.create({
                title: 'Fecha de expiración inválida',
                message: 'Por favor ingresa la fecha de expiración con el formato AAAA/MM',
                buttons: ['Ok']
            });
            alert.present();
        } else {
            const expDate = moment(date, 'YYYY/MM').format('YYYY/MM');
            const nowDate = moment().format('YYYY/MM');
            if (expDate < nowDate) {
                let alert = this.alertCtrl.create({
                    title: 'Fecha de expiración inválida',
                    message: 'La fecha de expiración tiene que ser mayor a la actualidad',
                    buttons: ['Ok']
                });
                alert.present();
                return false;
            } else {
                return true;
            }
        }
    }

}