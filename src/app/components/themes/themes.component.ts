import { Component, OnInit, TemplateRef} from '@angular/core';
import { ThemesService } from './themes.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

declare const swal: any;

@Component({
	selector: 'list-themes',
  providers: [ ThemesService ],
	templateUrl: './themes.component.html'
})

export class ListThemesComponent implements OnInit  {

  public themes  = [];
  public errorMessage:string;
	public modalRef: BsModalRef;
	public themeForm: FormGroup;
	public filterThemes: FormGroup;
	public pictureByte;
	public submitted = false;
	public picturePath = {
		name: 'picture',
		image: ''
	}

  constructor(private themesService: ThemesService, private modalService: BsModalService) { }

  public ngOnInit() {
    this.ListThemesComponent(moment().format('MM-DD-YYYY'));
		this.themeForm = new FormGroup({
			_id: new FormControl(''),
			title: new FormControl('', [Validators.required]),
			description: new FormControl('', [Validators.required]),
			color: new FormControl('', Validators.required),
			startDate: new FormControl('', Validators.required),
			endDate: new FormControl('', Validators.required),
			active: new FormControl('', Validators.required)
		});
		this.filterThemes = new FormGroup({
			date: new FormControl('', Validators.required)
		});
  }

	public fileChangeEvent(fileInput: any) {
		this.picturePath.image = fileInput.target.files;
		if (this.picturePath.image.length !== 0) {
			let image = this.picturePath.image[0];
			this.loadFile(fileInput);
		}
	}

	public loadFile(input) {
		let preview = document.querySelector('img.img-theme');
		let file = input.target.files[0];
		let reader = new FileReader();
		reader.addEventListener('load', () => {
			preview['src'] = reader.result;
			this.pictureByte = reader.result;
		}, false);
		if (file) {
			reader.readAsDataURL(file);
		}
	}

	public openModal(template: TemplateRef<any>) {
	this.modalRef = this.modalService.show(template);
	}

  public ListThemesComponent(date){
    this.themesService.getListThemes(date).subscribe(
			(response) => this.themes = response.themes,
			(error) => this.errorMessage = error);
  }

	public deleteTheme(theme){
		swal({
		  title: "Are you sure?",
		  text: "Your will not be able to recover this imaginary file!",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonClass: "btn-danger",
		  confirmButtonText: "Yes, delete it!",
		  closeOnConfirm: false
		},() => {
			theme.active = "false";
			const start =  moment(theme.startDate);
			const end = moment(theme.endDate);
			theme.startDate = {
				day: start.format('D'),
				month: start.format('M'),
				year: start.format('YYYY')
			};
			theme.endDate = {
				day: end.format('D'),
				month: end.format('M'),
				year: end.format('YYYY')
			};
			this.themesService.updateTheme(theme).subscribe(
				(response) => swal("Deleted!", "Your imaginary file has been deleted.", "success"),
				(error) => this.errorMessage = error);
		});
	}

	public onValidate(theme, isValid){
		this.submitted = true;
		const start =  moment(theme.startDate);
		const end = moment(theme.endDate);
		theme.startDate = {
			day: start.format('D'),
			month: start.format('M'),
			year: start.format('YYYY')
		};
		theme.endDate = {
			day: end.format('D'),
			month: end.format('M'),
			year: end.format('YYYY')
		};
		theme.image = this.pictureByte;
		if(theme._id !== ''){
		this.themesService.updateTheme(theme).subscribe(
				(response) => swal("Update!", "Your imaginary file has been deleted.", "success"),
				(error) => this.errorMessage = error);
		}else{
			theme.active = 'true';
			this.themesService.createTheme(theme).subscribe(
				(response) => swal("Saved!", "Your imaginary file has been deleted.", "success"),
				(error) => this.errorMessage = error);
		}
	}

	public editTheme(theme, template: TemplateRef<any>){
		this.themeForm.controls['_id'].setValue(theme._id);
		this.themeForm.controls['title'].setValue(theme.title);
		this.themeForm.controls['active'].setValue(theme.active);
		this.themeForm.controls['description'].setValue(theme.description);
		this.themeForm.controls['color'].setValue(theme.color);
		this.pictureByte = theme.image;
		this.themeForm.controls['startDate'].setValue(moment(theme.startDate).format('YYYY-MM-DD'));
		this.themeForm.controls['endDate'].setValue(moment(theme.endDate).format('YYYY-MM-DD'));
		this.modalRef = this.modalService.show(template);
	}

	public onFilterThemes(data){
		if (data.date !== ''){
			this.ListThemesComponent(moment(data.date).format('MM-DD-YYYY'));
		}else{
			this.ListThemesComponent(moment().format('MM-DD-YYYY'));
		}
	}

}
