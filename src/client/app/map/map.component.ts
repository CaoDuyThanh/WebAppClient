import { Component, ElementRef, AfterViewInit } from '@angular/core';
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


// Import external javascript
// import '../../assets/js/leaflet-src.js';					// leaflet-src.js
// import '../../assets/js/leaflet.ajax.min.js';				// leaflet.ajax.min.js
// import '../../assets/js/leaflet.vectorgrid.bundled.js';		// leaflet.vectorgrid.bundled.js
// import '../../assets/js/leaflet.markercluster-src.js';	// leaflet.markercluster-src.js
// import '../../assets/js/leaflet-dvf.js';					// leaflet-dvf.js
// import '../../assets/js/long.js';						// long.js
// import '../../assets/js/bytebuffer.js';					// bytebuffer.js
// import '../../assets/js/protobuf.js';					// protobuf.js

declare let L: any;

@Component({
	moduleId: module.id,
	selector: 'map-cmp',
	templateUrl: 'map.component.html'
})

export class MapComponent implements AfterViewInit {
	private NUM_ITEMS: number = 5;

	private isLoadMap = false;
	private trafficPoles: TrafficPole[] = [];
	private selectedTrafficPole: TrafficPole = new TrafficPole();

	// Map Elements
	private mymap: any;
	private rasterLayer: any;
	private vectorLayer: any;
	private legendLayer: any;
	private densityLayer: any;

	// Density Handler
	private densityObservable: Observable<any>;
	private densityObserver: Observer<any>;

	// Search component
	private searchStr: string = '';
	private selectedSearch: any = '';
	private suggestSearch: any[] = [];


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
		var longTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/long.js');
		var byteBufferTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/bytebuffer.js');
		var protobufTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/protobuf.js');


		this.elementRef.nativeElement.appendChild(jqueryTag);
		this.elementRef.nativeElement.appendChild(leafletTag);
		this.elementRef.nativeElement.appendChild(leafletAjaxTag);
		this.elementRef.nativeElement.appendChild(leafletVectorgridTag);
		this.elementRef.nativeElement.appendChild(leafletDvfMarkersClusterTag);
		this.elementRef.nativeElement.appendChild(leafletDvfTag);
		this.elementRef.nativeElement.appendChild(longTag);
		this.elementRef.nativeElement.appendChild(byteBufferTag);
		this.elementRef.nativeElement.appendChild(protobufTag);
	}

	constructor(private cameraService: CameraService,
				private streetService: StreetService,
				private densityService: DensityService,
				private elementRef: ElementRef,
				private cssHelper: CSSHelper,
				private scriptHelper: ScriptHelper) {
				this.loadCss();
				this.loadJavascript();
				this.createSearchEvent();
	}

	ngAfterViewInit() {
		// var mapSettingsTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/settings.js');
		// var mapTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/map.js');

		// this.elementRef.nativeElement.appendChild(mapSettingsTag);
		// this.elementRef.nativeElement.appendChild(mapTag);

		setTimeout(() => {
			this.isLoadMap = true;
			console.log(this.isLoadMap);
			this.loadMap();
			this.loadCamera();
		}, 5000);
	}

	// LOAD MAP (START) ----------------------------------------

	createRasterLayer(): void {
		this.mymap = L.map('main_map');
		var rasterOption = {
			maxZoom: MapConfig.MAX_ZOOM,
			id: MapConfig.MAPID
		};
		this.rasterLayer = L.tileLayer(MapConfig.RASTER_URL, rasterOption);
		this.rasterLayer.addTo(this.mymap);
	}

	createVectorLayer(): void {
		var vectorOptions: any = {
			water: [],
			admin: [],
			country_label: [],
			marine_label: [],
			state_label: [],
			place_label: [],
			waterway_label: [],
			landuse: [],
			landuse_overlay: [],
			road: (properties: any, zoom: any) => {
				if (properties.class === 'main') {
	                this.densityObserver.next(properties.osm_id);
	            }

				return {
					weight: 0,
					opacity: 0
				};
			},
			poi_label: [],
			waterway: [],
			aeroway: [],
			tunnel: [],
			bridge: [],
			barrier_line: [],
			building: [],
			road_label: [],
			housenum_label: [],
		};
		var vectorGridOptions: any = {
			rendererFactory: L.canvas.tile,
			vectorTileLayerStyles: vectorOptions,
		};
		this.vectorLayer = L.vectorGrid.protobuf(MapConfig.VECTOR_URL, vectorGridOptions);
		this.vectorLayer.addTo(this.mymap);
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
		this.densityLayer = L.layerGroup();
		this.densityObservable = new Observable<any>((observer: Observer<any>) => { this.densityObserver = observer; });

		this.densityObservable
			.bufferCount(10)
			.subscribe(
				(trafficPoleIds: any) => {
					if (trafficPoleIds.length > 0) {
						(this.densityService.GetDensity(trafficPoleIds))
							.subscribe(
								(data: any) => {
									var streets = data.streets;
									streets.forEach((street: any) => {
						                var runData: any[] = [];
					                    var segments = street.segments;
					                    var lastSegment: any;
					                    segments.forEach((segment: any) => {
					                        var latlng = new L.LatLng(segment.node_start.lat, segment.node_start.lon);
					                        latlng.weight = 10 + segment.density_ste / 100;
					                        lastSegment = segment;
					                        runData.push(latlng);
					                    });
					                    var latlng = new L.LatLng(lastSegment.node_end.lat, lastSegment.node_end.lon);
					                    latlng.weight = 10 + lastSegment.density_ste / 100;
					                    runData.push(latlng);

					                    if (runData.length > 0) {
					                        var weightedPolyline = new L.WeightedPolyline(runData, {
					                            fill: true,
					                            fillColor: '#FF0000',
					                            fillOpacity: 0.4,
					                            stroke: false,
					                            dropShadow: false,
					                            gradient: true,
					                            weightToColor: new L.HSLHueFunction([10, 120], [10.5, 20])
					                        });

					                        // weightedPolyline.addTo(mymap);
					                        this.densityLayer.addLayer(weightedPolyline);
					                    }
						            });
								},
								(err: any) => {
									console.log(err);
								}
							);
					}
				},
				(err: any) => {
					console.log(err);
				}
		);

		this.densityLayer.addTo(this.mymap);
	}

	loadMap(): void {
		this.createRasterLayer();
		this.createVectorLayer();
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
		Observable.fromEvent(this.elementRef.nativeElement, 'keyup')
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
}
