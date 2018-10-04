export class Establishment{
    get statusOnsitePaymentMembership(): boolean{
        return localStorage.getItem('statusOnsitePaymentMembership') == 'Y';
    }
}