// import THREE from 'three';


// ------------------------------------- Draw basic map ------------------------------

var worldPos = [0,0];

//init work environment
var world = VIZI.world(settings_3d.worldDiv, {
  skybox: false,
  postProcessing: false
}).setView(settings_3d.coords);

// Add controls
VIZI.Controls.orbit().addTo(world);

// CartoDB basemap
var imageLayer = VIZI.imageTileLayer(settings_3d.rasterAPI, {
  attribution: settings_3d.rasterAtb
}).addTo(world);

// Buildings from Mapzen
var topoLayer = VIZI.topoJSONTileLayer(settings_3d.vectorBuildingsAPI, {
    interactive: false,

    // Config building height with random function and building color base on building height
    style: function(feature) { 
        var height;
        // Chroma scale for height-based colours
        var colourScale = chroma.scale('YlOrBr').domain([0,200]);

        if (feature.properties.height) {
          height = feature.properties.height;
        } else {
          height = 10 + Math.random() * 10;//min height is 10 if dont have this properties
        }

        // colo base on height
        var colour = colourScale(height).hex();

        return {
          color: colour,
          height: height
        };
    },
    filter: function(feature) {
        // Don't show points
        return feature.geometry.type !== 'Point';
    },
    attribution: settings_3d.vectorAtb
}).addTo(world);

// ------------------------------------Density------------------

var newTopoJSONTileLayer, oldTopoJSONTileLayer;

var clearDensityLayer = function(){
    if(oldTopoJSONTileLayer != undefined){
        world.removeLayer(oldTopoJSONTileLayer);
        oldTopoJSONTileLayer.destroy();
        oldTopoJSONTileLayer = undefined;
    }
}

var getFilterRoad = function(height){
    var kind = [];
    kind.push("motorway");
    kind.push("motorway_link"); 
    if(height > 11000) return kind;

    kind.push("trunk");
    kind.push("trunk_link");

    if(height > 9000) return kind;

    kind.push("primary");
    kind.push("primary_link");
    if(height > 7000) return kind;

    kind.push("primary");
    kind.push("primary_link");
    if(height > 5000) return kind;

    kind.push("secondary");
    kind.push("secondary_link");
    if(height > 3000) return kind;

    kind.push("tertiary");
    kind.push("tertiary_link");
    if(height > 2000) return kind;

    kind.push("tertiary");
    kind.push("tertiary_link");
    if(height > 1000) return kind;

    kind.push("residential");

    if(height > 500) return kind;
    kind.push(" service");

    return kind;
}

var drawDensityLayer = function(){
    
    oldTopoJSONTileLayer = newTopoJSONTileLayer;
    var count = 0;
    
    if (settings_3d.density){
        var kind = getFilterRoad(world._engine._camera.position.y);

        // for()
        newTopoJSONTileLayer = VIZI.topoJSONTileLayer(settings_3d.vectorRoadsAPI, {
            interactive: false,
            style: function(feature) {
                var height;

                //get density color from server
                getDensityById(feature.properties.id);

                var color = getDensityColor(retColor[feature.properties.id]);

                return {
                    height: height,
                    lineColor: color,
                    lineWidth: 3,
                    lineTransparent: false,
                    lineOpacity: 0.7,
                    lineBlending: THREE.AdditiveBlending,
                    lineRenderOrder: 2
                };
            },
            filter: function(feature) {

                // return feature.geometry.type !== 'Point' && (feature.properties.kind == 'major_road' );
                return feature.geometry.type !== 'Point' && kind.indexOf(feature.properties.highway) > -1;
            },
            attribution: settings_3d.vectorAtb
        }).addTo(world);

        //clean old data
        setTimeout(function(){clearDensityLayer()},500);

        
    } else {
        if(oldTopoJSONTileLayer != undefined){
            world.removeLayer(oldTopoJSONTileLayer);
            oldTopoJSONTileLayer.destroy();
            newTopoJSONTileLayer = undefined;
        }
    }
}
// drawDensityLayer();
window.setInterval(drawDensityLayer, settings_3d.densityTimeout);

// ------------------------------------On mouse click functions------------------
function getClickPosition(e) {
    //Init environment variables
    var engine = world._engine;

    var point = new VIZI.Point(e.clientX - worldPos[1], e.clientY - worldPos[0], 0);
    var vector = new THREE.Vector3();

    // Get latlon base on mouse click
    vector.set(
        ( point.x / engine._picking._width ) * 2 - 1,
        - ( point.y / engine._picking._height ) * 2 + 1,
        0.5 );

    vector.unproject( engine._camera );

    dir = vector.sub( engine._camera.position ).normalize();

    distance = - engine._camera.position.y / dir.y;

    var pos = engine._camera.position.clone().add( dir.multiplyScalar( distance ) );

    //change camera model position
    if(controls.changePosition){       

        //update latlon on gui
        var latlon = world.pointToLatLon(new VIZI.Point(pos.x, pos.z));
        
        cameraInformationList[cameraIndex].lat = latlon.lat;
        cameraInformationList[cameraIndex].lon = latlon.lon;
        controls.lat = latlon.lat;
        controls.lon = latlon.lon;

        //redraw camera model
        controls.updateDraw();
        updateGuiElement(gui);
    }
}

// Listen onmouse click function
var worldElement = document.getElementById(settings_3d.worldDiv)
worldElement.addEventListener("click", getClickPosition);
var rect = worldElement.getBoundingClientRect();
var worldPos = [rect.top, rect.left];

// ----------------------------------------Dat GUI----------------------------------------
var controls = CameraToControl(cameraInformationList[0]); //default is 0
var gui = createGUI(controls);
gui.domElement.id = 'gui';
// var mapContainer = document.getElementById("container");
// mapContainer.appendChild(gui.domElement);

var camerList = [];
var cameraIndex = 0;
var viewIndex = 0;

//------------------------- Draw camera layer and add to camera list -----------------------
var select_list = document.getElementById(settings_3d.cameraListDiv);
var cameraLayer = new VIZI.Layer();

getJSON(settings_3d.getPoles);
//------------------------- Change camera event -------------------------------------------
//change current camera index
function changeCamera(){
    cameraIndex = this.value;

    // update dat gui
    updateGUI(cameraInformationList[cameraIndex], controls, gui);

    //redraw camera model
    controls.updateDraw();  

    //fly to current camera
    var latlon = new VIZI.LatLon(cameraInformationList[cameraIndex].lat, cameraInformationList[cameraIndex].lon);
    
    world._controls[0].flyToLatLon(latlon, 3, 1);

    //update video player
    setupPlayer(settings_3d.playerDiv, cameraInformationList[cameraIndex].cameras[viewIndex].stream_id, 300, 280);  

}

// Listen onchange function
select_list.addEventListener("change", changeCamera);


//load camera information from server
//TODO: change cameraInformationListTmp to cameraInformationList when finish
var cameraInformationListTmp = {};
