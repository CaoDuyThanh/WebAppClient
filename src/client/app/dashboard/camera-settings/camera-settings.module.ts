import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CameraSettingsComponent } from './camera-settings.component';

// Import module
import { PopupModule } from '../../shared/popup/index';
import { WarningPanelModule } from '../../shared/shared-module/warning-panel/warning-panel.module';

// Import sub Component
import { TrafficPoleEditComponent } from './sub-component/traffic-pole-edit.component';
import { CameraEditComponent } from './sub-component/camera-edit.component';
import { LatlonEditComponent } from './sub-component/latlon-edit.component';
import { YesnoPanelComponent } from '../../shared/yesno-panel/yesno-panel';


@NgModule({
    imports: [
        BrowserModule,
    	RouterModule,
    	HttpModule,
        PopupModule,
        FormsModule,
        WarningPanelModule
    ],
    declarations: [
    	CameraSettingsComponent,
    	TrafficPoleEditComponent,
    	CameraEditComponent,
    	LatlonEditComponent,
        YesnoPanelComponent
    ],
    exports: [CameraSettingsComponent]
})

export class CameraSettingsModule { }
