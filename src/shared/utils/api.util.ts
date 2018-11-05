import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { JwtUtil } from "./jwt.util";
import { environment } from "../../environments/environment";

export class ApiOptions{ 
    params?: HttpParams; 
    headers?: HttpHeaders; 
    observe?: string 
}

@Injectable()
export class ApiUtil {

    private backendUrl: string;
    private codeAdmin = 'zhpfy';

    constructor(private jwt: JwtUtil, public http: HttpClient) {
        this.backendUrl = environment.backendUrl;
    }

    private appendAuthorizationHeader(headers: HttpHeaders): HttpHeaders{
        headers = headers || new HttpHeaders();
        let token = this.jwt.getToken();
        if( token && token != ''){
            headers = headers.append('Authorization', `${this.jwt.getToken()}`);
            headers = headers.append('Content-Type', 'application/json');
            headers = headers.append('admin', this.codeAdmin);
        }
        return headers;
    }

    public get rawBackendUrl(): string{
        return this.backendUrl.replace('api/','');
    }

    public get(path: string, options?: ApiOptions, isFile: boolean = false): Observable<any>{
        options = options || {};
        options.headers = this.appendAuthorizationHeader(options.headers);
        if(isFile){
            return this.http.get(`${this.backendUrl}${path}`, { 
                params: options.params, headers: options.headers, responseType: 'arraybuffer',
                observe: (options.observe || 'body') as 'body' });
        }
        return this.http.get(`${this.backendUrl}${path}`, { params: options.params, headers: options.headers,
            observe: (options.observe || 'body') as 'body' })
        // .map( (resp) => new JsendResponse(resp) );
    }

    public post(path: string, body?: any, options?: ApiOptions, isAuthenticated: boolean = true): Observable<any>{
        options = options || {};
        options.headers = isAuthenticated ? this.appendAuthorizationHeader(options.headers) : options.headers;
        return this.http.post(`${this.backendUrl}${path}`, body, { params: options.params, headers: options.headers,
            observe: (options.observe || 'body') as 'body' })
        // .map( (resp) => new JsendResponse(resp) );
    }

    public put(path: string, body?: any, options?: ApiOptions): Observable<any>{
        options = options || {};
        options.headers = this.appendAuthorizationHeader(options.headers);
        return this.http.put(`${this.backendUrl}${path}`, body, { params: options.params, headers: options.headers,
            observe: (options.observe || 'body') as 'body' })
        // .map( (resp) => new JsendResponse(resp) );
    }

    public patch(path: string, body?: any, options?: ApiOptions): Observable<any>{
        options = options || {};
        options.headers = this.appendAuthorizationHeader(options.headers);
        return this.http.patch(`${this.backendUrl}${path}`, body, { params: options.params, headers: options.headers,
            observe: (options.observe || 'body') as 'body' })
        // .map( (resp) => new JsendResponse(resp) );
    }

    public delete(path: string, options?: ApiOptions): Observable<any>{
        options = options || {};
        options.headers = this.appendAuthorizationHeader(options.headers);
        return this.http.delete(`${this.backendUrl}${path}`, { params: options.params, headers: options.headers,
            observe: (options.observe || 'body') as 'body' })
        // .map( (resp) => new JsendResponse(resp) );
    }
}
