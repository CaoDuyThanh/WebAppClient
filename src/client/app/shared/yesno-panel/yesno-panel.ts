import { Component, Injector, EventEmitter } from '@angular/core';

@Component({
    moduleId: module.id,
	selector: 'yesno-panel-cmp',
	templateUrl: 'yesno-panel.html'
})

export class YesnoPanelComponent {
	static YES: string = 'Yes';
	static NO: string = 'No';

	private Header: string;
	private Message: string;
	private Response: EventEmitter<string>;

	constructor(private injector: Injector) {
		this.Header = this.injector.get('Header');
		this.Message = this.injector.get('Message');
		this.Response = this.injector.get('Response');
	}

	ClickYes(): void {
		this.Response.next(YesnoPanelComponent.YES);
	}

	ClickNo(): void {
		this.Response.next(YesnoPanelComponent.NO);
	}
}
