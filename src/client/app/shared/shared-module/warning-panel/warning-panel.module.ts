import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

// Import shared component
import { WarningPanelComponent } from './warning-panel';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule
	],
	declarations: [
		WarningPanelComponent
	],
	exports: [
		WarningPanelComponent
	]
})
export class WarningPanelModule {};
