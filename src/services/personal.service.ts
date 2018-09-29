import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class PersonalService {
  constructor(private appService: AppService, private authService: AuthService) {}

  getPersonal() {
    let establishmentId = this.authService.establishmentId;
    let url =
      this.appService.gateway +
      '/api/user-establishment/' +
      establishmentId +
      '/by-establishment?cbp=all&orderby=insDate&typeuser=1&status=1';

    return this.authService.get(url).map(response => {
      let res = response.json();
      return res;
    });
  }

  getPersonalByDiscipline(disciplineId) {
    let url = this.appService.gateway + '/api/disciplines/' + disciplineId + '/users';
    return this.authService.get(url).map(response => {
      let res = response.json();
      return res;
    });
  }
}
