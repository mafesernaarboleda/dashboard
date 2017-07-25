export class Theme {

	public _id: string = null;
	public title: string = null;
	public description: number = null;
	public startDate: any = null;
	public endDate: string = null;
  public color:string = null;
  public image:string = null;
  public active:string = null;

  public updateTheme(){
    return {
			title: this.title,
			description: this.description,
			startDate: this.startDate,
			endDate: this.endDate,
      color: this.color,
      image: this.image,
      active: this.active
		};
  }

}
