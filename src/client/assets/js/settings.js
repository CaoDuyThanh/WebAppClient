// MAP SETTINGS

MAPCONFIG = {};
/**
 * URL CONFIG
 * @type {String}
 */
MAPCONFIG.ACCESS_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
MAPCONFIG.RASTER_SRC = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png';
MAPCONFIG.RASTER_URL = MAPCONFIG.RASTER_SRC + '?access_token=' + MAPCONFIG.ACCESS_TOKEN;
MAPCONFIG.VECTOR_SRC = 'https://{s}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf';
MAPCONFIG.VECTOR_URL = MAPCONFIG.VECTOR_SRC + '?access_token=' + MAPCONFIG.ACCESS_TOKEN;

/**
 * MAP CONFIG
 * @type {Array}
 */
MAPCONFIG.DEFAULT_VIEW = [10.7688, 106.6619];
MAPCONFIG.DEFAULT_ZOOM = 16;
MAPCONFIG.RELOAD_DENSITY = 10000;
MAPCONFIG.TRANSIT_STATUS = {
                              0: { display: 'no data', color: '#5b615f' },
                              1: { display: 'very fluid', color: '#1a9850' },
                              2: { display: 'fluid', color: '#91cf60' },
                              3: { display: 'dense', color: '#d9ef8b' },
                              4: { display: 'very dense', color: '#fee08b' },
                              5: { display: 'congested', color: '#fc8d59' },
                              6: { display: 'closed', color: '#d73027' },
                              other: { display: '', color: '#a418d5' }
                            };

 
/**
 * SERVER API CONFIG
 */
MAPCONFIG.DENSITY_API = "http://localhost:4000/density/streetspbf/";
MAPCONFIG.CAMERA_API = "http://localhost:4000/simulation/alltrafficpoles/";
  MAPCONFIG.CAMERA_MARK_SIZE = {"WIDTH": 50, "HEIGHT": 50};
















L.mapId = 'mapbox.streets';
L.attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, ' + 'Imagery © <a href="http://mapbox.com">Mapbox</a>';
L.color = new Array();
L.timeIterval = 1000;

