import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  }) 
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        let body = {
            userName: username,
            password: password
        }
        let urlLogin = environment.host + `users/signin`;
        return this.http.post<any>(urlLogin,body);
    }
    
    getMe() {
      let url = environment.host + `users/me`;
      return this.http.get<any>(url);
    }

    logout() {
        localStorage.removeItem('currentUser');
    }
}