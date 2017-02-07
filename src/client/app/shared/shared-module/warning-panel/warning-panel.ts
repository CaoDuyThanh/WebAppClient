import { Component, Injector, EventEmitter } from '@angular/core';

@Component({
    moduleId: module.id,
	selector: 'warning-panel-cmp',
	templateUrl: 'warning-panel.html'
})

export class WarningPanelComponent {
	static CONFIRM: string = 'CONFIRM';

	private Header: string;
	private Message: string;
	private Response: EventEmitter<string>;

	constructor(private injector: Injector) {
		this.Header = this.injector.get('Header');
		this.Message = this.injector.get('Message');
		this.Response = this.injector.get('Response');
	}

	ClickConfirm(): void {
		this.Response.next(WarningPanelComponent.CONFIRM);
	}
}
