import { Component, OnInit, TemplateRef} from '@angular/core';
import { ThemesService } from './themes.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Theme } from '../../models/theme.model';
declare const swal: any;

@Component({
	selector: 'list-themes',
  providers: [ ThemesService ],
	templateUrl: './themes.component.html'
})

export class ListThemesComponent implements OnInit  {

  public themes: Theme[];
	public theme: Theme;
  public errorMessage:string;
	public modalRef: BsModalRef;
	public themeForm: FormGroup;
	public filterThemes: FormGroup;
	public pictureByte;
	public submitted = false;
	public file;
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
			date: new FormControl(moment().format('YYYY-MM-DD'), Validators.required)
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
			this.file = file;
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

	public setData(theme){
		this.theme = new Theme();
		this.theme._id = theme._id;
		this.theme.title = theme.title;
		this.theme.description = theme.description;
		this.theme.startDate = theme.startDate;
		this.theme.endDate = theme.endDate;
		this.theme.color = theme.color;
		this.theme.image = theme.image;
		this.theme.active = theme.active;
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
			const start =  moment.utc(theme.startDate);
			const end = moment.utc(theme.endDate);
			theme.active = 'false';
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
			this.setData(theme);
			this.themesService.updateTheme(this.theme.updateTheme(), theme._id).subscribe(
				(response) => {
					swal("Deleted!", "Your imaginary file has been deleted.", "success");
					this.onFilterThemes(this.filterThemes.value);
				},
				(error) => this.errorMessage = error);
		});
	}

	public onValidate(theme, isValid){
		this.submitted = true;
		const start =  moment.utc(theme.startDate);
		const end = moment.utc(theme.endDate);
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
		theme.active = 'true';
		if(theme._id !== ''){
			if (!this.file){
				theme.image = this.pictureByte;
				this.updateTheme(theme);
			}else {
				this.themesService.uploadImage(this.file).subscribe(
							(response) => {
								theme.image = response.file.url;
								this.updateTheme(theme);
						} ,(error) => this.errorMessage = error);
			}
		}else{
		this.themesService.uploadImage(this.file).subscribe(
					(response) => {
						theme.image = response.file.url;
						this.setData(theme);
						this.themesService.createTheme(this.theme.updateTheme()).subscribe(
							(response) => {
								swal("Saved!", "Your imaginary file has been deleted.", "success");
								this.onFilterThemes(this.filterThemes.value);
								this.submitted = false;
								this.closeFirstModal();
							},
							(error) => this.errorMessage = error);
				} ,(error) => this.errorMessage = error);
		}
	}

	public updateTheme(theme){
		this.setData(theme);
		this.themesService.updateTheme(this.theme.updateTheme(), theme._id).subscribe(
				(response) => {
					swal("Update!", "Your imaginary file has been deleted.", "success");
					this.submitted = false;
					this.onFilterThemes(this.filterThemes.value);
					this.closeFirstModal();
			},(error) => this.errorMessage = error);
	}

	public editTheme(theme, template: TemplateRef<any>){
		this.themeForm.controls['_id'].setValue(theme._id);
		this.themeForm.controls['title'].setValue(theme.title);
		this.themeForm.controls['active'].setValue(theme.active);
		this.themeForm.controls['description'].setValue(theme.description);
		this.themeForm.controls['color'].setValue(theme.color);
		this.pictureByte = theme.image;
		this.themeForm.controls['startDate'].setValue(moment.utc(theme.startDate).format('YYYY-MM-DD'));
		this.themeForm.controls['endDate'].setValue(moment.utc(theme.endDate).format('YYYY-MM-DD'));
		this.modalRef = this.modalService.show(template);
	}

	public onFilterThemes(data){
		if (data.date !== ''){
			this.ListThemesComponent(moment(data.date).format('MM-DD-YYYY'));
		}else{
			this.ListThemesComponent(moment().format('MM-DD-YYYY'));
		}
	}

	public closeFirstModal() {
    this.modalRef.hide();
    this.modalRef = null;
		this.pictureByte = '';
		this.themeForm.reset();
  }

	public toDate(date){
	 return moment.utc(date).format('MM/DD/YYYY');
	}

}
