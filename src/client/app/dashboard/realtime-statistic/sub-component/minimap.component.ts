/// <reference path='../../../../../../node_modules/@types/leaflet/index.d.ts'/>
import { Component, OnInit, ElementRef } from '@angular/core';
import { ScriptHelper } from '../../../utils/script.helper';
import { CSSHelper } from '../../../utils/css.helper';
import { MinimapConfig } from './minimap.config';

// Import services
import { CameraService } from '../../../service/camera-service';

// Import models
import { TrafficPole, Camera } from '../../../service/models/CameraModel';

@Component({
    moduleId: module.id,
    selector: 'minimap-cmp',
    templateUrl: 'minimap.component.html'
})

export class MinimapComponent implements OnInit {
    private isLoadMap: boolean;
    private trafficPoles: TrafficPole[];
    private selectedTrafficPole: TrafficPole;
    private mymap: any;

    // Realtime camera components
    private componentIds:number[];
    private cameras: Camera[];

    constructor(private cameraService: CameraService,
                private elementRef: ElementRef,
                private scriptHelper: ScriptHelper,
                private cssHelper: CSSHelper) {
        this.isLoadMap = false;
        this.trafficPoles = [];
        this.selectedTrafficPole = new TrafficPole();
        this.componentIds = [];
        this.cameras = [];
    }

    ngOnInit() {
        // Load External CSS
        var leafletCss = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/leaflet.css');
        this.elementRef.nativeElement.prepend(leafletCss);

        // Load External Javascript
        var leafletTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/leaflet-src.js');
        var leafletAjaxTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/leaflet.ajax.min.js');

        this.elementRef.nativeElement.prepend(leafletTag);
        this.elementRef.nativeElement.prepend(leafletAjaxTag);
    }

    loadMap(): void {
        this.mymap = L.map('minimap');
        var rasterOption = {
            maxZoom: MinimapConfig.MAX_ZOOM,
            id: MinimapConfig.MAPID
        };
        var rasterLayer = L.tileLayer(MinimapConfig.RASTER_URL, rasterOption);
        rasterLayer.addTo(this.mymap);
        var rasterDisplayLayer = {
            'Raster layer': rasterLayer
        };
        L.control.layers(rasterDisplayLayer).addTo(this.mymap);
        this.mymap.setView(MinimapConfig.DEFAULT_VIEW, MinimapConfig.DEFAULT_ZOOM);
    }

    addTrafficPolesMarker(): void {
        this.trafficPoles.forEach((trafficPole: TrafficPole) => {
            var marker = L.marker([trafficPole.Lat, trafficPole.Lon])
                          .on('click', () => {
                                this.selectedTrafficPole = trafficPole;

                                var trafficPoleModal: any = $('#ShowTrafficPoleBtn');
                                trafficPoleModal.click();
                          });


            marker.addTo(this.mymap);
        });
    }

    loadCamera(): void {
        (this.cameraService.GetAllTrafficPoles())
            .subscribe(
                (results: TrafficPole[]) => {
                    this.trafficPoles = results;
                    this.addTrafficPolesMarker();
                },
                (err: any) => {
                    console.log(err);
                }
            );
    }

    SelectTrafficPole(trafficPole: TrafficPole): void {
        this.mymap.panTo(L.latLng(trafficPole.Lat, trafficPole.Lon));
    }

    ClickLoadMap(): void {
        this.isLoadMap = true;
        this.loadMap();
        this.loadCamera();
    }

    CreateComponentId(idx: number):string {
        return 'Component' + idx.toString();
    }

    AddCamera(camera: Camera): void {
        if (camera) {
            var currentTimeStamp = Math.floor(Date.now() / 1000);
            this.componentIds.push(currentTimeStamp);

            this.cameras.push(camera);
        }
    }

    ClickDeleteCamera(componentId:number): void {
        var idx = this.componentIds.indexOf(componentId);
        this.componentIds.splice(idx, 1);
        this.cameras.splice(idx, 1);
    }
}
