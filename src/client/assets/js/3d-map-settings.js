// settings_3d
var settings_3d = {};


//Set default location
// Ho Chi Minh localtion
settings_3d.coords = [10.8019, 106.6748];
// Manhattan location
// var coords = [40.739940, -73.988801];

//default size for threejs model
settings_3d.defaultX = 1;
settings_3d.defaultY = 30;
settings_3d.defaultZ = 1;
settings_3d.default = 1/5;

//tile server
settings_3d.rasterAPI = 'https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
settings_3d.rasterAtb = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';
settings_3d.vectorBuildingsAPI = 'https://vector.mapzen.com/osm/buildings/{z}/{x}/{y}.topojson?api_key=vector-tiles-NT5Emiw';
settings_3d.vectorRoadsAPI = 'https://vector.mapzen.com/osm/roads/{z}/{x}/{y}.topojson?api_key=vector-tiles-NT5Emiw';
settings_3d.vectorAtb = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://whosonfirst.mapzen.com#License">Who\'s On First</a>.';

//API from server
// get all poles
settings_3d.getPoles = 'http://192.168.1.107:4000/simulation/alltrafficpoles';
settings_3d.deletePole = 'http://192.168.1.107:4000/simulation/trafficpole/';
settings_3d.updatePole = 'http://192.168.1.107:4000/simulation/trafficpole/';
settings_3d.addPole = "http://192.168.1.107:4000/simulation/trafficpole/";

//div name
settings_3d.worldDiv = "world";
settings_3d.cameraListDiv = "camera_list";
settings_3d.optionDiv = "option";
settings_3d.playerDiv = "mediaspace";

//TODO: streaming server
//settings_3d
settings_3d.streamingServer = "rtmp://192.168.1.107/myapp/camera_";

//density layer
settings_3d.density = false;
settings_3d.densityTimeout = 5000;
settings_3d.maxDensity = 100;
settings_3d.densityAPI = 'http://192.168.1.72:4000/density/streets?';


