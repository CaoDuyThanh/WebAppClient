import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'angular2-highcharts';

import { DatabaseStatisticComponent } from './database-statistic.component';

// Import shared components
import { TypeaheadModule } from '../../shared/shared-module/typeahead.module';

// Import sub-somponents
import { DatabaseStreetComponent } from './sub-component/database-street.component';
import { DatabaseCameraComponent } from './sub-component/database-camera.component';
import { DatabasePointComponent } from './sub-component/database-point.component';
import { MinimapComponent } from './sub-component/minimap.component';
import { MinimapPointComponent } from './sub-component/minimap-point.component';
import { TrafficPoleModalComponent } from './sub-component/traffic-pole-modal.component';

@NgModule({
    imports: [
        BrowserModule,
    	RouterModule,
    	HttpModule,
        ChartModule,
        FormsModule,
        ReactiveFormsModule,
        TypeaheadModule
    ],
    declarations: [
    	DatabaseStatisticComponent,
        DatabaseStreetComponent,
        DatabasePointComponent,
        DatabaseCameraComponent,
        MinimapComponent,
        MinimapPointComponent,
        TrafficPoleModalComponent
    ],
    exports: [DatabaseStatisticComponent],
    providers: [
    ]
})

export class DatabaseStatisticModule { }
