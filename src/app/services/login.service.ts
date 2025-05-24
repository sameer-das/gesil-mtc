import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUser } from '../models/user.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }
  private http = inject(HttpClient);
  private API_URL = environment.API_URL;

  login(username: string, password: string):Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.API_URL}${environment.login}`, {
      username, password
    })
  }
}
