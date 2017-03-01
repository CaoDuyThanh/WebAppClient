import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ServerDensitySettingsComponent } from './server-density-settings.component';

// Import module

// Import sub Component


@NgModule({
    imports: [
        BrowserModule,
    	RouterModule,
    	HttpModule,
    	FormsModule
    ],
    declarations: [
    	ServerDensitySettingsComponent
    ],
    exports: [ServerDensitySettingsComponent]
})

export class ServerDensitySettingsModule { }
