import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CameraSettingsComponent } from './camera-settings.component';

// Import sub Component
import { TrafficPoleEditComponent } from './sub-component/traffic-pole-edit.component';
import { CameraEditComponent } from './sub-component/camera-edit.component';
import { LatlonEditComponent } from './sub-component/latlon-edit.component';

@NgModule({
    imports: [
        BrowserModule,
    	RouterModule,
    	HttpModule,
    ],
    declarations: [
    	CameraSettingsComponent,
    	TrafficPoleEditComponent,
    	CameraEditComponent,
    	LatlonEditComponent

    ],
    exports: [CameraSettingsComponent]
})

export class CameraSettingsModule { }
