import { Component, OnInit, ElementRef } from '@angular/core';
import { ScriptHelper } from '../../../utils/script.helper';
import { CSSHelper } from '../../../utils/css.helper';
import { MinimapConfig } from './minimap.config';

// Import services
// import { CameraService } from '../../../service/camera-service';

// Import models
import { LatLon } from '../../../service/models/CameraModel';

declare let L: any;

@Component({
    moduleId: module.id,
    selector: 'minimap-point-cmp',
    templateUrl: 'minimap-point.component.html'
})

export class MinimapPointComponent implements OnInit {
    private isLoadMap: boolean;
    private mymap: any;
    private trafficPoints: LatLon[];
    private selectedTrafficPoint: LatLon;
    private currentIndex:number;

    // Realtime camera components
    private componentIds:number[];

    constructor(private elementRef: ElementRef,
                private scriptHelper: ScriptHelper,
                private cssHelper: CSSHelper) {
        this.isLoadMap = false;
        this.componentIds = [];
        this.trafficPoints = [];
        this.currentIndex = 0;
        this.selectedTrafficPoint = new LatLon();
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
        this.mymap = L.map('minimap-point');
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

        // TODO: get point to view here
        this.mymap.on('click', (e:any) => {

            var point = new LatLon();
            point.Lat = e.latlng.lat;
            point.Lon = e.latlng.lng;

            this.trafficPoints.push(point);//add to map
            this.addTrafficPolesMarker(point);
        });
    }

    addTrafficPolesMarker(trafficPoint:LatLon): void {
        //create marker
        var iconOptions = L.icon({
            iconUrl: '<%= JS_SRC %>/images/marker-icon.png',
            shadowUrl: '<%= JS_SRC %>/images/marker-shadow.png',

            iconSize:     [30, 50],
            iconAnchor:   [15, 50],
            shadowSize:   [70, 20],
            shadowAnchor: [35, 20],
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        var marker = L.marker([trafficPoint.Lat, trafficPoint.Lon], {icon: iconOptions})
                        .on('click', () => {
                            this.selectedTrafficPoint = trafficPoint;
                            this.currentIndex = this.trafficPoints.indexOf(trafficPoint) + 1;
                            //add to view
                                // if(this.trafficPoints.indexOf(trafficPoint) < 0 ){
                            this.AddPoint(trafficPoint);
                                // }
                            });

        marker.addTo(this.mymap).bindPopup('Point_' + this.trafficPoints.length);
    }

    ClickLoadMap(): void {
        this.isLoadMap = true;
        this.loadMap();
    }

    CreateComponentId(idx: number):string {
        return 'Component' + idx.toString();
    }

    AddPoint(point: LatLon): void {
        if (point) {
            var currentTimeStamp = Math.floor(Date.now());
            this.componentIds.push(currentTimeStamp);
        }
    }

    ClickDeletePoint(componentId:number): void {
        var idx = this.componentIds.indexOf(componentId);
        this.componentIds.splice(idx, 1);
        // this.trafficPoints.splice(idx, 1);
    }
}
