import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MapComponent } from './map.component';
import { ScriptHelper } from '../utils/script.helper';
import { CSSHelper } from '../utils/css.helper';

@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [MapComponent],
    exports: [MapComponent],
    providers: [ScriptHelper, 
    			CSSHelper]
})

export class MapModule { }
