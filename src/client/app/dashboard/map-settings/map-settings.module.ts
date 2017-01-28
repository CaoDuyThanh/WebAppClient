import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MapSettingsComponent } from './map-settings.component';

@NgModule({
    imports: [RouterModule],
    declarations: [MapSettingsComponent],
    exports: [MapSettingsComponent]
})

export class MapSettingsModule { }
