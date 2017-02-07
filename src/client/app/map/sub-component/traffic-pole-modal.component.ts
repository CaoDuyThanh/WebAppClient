import { Component, Input } from '@angular/core';

// Import models
import { TrafficPole } from '../../service/models/CameraModel';

@Component({
    moduleId: module.id,
    selector: 'traffic-pole-modal-cmp',
    templateUrl: 'traffic-pole-modal.component.html'
})

export class TrafficPoleModalComponent {
    @Input() TrafficPole: TrafficPole;

    constructor() {
        this.TrafficPole = null;
    }
}
