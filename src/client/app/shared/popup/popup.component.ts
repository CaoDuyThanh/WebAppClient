import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Observer, Observable } from 'rxjs';

@Component({
    moduleId: module.id,
	selector: 'popup-cmp',
	templateUrl: 'popup.component.html'
})

export class PopupComponent implements AfterViewInit {
	static Success: string = 'Success';
	static Warning: string = 'Warning';
	static Failure: string = 'Failure';

	@Input() Message: string;
	@Input() Timer: number;
	@Output() PopupListener: EventEmitter<Observer<string>> = new EventEmitter<Observer<string>>();

	private Popup: Observer<string>;
	private obs: Observable<any>;
	private isShowSuccessPopup: boolean = false;
	private isShowWarningPopup: boolean = false;
	private isShowFailurePopup: boolean = false;

	constructor() {
		this.Message = '';
		this.Timer = 2000;
	}

	ngAfterViewInit() {
		this.obs = new Observable((observer: any) => {	this.Popup = observer;
														this.PopupListener.next(this.Popup);
												 	 });
		this.obs.subscribe(
			(popupName: string) => {
				console.log('here');
				switch (popupName) {
					case PopupComponent.Success:
						this.isShowSuccessPopup = true;
		                setTimeout(() => {
		                    this.isShowSuccessPopup = false;
		                    this.Popup.next('');
		                }, this.Timer);
						break;

					case PopupComponent.Warning:
						this.isShowWarningPopup = true;
		                setTimeout(() => {
		                    this.isShowWarningPopup = false;
		                    this.Popup.next('');
		                }, this.Timer);
						break;

					case PopupComponent.Failure:
						this.isShowFailurePopup = true;
		                setTimeout(() => {
		                    this.isShowFailurePopup = false;
		                    this.Popup.next('');
		                }, this.Timer);
						break;

					default:
						console.log('Do not know popup');
						break;
				}
			},
			(err: any) => {
				console.log(err);
			}
		);
	}
}
