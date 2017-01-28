import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CameraSettingsComponent } from './camera-settings.component';

@NgModule({
    imports: [
        BrowserModule,
    	RouterModule,
    	HttpModule,
    ],
    declarations: [
    	CameraSettingsComponent
    ],
    exports: [CameraSettingsComponent]
})

export class CameraSettingsModule { }
