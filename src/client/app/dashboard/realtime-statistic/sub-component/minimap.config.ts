
export class MinimapConfig{
	static ACCESS_TOKEN: string = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
	static RASTER_SRC: string = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png';
	static RASTER_URL: string = MinimapConfig.RASTER_SRC + '?access_token=' + MinimapConfig.ACCESS_TOKEN;

	static MAPID: string = 'mapbox.streets';
	static DEFAULT_VIEW: any = [10.7688, 106.6619];
	static DEFAULT_ZOOM: number = 16;
	static MAX_ZOOM: number = 16;



}
