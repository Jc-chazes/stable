import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class ProgressService {
  progressDetail: any;

  constructor(private appService: AppService, private authService: AuthService) {}

  getPhysicalProgress() {
    let userId = this.authService.userId;
    let url = this.appService.gateway + '/api/physical-conditions/' + userId + '/user';

    return this.authService.get(url).map(response => {
      let res = response.json();
      return res;
    });
  }

  create(progress) {
    let url = this.appService.gateway + '/api/physical-conditions';
    return this.authService.post(url, progress).map(response => {
      let data = response.json();
      return data;
    });
  }

  delete(progress) {
    let url =
      this.appService.gateway + '/api/physical-conditions/delete/' + progress.id + '/' + this.authService.userId;

    return this.authService.delete(url).map(response => {
      let data = response.json();
      return data;
    });
  }
}
