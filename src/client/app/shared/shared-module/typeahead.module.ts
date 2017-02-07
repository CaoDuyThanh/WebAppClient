import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

// Import shared component
import { Typeahead } from 'ng2-typeahead';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule
	],
	declarations: [
		Typeahead
	],
	exports: [
		Typeahead
	]
})
export class TypeaheadModule {};
