import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'angular2-highcharts';

import { RealtimeStatisticComponent } from './realtime-statistic.component';

// Import sub Components
import { RealtimeStreetComponent } from './sub-component/realtime-street.component';

// Import services
import { StreetService } from '../../service/street-service';
import { CSSHelper } from '../../utils/css.helper';

@NgModule({
    imports: [
        BrowserModule,
    	RouterModule,
    	HttpModule,
        ChartModule
    ],
    declarations: [
    	RealtimeStatisticComponent,
    	RealtimeStreetComponent
    ],
    exports: [RealtimeStatisticComponent],
    providers: [
        StreetService,
        CSSHelper
    ]
})

export class RealtimeStatisticModule { }
