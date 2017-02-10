import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ScriptHelper } from '../utils/script.helper';
import { CSSHelper } from '../utils/css.helper';
import { Observable, Observer } from 'rxjs';

// Load Map config
import { MapConfig } from './map.config';

// Import models
import { TrafficPole } from '../service/models/CameraModel';

// Import services
import { CameraService } from '../service/camera-service';
import { StreetService } from '../service/street-service';
import { DensityService } from '../service/density-service';

// Import utils
import { DensityMapHelper } from '../utils/map.helper';

declare let L: any;

@Component({
	moduleId: module.id,
	selector: 'map-cmp',
	templateUrl: 'map.component.html'
})

export class MapComponent implements AfterViewInit, OnDestroy {
	private NUM_ITEMS: number = 5;

	@ViewChild('searchdiv') private searchDiv: ElementRef;

	private isLoadMap = false;
	private trafficPoles: TrafficPole[] = [];
	private selectedTrafficPole: TrafficPole = new TrafficPole();
	private selectedTrafficPoleListener: Observer<any>;

	// Map Elements
	private mymap: any;
	private rasterLayer: any;
	private legendLayer: any;
	private densityMap: DensityMapHelper;

	// Search component
	private searchStr: string = '';
	private selectedSearch: any = '';
	private suggestSearch: any[] = [];

	// Timer
	private timer: any;

	loadCss(): void {
		// Load External CSS
		var leafletCss = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/leaflet.css');
		var styleCss = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/style.css');
		var leafletDvfCss = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/leaflet-dvf.css');
		var leafletMarkerClusterCss = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/markercluster.css');
		var leafletMarkerClusterDefaultCss = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/markercluster.default.css');
		var customStyle = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/custom-style.css');

		this.elementRef.nativeElement.appendChild(leafletCss);
		this.elementRef.nativeElement.appendChild(styleCss);
		this.elementRef.nativeElement.appendChild(leafletDvfCss);
		this.elementRef.nativeElement.appendChild(leafletMarkerClusterDefaultCss);
		this.elementRef.nativeElement.appendChild(leafletMarkerClusterCss);
		this.elementRef.nativeElement.appendChild(customStyle);
	}

	loadJavascript(): void {
		// Load External Javascript
		var jqueryTag = this.scriptHelper.CreateScriptTag('text/javascript', 'http://code.jquery.com/jquery-1.9.1.min.js');
		var leafletTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/leaflet-src.js');
		var leafletAjaxTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/leaflet.ajax.min.js');
		var leafletVectorgridTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/leaflet.vectorgrid.bundled.js');
		var leafletDvfMarkersClusterTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/leaflet.markercluster-src.js');
		var leafletDvfTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/leaflet-dvf.js');
		var leafletMultiOptionsPolylineTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/leaflet.multioptions.polyline.js');
		var longTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/long.js');
		var byteBufferTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/bytebuffer.js');
		var protobufTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/protobuf.js');
		var jwplayer = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/jwplayer.js');

		this.elementRef.nativeElement.appendChild(jqueryTag);
		this.elementRef.nativeElement.appendChild(leafletTag);
		this.elementRef.nativeElement.appendChild(leafletAjaxTag);
		this.elementRef.nativeElement.appendChild(leafletVectorgridTag);
		this.elementRef.nativeElement.appendChild(leafletDvfMarkersClusterTag);
		this.elementRef.nativeElement.appendChild(leafletDvfTag);
		this.elementRef.nativeElement.appendChild(leafletMultiOptionsPolylineTag);
		this.elementRef.nativeElement.appendChild(longTag);
		this.elementRef.nativeElement.appendChild(byteBufferTag);
		this.elementRef.nativeElement.appendChild(protobufTag);
		this.elementRef.nativeElement.appendChild(jwplayer);
	}

	constructor(private cameraService: CameraService,
				private streetService: StreetService,
				private densityService: DensityService,
				private elementRef: ElementRef,
				private cssHelper: CSSHelper,
				private scriptHelper: ScriptHelper) {
		this.loadCss();
		this.loadJavascript();

		// Timer
		this.timer = null;
	}

	ngAfterViewInit() {
		// var mapSettingsTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/settings.js');
		// var mapTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/map.js');

		// this.elementRef.nativeElement.appendChild(mapSettingsTag);
		// this.elementRef.nativeElement.appendChild(mapTag);
		this.createSearchEvent();
		setTimeout(() => {
			this.isLoadMap = true;
			this.loadMap();
			this.loadCamera();
		}, 5000);
	}

	// LOAD MAP (START) ----------------------------------------

	createRasterLayer(): void {
		this.mymap = L.map('main_map');
		var rasterOption = {
			minZoom: MapConfig.MIN_ZOOM,
			maxZoom: MapConfig.MAX_ZOOM,
			id: MapConfig.MAPID
		};
		this.rasterLayer = L.tileLayer(MapConfig.RASTER_URL, rasterOption);
		this.rasterLayer.addTo(this.mymap);
	}

	createControlLayer(): void {
		var rasterDisplayLayer = {
			'Raster layer': this.rasterLayer
		};
		L.control.layers(rasterDisplayLayer).addTo(this.mymap);
	}

	createLegendLayer(): void {
		this.legendLayer = L.control({ position: 'bottomright' });
		this.legendLayer.onAdd = function() {
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML += '<p>Transit Status</p>';
			for (let i: number = 0; i <= 6; i++) {
				div.innerHTML +=
					'<i style="background:' + MapConfig.TRANSIT_STATUS[i].color + '"></i> ' +
					MapConfig.TRANSIT_STATUS[i].display + '<br>';
			}
			return div;
		};
		this.legendLayer.addTo(this.mymap);
	}

	createDensityLayer(): void {
		this.densityMap = new DensityMapHelper(this.densityService, this.mymap);
		this.mymap.on('moveend', (event: any) => {
		   	var bounds = this.mymap.getBounds();
		   	var zoom = this.mymap.getZoom();

		   	var newBounds = {
		   		lat_start: bounds._southWest.lat,
		   		lon_start: bounds._southWest.lng,
		   		lat_end: bounds._northEast.lat,
		   		lon_end: bounds._northEast.lng
		   	};
		   	this.densityMap.Update(zoom, newBounds, L);
		});

		if (this.timer) {
			this.timer.unsubscribe();
		}
		var observable = Observable.timer(0, +MapConfig.RELOAD_DENSITY);
        this.timer = observable.subscribe(() => {
            var bounds = this.mymap.getBounds();
		   	var zoom = this.mymap.getZoom();

		   	var newBounds = {
		   		lat_start: bounds._southWest.lat,
		   		lon_start: bounds._southWest.lng,
		   		lat_end: bounds._northEast.lat,
		   		lon_end: bounds._northEast.lng
		   	};
		   	this.densityMap.Update(zoom, newBounds, L);
        });
	}

	loadMap(): void {
		this.createRasterLayer();
		// this.createVectorLayer();
		this.createControlLayer();
		this.createLegendLayer();
		this.createDensityLayer();

		// Start map
		this.mymap.setView(MapConfig.DEFAULT_VIEW, MapConfig.DEFAULT_ZOOM);
	}
	// LOAD MAP (END) ------------------------------------------

	addTrafficPolesMarker(): void {
		var iconOptions = L.icon({
			iconUrl: '<%= JS_SRC %>/images/camera.svg',
			iconSize: [60, 150],
			iconAnchor: [30, 150],
			popupAnchor: [-3, -76]
		});

		this.trafficPoles.forEach((trafficPole: TrafficPole) => {
			var marker = L.marker([trafficPole.Lat, trafficPole.Lon], { icon: iconOptions })
				.on('click', () => {
					this.selectedTrafficPole = trafficPole;
					this.selectedTrafficPoleListener.next('change');

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

	ClickSearch(): void {
		var searchDiv: any = $('#search_cmp' + ' .typeahead-input');
		this.searchStr = searchDiv.val();
		(this.streetService.GetLocation(this.searchStr))
			.subscribe(
			(result: any) => {
				this.mymap.panTo(L.latLng(result.lat, result.lon));
			},
			(err: any) => {
				console.log(err);
			}
			);
	}

	// SEARCH FUNCTION (START) ----------------------
	suggestSearchSelected(suggestSearch: any) {
		this.searchStr = suggestSearch ? suggestSearch.name : 'none';
	}

	createSearchEvent(): void {
		// Create suggest search event
		// var $searchDiv:any = $('.typeahead .typeahead-input');
		Observable.fromEvent(this.searchDiv.nativeElement, 'keyup')
			.map((e: any) => e.target.value)
			.filter((text: string) => text.length > 1)
			.debounceTime(50)
			.map((query: string) => this.streetService.SearchName(query, this.NUM_ITEMS))
			.switch()
			.subscribe(
			(results: any) => {
				this.suggestSearch = results.map((result: any) => {
					return {
						name: result,
						searchText: result
					};
				});
			},
			(err: any) => {
				console.log(err);
			}
			);
	}
	// SEARCH FUNCTION (END) -------------------------

	ngOnDestroy() {
		if (this.timer) {
			this.timer.unsubscribe();
		}
	}
}
