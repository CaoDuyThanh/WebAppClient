import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CameraSettingsComponent } from './camera-settings.component';

// Import sub Component
import { TrafficPoleEdit } from './sub-component/traffic-pole-edit.component';
import { CameraEdit } from './sub-component/camera-edit.component';
import { LatlonEdit } from './sub-component/latlon-edit.component';

@NgModule({
    imports: [
        BrowserModule,
    	RouterModule,
    	HttpModule,
    ],
    declarations: [
    	CameraSettingsComponent,
    	TrafficPoleEdit,
    	CameraEdit,
    	LatlonEdit

    ],
    exports: [CameraSettingsComponent]
})

export class CameraSettingsModule { }
