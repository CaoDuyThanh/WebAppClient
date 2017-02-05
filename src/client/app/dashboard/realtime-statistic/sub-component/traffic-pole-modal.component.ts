import { Component, EventEmitter, Input, Output } from '@angular/core';

// Import models
import { TrafficPole, Camera } from '../../../service/models/CameraModel';

@Component({
    moduleId: module.id,
    selector: 'traffic-pole-modal-cmp',
    templateUrl: 'traffic-pole-modal.component.html'
})

export class TrafficPoleModalComponent {
    @Input() TrafficPole: TrafficPole;
    @Output() Camera: EventEmitter<Camera>;

    constructor() {
        this.TrafficPole = null;
        this.Camera = new EventEmitter<Camera>();
    }

    ClickAddCamera(camera: Camera): void {
        camera.Parent = this.TrafficPole;
        this.Camera.next(camera);
    }
}
