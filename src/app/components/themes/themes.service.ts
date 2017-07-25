
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Config } from '../../utils/config';

@Injectable()
export class ThemesService {

	private headers: Headers;

  constructor (private http: Http) {
    this.headers = new Headers({ 'Accept': 'application/json' });
  }

  public getListThemes(date): Observable<any> {
    this.headers.set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    let options = new RequestOptions({ headers: this.headers });
    return this.http
            .get(`${Config.API}/themes/${date}`, options)
            .map(Config.extractData)
            .catch(Config.handleError);
  }

	public updateTheme(theme,id){
		this.headers.set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
		let options = new RequestOptions({ headers: this.headers });
		return this.http
						.put(`${Config.API}/theme/${id}`, theme, options )
						.map(Config.extractData)
						.catch(Config.handleError);
	}

	public createTheme(theme){
		this.headers.set('Authorization', 'Bearer ' +  sessionStorage.getItem('token'));
		return this.http
						.post(`${Config.API}/theme`, theme, { headers: this.headers } )
						.map(Config.extractData)
						.catch(Config.handleError);
	}

	public uploadImage(file){
	let formData = new FormData();
  formData.append('file', file);
		this.headers.set('Authorization', 'Bearer ' +  sessionStorage.getItem('token'));
		return this.http
						.post(`${Config.API}/upload`, formData, { headers: this.headers } )
						.map(Config.extractData)
						.catch(Config.handleError);
	}


}
