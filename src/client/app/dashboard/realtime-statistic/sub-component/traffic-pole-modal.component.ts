import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';

// Import models
import { TrafficPole, Camera } from '../../../service/models/CameraModel';

declare let jwplayer: any;

@Component({
    moduleId: module.id,
    selector: 'traffic-pole-modal-cmp',
    templateUrl: 'traffic-pole-modal.component.html'
})

export class TrafficPoleModalComponent implements AfterViewInit {
    @Input() TrafficPole: TrafficPole;
    @Output() Camera: EventEmitter<Camera>;
    @Output() Listener: EventEmitter<Observer<any>> = new EventEmitter<Observer<any>>();

    private observable: Observable<any>;

    constructor() {
        this.TrafficPole = null;
        this.Camera = new EventEmitter<Camera>();
    }

    ngAfterViewInit() {
        this.observable = new Observable<any>((observer: any) => {
            this.Listener.next(observer);
        });
        this.observable.subscribe(
            (result: any) => {
                setTimeout(() => {
                    for (var idx = 0; idx < this.TrafficPole.Cameras.length; idx++) {
                        var camera = this.TrafficPole.Cameras[idx];
                        if(camera.IsActive) {
                            var lastIdx = camera.StreamId.lastIndexOf('/');
                            var first = camera.StreamId.substring(0, lastIdx);
                            var second = camera.StreamId.substring(lastIdx + 1, camera.StreamId.length);
                            jwplayer(camera.StreamId).setup({
                                'flashplayer': 'assets/js/player.swf',
                                'file': second,
                                'streamer': first,
                                'controlbar': 'bottom',
                                'width': '100%',
                                'height': '450'
                            });
                        }
                    }
                }, 1000);
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    ClickAddCamera(camera: Camera): void {
        camera.Parent = this.TrafficPole;
        this.Camera.next(camera);
    }
}
