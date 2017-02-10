// Import service
import { DensityService } from '../service/density-service';

// Import map config
import { MapConfig } from '../map/map.config';

class BoxHelper {
	static IntersectArea(bound1: any, bound2: any): number {
		var intersectX = Math.min(bound1[2], bound2[2]) - Math.max(bound1[0], bound2[0]);
		var intersectY = Math.min(bound1[3], bound2[3]) - Math.max(bound1[1], bound2[1]);
		return intersectX * intersectY;
	}
}


class RegionHelper {
	// Region information
	private regionId: string;
	private streetType: string;
	private bounds: any;

	// Drawing
	private map: any;
	private lineOptions: any;
	private lineGroup: any;
	private densitySubscription: any;
	private streetData: any[];

	constructor(regionId: string,
				streetType: string,
				bounds: any,
				map: any,
				lineOptions: any) {
		//  Region information
		this.regionId = regionId;
		this.streetType = streetType;
		this.bounds = bounds;

		// Drawing
		this.map = map;
		this.lineOptions = lineOptions;
		this.lineGroup = null;
		this.densitySubscription = null;
	}

	// SET | GET (START) -------------------------------------------
	GetRegionId(): string {
		return this.regionId;
	}
	GetStreetType(): string {
		return this.streetType;
	}
	// SET | GET (END) ---------------------------------------------


	/**
	 * Redraw density map
	 * @param {DensityService} densityService	[description]
	 * @param {any}           		 			[description]
	 */
	Update(densityService: DensityService, L: any): void {
		if (this.densitySubscription) {
			this.densitySubscription.unsubscribe();
		}
		this.densitySubscription = (densityService.GetDensity(this.bounds, this.streetType))
			.subscribe(
				(data: any) => {
					var streets = data.streets;
					if (streets.length > 0) {
						if (!this.lineGroup) {
							this.lineGroup = L.layerGroup();
							this.streetData = [];
							streets.forEach((street: any) => {
								var runData: any[] = [];
								street.points.forEach((point: any) => {
									var latlng = new L.latLng(point.lat, point.lon, Math.floor((+point.dens / 100) * 7));
									runData.push(latlng);
								});
								if (runData.length > 0) {
			                        var polyLine: any = L.multiOptionsPolyline(runData, this.lineOptions);
			                        polyLine.addTo(this.lineGroup);
			                        this.streetData.push(polyLine);
			                    }
							});
							this.lineGroup.addTo(this.map);
						} else {
							var counter = 0;
							streets.forEach((street: any) => {
								var runData: any[] = [];
								street.points.forEach((point: any) => {
									var latlng = new L.latLng(point.lat, point.lon, Math.floor((+point.dens / 100) * 7));
									runData.push(latlng);
								});
								if (runData.length > 0) {
			                        var polyLine: any = L.multiOptionsPolyline(runData, this.lineOptions);
			                        this.streetData[counter].removeFrom(this.lineGroup);			// Remove old street
			                        this.streetData[counter] = polyLine;
			                        this.streetData[counter].addTo(this.lineGroup);					// Add new street
			                    }
			                    counter++;
							});
						}
					}
				},
				(err: any) => {
					console.log(err);
				}
			);
	}

	/**
	 * A cell is valid if it is still in the new bound and same newStreetType
	 * 			=>  Intersection area of this.bound and newBound > 0
	 * 			    and  this.streetType === newStreetType
	 * @param  {any}     newBound      [description]
	 * @param  {string}  newStreetType [description]
	 * @return {boolean}               [description]
	 */
	IsValid(newStreetType: string): boolean {
		if (newStreetType === this.streetType) {
			return true;
		}
		return false;
	}

	Destroy(): void {
		if (this.densitySubscription) {
			this.densitySubscription.unsubscribe();
		}
		if (this.lineGroup) {
			this.lineGroup.removeFrom(this.map);
		}
	}
}


export class DensityMapHelper {
	// Map information
	private zoom: number;
	private bounds: any;
	private streetType: string;

	// Service
	private densityService: DensityService;

	// Drawing
	private map: any;
	private lineOptions: any;
	private regions: any;

	constructor(densityService: DensityService,
				map: any) {
		// Map information
		this.zoom = 13;
		this.bounds = null;
		this.streetType = MapConfig.MAP_LEVEL_STREET_TYPE[this.zoom];

		// Service
		this.densityService = densityService;

		// Drawing
		this.map = map;
		this.regions = {};

		// Create line options
		this.createLineOptions();
	}

	createLineOptions() {
		var colorOptions: any[] = [];
		for (var key in MapConfig.TRANSIT_STATUS) {
			if (MapConfig.TRANSIT_STATUS.hasOwnProperty(key)) {
				var transitStatus = MapConfig.TRANSIT_STATUS[key];
				colorOptions.push({ color: transitStatus.color });
			}
		}

		this.lineOptions = {
        	multiOptions: {
		        optionIdxFn: (latLng: any) => {
		            return latLng.alt;
		        },
		        options: colorOptions,
			    weight: 6,
			    lineCap: 'butt',
			    opacity: 0.3,
			    smoothFactor: 1
			}
		};
	}

	latlonToCellId(lat: number, lon: number): number {
		lon = Math.floor(lon * 100) + 9000;
		lat = Math.floor(lat * 100) + 18000;
		return lon << 16 | lat;
	}

	getListRegionIds(): any {
		var listRegionIds: any = {};

		var deltaCells = MapConfig.MAP_LEVEL_DELTA[this.zoom];

		var latCellStart = Math.floor((this.bounds.lat_start / 0.01) / deltaCells) * deltaCells;
		var lonCellStart = Math.floor((this.bounds.lon_start / 0.01) / deltaCells) * deltaCells;
		var latCellEnd =  Math.floor((this.bounds.lat_end / 0.01) / deltaCells + 1) * deltaCells;
		var lonCellEnd = Math.floor((this.bounds.lon_end / 0.01) / deltaCells + 1) * deltaCells;

		for (let latCell: number = latCellStart; latCell < latCellEnd; latCell += deltaCells) {
			for (let lonCell: number = lonCellStart; lonCell < lonCellEnd; lonCell += deltaCells) {
				var latStart = latCell / 100;
				var latEnd = (latCell + deltaCells) / 100;
				var lonStart = lonCell / 100;
				var lonEnd = (lonCell + deltaCells) / 100;

				var cellStartId = this.latlonToCellId(latStart, lonStart);
				var cellEndId = this.latlonToCellId(latEnd, lonEnd);
				var regionId = cellStartId + '' + cellEndId;

				var bounds = {
					lat_start: latStart,
			   		lon_start: lonStart,
			   		lat_end: latEnd,
			   		lon_end: lonEnd
				};

				listRegionIds[regionId] = bounds;
			}
		}

		return listRegionIds;
	}

	reloadDensity(L: any): void {
		// Update list regions
		var listRegionIds: any = this.getListRegionIds();

		// Remove invalid regions
		for (var key in this.regions) {
			if (this.regions.hasOwnProperty(key)) {
				if (!listRegionIds[key] || !this.regions[key].IsValid(this.streetType)) {
					this.regions[key].Destroy();
					delete this.regions[key];
				}
			}
		}

		// Add new regions
		for (var key in listRegionIds) {
			if (listRegionIds.hasOwnProperty(key)) {
				if (!this.regions[key]) {
					this.regions[key] = new RegionHelper(key, this.streetType, listRegionIds[key], this.map, this.lineOptions);
				}
			}
		}

		// Update current cells
		for (var key in this.regions) {
			if (this.regions.hasOwnProperty(key)) {
				var region = this.regions[key];
				region.Update(this.densityService, L);
			}
		}
	}

	Update(zoom: number, bounds: any, L:any) {
		this.zoom = zoom;
		this.streetType = MapConfig.MAP_LEVEL_STREET_TYPE[this.zoom];
		this.bounds = bounds;
		this.reloadDensity(L);
	}
}




