import { Injectable } from "@angular/core";
import { StorageUtil, StorageKeys } from "./storage.util";

@Injectable()
export class JwtUtil{
    
    private token: string;

    constructor(private storage: StorageUtil){

    }

    public getToken(): string{
        // if(!this.token){
        //     this.token = this.storage.load<string>(StorageKeys.TOKEN);
        // }
      this.token = localStorage.getItem('id_token');
        return this.token;
    }

    public setToken(token: string){
        this.storage.save(StorageKeys.TOKEN, token);
        this.token = token;
    }

}
