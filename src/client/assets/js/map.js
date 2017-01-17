/**
 * INITIALIZE MAP
 */
var mymap = L.map('mapid');
var protobuf = dcodeIO.ProtoBuf;
var bytebuffer = dcodeIO.ByteBuffer;


/**
 * CREATE RASTER LAYER
 */
var rasterOption = {
    maxZoom: 18,
    attribution: L.attribution,
    id: L.mapId
}
var rasterLayer = L.tileLayer(L.rasterUrl, rasterOption);
rasterLayer.addTo(mymap);


/**
 * CREATE TILE LAYER
 */
//Density layer using vector tile
var groupRoads = [];
var vectorOptions = {
    water: [],
    admin: [],
    country_label: [],
    marine_label: [],
    state_label: [],
    place_label: [],
    waterway_label: [],
    landuse: [],
    landuse_overlay: [],
    road: function LoadRoadDensity(properties, zoom) {
            if (properties.class == 'main' || properties.class == 'motorway'|| properties.class == 'path') {
                groupRoads.push(properties.osm_id);
                if (groupRoads.length >= 50){
                    sendAjax(groupRoads);
                    groupRoads = [];
                }
            }
            return {
                weight: 0,
                opacity: 0,
            }
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
var vectorGridOptions = {
    rendererFactory: L.canvas.tile,
    vectorTileLayerStyles: vectorOptions,
};
var vectorLayer = L.vectorGrid.protobuf(L.vectorUrl, vectorGridOptions);
vectorLayer.addTo(mymap);


/**
 * AUTO LOAD DENSITY MAP - REAL TIME UPDATE
 */
function autoLoadDensityMap(){
    console.log('Reload map !');

    if (vectorLayer != null){
        vectorLayer.removeFrom(mymap);        
    }
    vectorLayer.addTo(mymap);
    setTimeout(autoLoadDensityMap, 10000);
}
autoLoadDensityMap();

/**
 * REQUEST - RESPONE HANDLER
 */
// Load density of a group of roads
var loadDensityGroupRoads = function(){
    if (0 < groupRoads.length && groupRoads.length < 50){
        sendAjax(groupRoads);
        groupRoads = [];
    }
    setTimeout(loadDensityGroupRoads, 3000);
}
loadDensityGroupRoads();

// Create protobuffer handler
var builder = protobuf.loadProtoFile('/app/map/streets.proto');
var DensityStreetsProtobuf = builder.build("DensityStreets").DensityStreets;
 

var listOfPolyline = [];



var sendAjax = function(data){
    var url = L.densityAPI;
    for (var idx = 0; idx < data.length; idx++){
        if (url.indexOf('?') === -1){
            url = url + "?streetIds[]=" + data[idx];
        }else{
            url = url + "&streetIds[]=" + data[idx];
        }
    }
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(buffer){
        if (this.status == 200){
            var data = DensityStreetsProtobuf.decode(this.response);
            var streets = data.streets;
            streets.forEach(function(street){
                var streetId = street.street_id;
                if (listOfPolyline.hasOwnProperty(streetId)){
                    var weightedPolyline = listOfPolyline[streetId];
                    var segments = street.segments;
                    var lastSegment;
                    var count = 0;
                    segments.forEach(function(segment){
                        weightedPolyline._latlngs[count].weight = 10 + segment.density_ste / 100;
                        lastSegment = segment;
                        count++;
                    });
                    var latlng = new L.LatLng(lastSegment.node_end.lat, lastSegment.node_end.lon);
                    latlng.weight = 10 + lastSegment.density_ste / 100;

                    weightedPolyline.removeFrom(mymap);
                    var weightedPolyline = new L.WeightedPolyline(weightedPolyline._latlngs, {
                            fill: true,
                            fillColor: '#FF0000',
                            fillOpacity: 0.4,
                            stroke: false,
                            dropShadow: false,
                            gradient: true,
                            weightToColor: new L.HSLHueFunction([10, 120], [10.5, 20])
                        });                       
                    weightedPolyline.addTo(mymap);
                    listOfPolyline[streetId] = weightedPolyline;
                }else{
                    var runData = [];
                    var segments = street.segments;
                    var lastSegment;
                    segments.forEach(function(segment){
                        var latlng = new L.LatLng(segment.node_start.lat, segment.node_start.lon);
                        latlng.weight = 10 + segment.density_ste / 100;
                        runData.push(latlng);
                        lastSegment = segment;
                    });

                    var latlng = new L.LatLng(lastSegment.node_end.lat, lastSegment.node_end.lon);
                    latlng.weight = 10 + lastSegment.density_ste / 100;
                    runData.push(latlng);

                    if (runData.length > 0){                    
                        var weightedPolyline = new L.WeightedPolyline(runData, {
                            fill: true,
                            fillColor: '#FF0000',
                            fillOpacity: 0.4,
                            stroke: false,
                            dropShadow: false,
                            gradient: true,
                            weightToColor: new L.HSLHueFunction([10, 120], [10.5, 20])
                        });
                        listOfPolyline[streetId] = weightedPolyline;
                        weightedPolyline.addTo(mymap);
                    }
                }
            });
        }
    }
    xhr.send();


    // $.ajax({
    //     url: L.densityAPI, 
    //     type: "get",
    //     responseType:'arraybuffer',
    //     data: {
    //         streetIds: data
    //     },
    //     success: function(buffer){
    //         console.log(typeof(buffer));
    //         var data = DensityStreetsProtobuf.decode(buffer);

    //         console.log(data);

    //         // var streets = result;            
    //         // for (var streetId in streets){
    //         //     if (streets.hasOwnProperty(streetId)){
    //         //         var segments = streets[streetId];

    //         //         if (listOfPolyline.hasOwnProperty(streetId)){
    //         //             var weightedPolyline = listOfPolyline[streetId];
    //         //             var count = 0;
    //         //             var lastSegment;
    //         //             for (var segmentId in segments){
    //         //                 if (segments.hasOwnProperty(segmentId)) {
    //         //                     var segment = segments[segmentId];
    //         //                     weightedPolyline._latlngs[count].weight = 10 + segment.density_ste / 100;
    //         //                     lastSegment = segment;
    //         //                     count++;
    //         //                 }
    //         //             }
    //         //             var latlng = new L.LatLng(segment.node_end.lat, segment.node_end.lon);
    //         //             latlng.weight = 10 + segment.density_ste / 100;

    //         //             weightedPolyline.removeFrom(mymap);
    //         //             var weightedPolyline = new L.WeightedPolyline(weightedPolyline._latlngs, {
    //         //                     fill: true,
    //         //                     fillColor: '#FF0000',
    //         //                     fillOpacity: 0.4,
    //         //                     stroke: false,
    //         //                     dropShadow: false,
    //         //                     gradient: true,
    //         //                     weightToColor: new L.HSLHueFunction([10, 120], [10.5, 20])
    //         //                 });                       
    //         //             weightedPolyline.addTo(mymap);
    //         //             listOfPolyline[streetId] = weightedPolyline;
    //         //         }else{
    //         //             var runData = [];
    //         //             var lastSegment;
    //         //             for (var segmentId in segments){
    //         //                 if (segments.hasOwnProperty(segmentId)) {
    //         //                     var segment = segments[segmentId];
    //         //                     var latlng = new L.LatLng(segment.node_start.lat, segment.node_start.lon);
    //         //                     latlng.weight = 10 + segment.density_ste / 100;
    //         //                     runData.push(latlng);
    //         //                     lastSegment = segment;
    //         //                 }          
    //         //             }

    //         //             var latlng = new L.LatLng(segment.node_end.lat, segment.node_end.lon);
    //         //             latlng.weight = 10 + segment.density_ste / 100;
    //         //             runData.push(latlng);

    //         //             if (runData.length > 0){                    
    //         //                 var weightedPolyline = new L.WeightedPolyline(runData, {
    //         //                     fill: true,
    //         //                     fillColor: '#FF0000',
    //         //                     fillOpacity: 0.4,
    //         //                     stroke: false,
    //         //                     dropShadow: false,
    //         //                     gradient: true,
    //         //                     weightToColor: new L.HSLHueFunction([10, 120], [10.5, 20])
    //         //                 });
    //         //                 listOfPolyline[streetId] = weightedPolyline;
    //         //                 weightedPolyline.addTo(mymap);
    //         //             }
    //         //         }
    //         //     }
    //         // }
    //     },
    //     error: function(XMLHttpRequest, textStatus, errorThrown){
    //         console.log('Error while loading density map');
    //     }
    // });  
}


/**
 * ADD LEGEND LAYER
 */
var legend = L.control({position: 'bottomright'});
// status (0 = no data, 1 = very fluid, 2 = fluid, 3 = dense, 4 = very dense, 5 = congested, 6 = closed).
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<p>Transit Status</p>';
    for (var i = 0; i <= 6; i++) {
        div.innerHTML +=
            '<i style="background:' + L.getColor(i+"") + '"></i> ' +
            L.transitStatus[i] + '<br>';
    }
    return div;
};
legend.addTo(mymap);


/**
 * CREATE POP UP WHEN CLICK ON MAP
 * @type {[type]}
 */
// var popup = L.popup();
// function onMapClick(e) {
//     popup.setLatLng(e.latlng)
//          .setContent("You clicked the map at " + e.latlng.toString())
//          .openOn(mymap);
// }
// mymap.on('click', onMapClick);


/**
 * CREATE LEGEND CONTROL
 * @type {Layer}
 */
var legendControl = new L.Control.Legend();
legendControl.addTo(mymap);


/**
 * ADD RASTER LAYER AND TILE LAYER TO MAP
 * @type {Object}
 */
var rasterDisplayLayer = {
    "Raster layer": rasterLayer
};
var vectorDisplayLayer = {
    "Density layer": vectorLayer,
};
var layerControl = L.control.layers(rasterDisplayLayer, vectorDisplayLayer).addTo(mymap);
mymap.setView(L.defaultView, L.defaultZoom);







