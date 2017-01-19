// variables
L.rasterUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
L.mapId = 'mapbox.streets';
L.attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>';
L.vectorUrl = 'https://{s}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
L.defaultView = [10.7686, 106.6619];
L.defaultZoom = 16;
L.densityAPI = "http://192.168.1.107:4000/density/streetspbf/";
L.cameraAPI = "http://192.168.1.107:4000/simulation/alltrafficpoles/";
L.cameraSize = {width: 50, height:50};
L.color = new Array();
L.timeIterval = 1000;

// Functions
L.getColor = function(state) {
    return state === '0' ? '#5b615f' :
           state === '1'  ? '#1a9850' :
           state === '2'  ? '#91cf60' :
           state === '3'  ? '#d9ef8b' :
           state === '4'   ? '#fee08b' :
           state === '5'   ? '#fc8d59' :
           state === '6'   ? '#d73027' :
                    '#a418d5';
}

L.transitStatus = {
    0: 'no data',
    1: 'very fluid',
    2: 'fluid',
    3: 'dense',
    4: 'very dense',
    5: 'congested',
    6: 'closed'
};