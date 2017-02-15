import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';

import { HomeModule } from './home/home.module';
import { MapSettingsModule } from './map-settings/map-settings.module';
import { CameraSettingsModule } from './camera-settings/camera-settings.module';
import { RealtimeStatisticModule } from './realtime-statistic/realtime-statistic.module';
import { DatabaseStatisticModule } from './database-statistic/database-statistic.module';
import { CameraVisualizeModule } from './camera-visualize/camera-visualize.module';
// import { ChartModule } from './charts/chart.module';
// import { BlankPageModule } from './blank-page/blankPage.module';
// import { TableModule } from './tables/table.module';
// import { FormModule } from './forms/forms.module';
// import { GridModule } from './grid/grid.module';
// import { BSComponentModule } from './bs-component/bsComponent.module';
// import { BSElementModule } from './bs-element/bsElement.module';

import { DashboardComponent } from './dashboard.component';

import {TopNavComponent} from '../shared/index';
import {SidebarComponent} from '../shared/index';

@NgModule({
    imports: [
        CommonModule,
    	RouterModule,
    	DropdownModule,
        ModalModule,
    	HomeModule,

        // Setting Modules
        MapSettingsModule,
        CameraSettingsModule,

        // Statistic Modules
        DatabaseStatisticModule,
        RealtimeStatisticModule,

        //Camera  Visualize
        CameraVisualizeModule,
     //    ChartModule,
     //    TableModule,
     //    FormModule,
     //    GridModule,
    	// BSComponentModule,
     //    BSElementModule,
     //    BlankPageModule
    ],
    declarations: [DashboardComponent, TopNavComponent, SidebarComponent],
    exports: [DashboardComponent, TopNavComponent, SidebarComponent]
})

export class DashboardModule { }
