import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const AUTH_API = 'http://localhost:8080/api/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  public login(user): Observable<any> {
    return this.http.post(AUTH_API + 'signIn', {
      username: user.username,
      password: user.password
    });
  }

  public register(user): Observable<any> {
    return this.http.post(AUTH_API + 'signUp', {
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      confirmPassword: user.confirmPassword
    });
  }
}
