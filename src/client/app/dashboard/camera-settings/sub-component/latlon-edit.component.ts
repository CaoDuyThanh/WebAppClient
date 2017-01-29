import { Component, OnInit, Injector} from '@angular/core';

// Import Models
import { TrafficPole, Camera, LatLon } from '../../../service/models/CameraModel';

@Component({
    moduleId: module.id,
	selector: 'latlon-edit-cmp',
	templateUrl: 'latlon-edit.component.html'
})

export class LatlonEdit {
	public Latlon: LatLon;
	public IsEdit: boolean;

	constructor(private injector: Injector){
		this.Latlon = this.injector.get('Latlon');
		this.IsEdit = this.injector.get('IsEdit');
	}
}
