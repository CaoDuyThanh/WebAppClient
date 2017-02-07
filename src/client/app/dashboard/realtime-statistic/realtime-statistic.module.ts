import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'angular2-highcharts';

import { RealtimeStatisticComponent } from './realtime-statistic.component';

// Import shared modules | components
import { TypeaheadModule } from '../../shared/shared-module/typeahead.module';
import { WarningPanelModule } from '../../shared/shared-module/warning-panel/warning-panel.module';

// Import sub Components
import { RealtimeStreetComponent } from './sub-component/realtime-street.component';
import { RealtimeCameraComponent } from './sub-component/realtime-camera.component';
import { TrafficPoleModalComponent } from './sub-component/traffic-pole-modal.component';
import { MinimapComponent } from './sub-component/minimap.component';

// Import services
import { StreetService } from '../../service/street-service';
import { CameraService } from '../../service/camera-service';
import { CSSHelper } from '../../utils/css.helper';

@NgModule({
    imports: [
        BrowserModule,
    	RouterModule,
    	HttpModule,
        ChartModule,
        FormsModule,
        ReactiveFormsModule,
        TypeaheadModule,
        WarningPanelModule
    ],
    declarations: [
    	RealtimeStatisticComponent,
    	RealtimeStreetComponent,
        RealtimeCameraComponent,
        TrafficPoleModalComponent,
        MinimapComponent
    ],
    exports: [RealtimeStatisticComponent],
    providers: [
        StreetService,
        CameraService,
        CSSHelper
    ]
})

export class RealtimeStatisticModule { }
