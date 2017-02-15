import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CameraVisualizeComponent } from './camera-visualize.component';

@NgModule({
    imports: [
        BrowserModule,
    	RouterModule,
    	HttpModule,
    ],
    declarations: [
    	CameraVisualizeComponent
    ],
    exports: [CameraVisualizeComponent]
})

export class CameraVisualizeModule { }
