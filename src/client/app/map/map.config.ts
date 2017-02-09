export class MapConfig {
	/**
	 * URL CONFIG
	 * @type {String}
	 */
	static ACCESS_TOKEN: string = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
	static RASTER_SRC: string = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png';
	static RASTER_URL: string = MapConfig.RASTER_SRC + '?access_token=' + MapConfig.ACCESS_TOKEN;
	static VECTOR_SRC = 'https://{s}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf';
	static VECTOR_URL = MapConfig.VECTOR_SRC + '?access_token=' + MapConfig.ACCESS_TOKEN;

	/**
	 * MAP CONFIG
	 * @type {Array}
	 */
	static MAPID: string = 'mapbox.streets';
	static DEFAULT_VIEW: any = [10.7688, 106.6619];
	static DEFAULT_ZOOM: number = 16;
	static MIN_ZOOM: number = 13;
	static MAX_ZOOM: number = 20;
	static RELOAD_DENSITY = 10000;
	static TRANSIT_STATUS:any = {
	                              	0: { display: 'no data', color: '#5b615f' },
	                              	1: { display: 'very fluid', color: '#1a9850' },
	                              	2: { display: 'fluid', color: '#91cf60' },
	                              	3: { display: 'dense', color: '#d9ef8b' },
	                              	4: { display: 'very dense', color: '#fee08b' },
	                              	5: { display: 'congested', color: '#fc8d59' },
	                              	6: { display: 'closed', color: '#d73027' },
	                              	other: { display: '', color: '#a418d5' }
	                            };


	static MAP_LEVEL_DELTA: any = {
		20: 1,
		19: 1,
		18: 1,
		17: 1,
		16: 1,
		15: 1,
		14: 2,
		13: 6
	};

	static MAP_LEVEL_STREET_TYPE: any = {
		20: 'service',
		19: 'service',
		18: 'residential',
		17: 'secondary',
		16: 'secondary',
		15: 'secondary',
		14: 'trunk',
		13: 'motorway'
	};
}
