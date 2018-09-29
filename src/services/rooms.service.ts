import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class RoomsService {
  constructor(private appService: AppService, private authService: AuthService) {}

  getRooms(establishmentIdIn?) {
    let establishmentId = establishmentIdIn ? establishmentIdIn : this.authService.establishmentId;
    let url = this.appService.gateway + '/api/rooms/' + establishmentId + '/by-establishment?cbp=ALL';

    return this.authService.get(url).map(response => {
      let res = response.json();
      return res;
    });
  }
}
