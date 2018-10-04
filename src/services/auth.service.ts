import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AppService} from "./app.service";
import { Firebase } from '@ionic-native/firebase';

@Injectable()
export class AuthService {

    userLogged : any;
    establishmentId: number;
    userId: number;

    statusPhysicalConditionsRegister: string;
    statusSchedule: string;

    constructor(
        private http : Http,
        private appService: AppService,
        private firebaseNative: Firebase
    ){}

    public login(user){
        let auth = {
            email: user.email,
            password: user.password
        };

        let url = this.appService.gateway + '/auth/app';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.post(url, auth, {headers: headers})
            .map( response =>{
                let res = response.json();
                return res;
            })
    }

    public logout(){
        localStorage.clear();
        this.firebaseNative.setBadgeNumber( 0 ).then();
    }

    public get(url){
        let token = localStorage.getItem('id_token');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.get(url, {headers:headers});
    }

    public post(url, data){
        let token = localStorage.getItem('id_token');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(url, data, {headers:headers});
    }

    public put(url, data){
        let token = localStorage.getItem('id_token');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.put(url, data, {headers:headers});
    }

    public delete(url){
        let token = localStorage.getItem('id_token');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.delete(url, {headers:headers});
    }

    public vaff() {
        let token = localStorage.getItem('id_token');
        let headers = new Headers();
        let url = this.appService.gateway + "/api/users/hjkaaavdk/thptxytyj";
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);
        return this.http.post(url, {msg: "#fw/$^8*eihf7732e"}, {headers: headers}).map(
            response => {
                let info = response.json();
                return info;
            });
    }

    public verifyStatus(data) {
        let url = this.appService.gateway + '/auth/app-verify-status';
        let token = localStorage.getItem('id_token');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(url, data, {headers:headers})
            .map( response => response.json());
    }

}