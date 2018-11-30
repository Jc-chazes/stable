import { EstablishmentMarketPlatform } from "./establishment-market-platform.model";
import { BaseModel } from "./base/base.model";

export class Establishment{
    get statusOnsitePaymentMembership(): boolean{
        return localStorage.getItem('statusOnsitePaymentMembership') == 'Y';
    }

    get statusHideFullLessons(): boolean{
        return localStorage.getItem('statusHideFullLessons') == 'Y';
    }

    get marketPlatform(): EstablishmentMarketPlatform{
      let marketPlatform = localStorage.getItem('marketPlatform');
      if( !marketPlatform ){
        return null;
      }else{
        return new EstablishmentMarketPlatform({ code: marketPlatform });
      }
    }

   setEstablishmentDataInLocalStorage(establishmentData): void{
      localStorage.setItem('userLogged',JSON.stringify(establishmentData));
      localStorage.setItem('statusPhysicalConditionsRegister', establishmentData.statusPhysicalConditionsRegister);
      localStorage.setItem('statusSchedule', establishmentData.statusSchedule);
      localStorage.setItem('statusWaitingList', establishmentData.statusWaitingList);
      localStorage.setItem('statusUploadPhotoProgress', establishmentData.statusUploadPhotoProgress);
      localStorage.setItem('statusRatingLessons', establishmentData.statusRatingLessons);
      localStorage.setItem('statusShareBD', establishmentData.shareBd);
      localStorage.setItem('statusOnsitePaymentMembership', establishmentData.statusOnsitePaymentMembership);
      localStorage.setItem('statusHideFullLessons', establishmentData.statusHideFullLessons);
      localStorage.setItem('orgEstablishments', establishmentData.orgEstablishments);
      localStorage.setItem('QR', establishmentData.QRApp);
      localStorage.setItem('statusLimitMembershipTest', establishmentData.statusLimitMembershipTest);
      localStorage.setItem('statusNotificationMobile', establishmentData.statusNotificationMobile);
      localStorage.setItem('marketPlatform', establishmentData.platform);
      localStorage.setItem('countryCode', establishmentData.countryCode);


    }
}
