
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Config } from '../../utils/config';


@Injectable()
export class LoginService {

  public token;
  constructor (private http: Http) {}

  public loginUser(username, pass): Observable<boolean> {
		const data = { email: username, password: pass }
		return this.http.post(`${Config.API}/login`, data)
			.map((response) => {
				const token = response.json() && response.json().token;
				if (token) {
					this.token = token;
					sessionStorage.setItem('token', token);
					return true;
				} else {
					return false;
				}
			}).catch(Config.handleError);
	}
}
