import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
	selector: 'login',
	providers: [LoginService],
	templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

	public loginForm: FormGroup;
	public error = false;
	public confirmation: string;

	constructor(private loginService: LoginService, private router: Router, public route: ActivatedRoute) { }

	public ngOnInit() {
		this.loginForm = new FormGroup({
			password: new FormControl(''),
			username: new FormControl('', Validators.compose([Validators.required]))
		});
	}

	public onValidate(data, isValid: boolean) {
		if (isValid) {
			this.loginService.loginUser(data.username, data.password).subscribe((result) => {
				if (result === true) {
					this.router.navigate(['/themes']);
				} else {
					this.error = true;
				}
			}, (error) => {
				this.error = true;
			});
		}
	}

}
