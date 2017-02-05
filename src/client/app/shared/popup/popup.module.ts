import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PopupComponent } from './popup.component';

@NgModule({
    imports: [
    	BrowserModule
    ],
    declarations: [
    	PopupComponent
    ],
    exports: [PopupComponent]
})

export class PopupModule { }
