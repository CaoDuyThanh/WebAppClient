
// utils functions
var updatePosition = function(object, point3d, y){
    object.position.x = point3d.x;
    object.position.y = y/2;
    object.position.z = point3d.z;
    return object;
}

//----------------------------------- Load map maker -------------------------------
function createMaker(){
    // Using wireframe materials to illustrate shape details.
    var darkMaterial = new THREE.MeshBasicMaterial( { color: 0xffffcc } );
    var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } ); 
    var multiMaterial = [ darkMaterial, wireframeMaterial ]; 

    // octahedron
    var shape = THREE.SceneUtils.createMultiMaterialObject( 
        // radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
        new THREE.CylinderGeometry( 0, 30, 50, 8, 2 ), 
        multiMaterial );
    shape.scale.y = -1;

    return shape;
}

//create three cube
var createCube = function(x, y, z, color){
	var geometry = new THREE.BoxGeometry(x, y, z);
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        var hex =  0x553f18;
        switch(color) {
            case 1:
                hex = 0x553f18;
                break;
            case 2:
                hex = 0x3a90a2;
                break;
            case 3:
                hex = 0x3a4ca2;
                break;
            case 4:
                hex = 0x5fb15a;
                break;    
            case 5:
                hex = 0xb99f4d;
                break; 
            default:
                hex = 0x553f18;
        }
        
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );

    }

    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );

    cube = new THREE.Mesh( geometry, material );
    return cube;
}

//--------------------------------------- camera setting ---------------------------
var CameraSettings = function() {
    this.lat= 0.001;
    this.lon= 0.001;
    this.changePosition = false;
    this.height = 0;
    this.name="New camera";
    this.pole_angle = 0;
    this.width = 0;
    this.is_active = false;
    
    this.view = false;
    this.two_pole = false;
    this.viewCamera = ['camera 1', 'camera 2', 'camera 3', 'camera 4'];
    this.list = ['camera 1', 'camera 2', 'camera 3', 'camera 4'];

    this.cameraWidth1 = 0
    this.cameraAngleX1 = 0;
    this.cameraAngleZ1 = 0;
    this.fov1 = 45;
    this.area1 = 10.001;
    this.one_way1 = true;

    this.activeCamera2 = false;
    this.cameraWidth2 = 0
    this.cameraAngleX2 = 0;
    this.cameraAngleZ2 = 0;
    this.fov2 = 45;
    this.area2 = 10.001;
    this.one_way2 = true;

    this.activeCamera3 = false;
    this.cameraWidth3 = 0
    this.cameraAngleX3 = 0;
    this.cameraAngleZ3 = 0;
    this.fov3 = 45;
    this.area3 = 10.001;
    this.one_way3 = true;

    this.activeCamera4 = false;
    this.cameraWidth4 = 0
    this.cameraAngleX4 = 0;
    this.cameraAngleZ4 = 0;
    this.fov4 = 45;
    this.area4 = 10.001;
    this.one_way4 = true;

    this.newCamera=function(){
        cameraIndex = cameraInformationList.length;
        viewIndex = 0;
        cameraInformationList[cameraIndex] = newCamera(cameraIndex);
        updateGUI(cameraInformationList[cameraIndex], controls, gui);

        //add to selection list
        var option = document.createElement("option");
        option.text = cameraInformationList[cameraIndex].name;
        option.value = cameraIndex;
        select_list.add(option);

        //set current value
        select_list.value = cameraIndex;

        //add camera to server
        console.log(cameraInformationList[cameraIndex])
        addPole(settings_3d.addPole, cameraInformationList[cameraIndex]);
    };

    this.save=function(){
        for(var ii=0;ii<cameraInformationList.length;ii++){
            updatePole(settings_3d.updatePole, cameraInformationList[ii]);
        }
    }

    this.updateDraw = function() {
        cameraLayer.remove(camerList[cameraIndex]);
        ControlToCamera(cameraInformationList[cameraIndex], controls);
        camerList[cameraIndex] = CreateThreeCamera(cameraInformationList[cameraIndex], viewIndex);
        cameraLayer.add(camerList[cameraIndex]);
    }

    this.updateFov=function () {
        cameraInformationList[cameraIndex].cameras[0].fov = controls.fov1;
        cameraInformationList[cameraIndex].cameras[1].fov = controls.fov2;
        cameraInformationList[cameraIndex].cameras[2].fov = controls.fov3;
        cameraInformationList[cameraIndex].cameras[3].fov = controls.fov4;
        world._engine._camera1.fov = cameraInformationList[cameraIndex].cameras[viewIndex].fov;
        world._engine._camera1.updateProjectionMatrix();
    }

    this.updateName=function(){
        cameraInformationList[cameraIndex].name = controls.name;

        //update name in selection list
        var selectObject = select_list.getElementsByTagName("option")[cameraIndex];
        selectObject.innerText = controls.name;

    }

    this.updateView=function(){
        for(var ii=0; ii<controls.viewCamera.length; ii++){ 
            if(controls.list[ii] == controls.viewCamera){
                //set view index base on user selection
                viewIndex = ii;

                //update camera view
                controls.updateDraw();

                //update video player
                setupPlayer('mediaspace', cameraInformationList[cameraIndex].cameras[ii].stream_id, 300, 280);
            }
        }
    }
}

var CameraToControl = function(camera){
    var control = new CameraSettings();
    //parse information
    control.lat= camera.lat;
    control.lon= camera.lon;
    control.name= camera.name;
    control.changePosition = false;
    control.height = camera.height;
    control.pole_angle = camera.pole_angle;
    control.width = camera.width;
    control.view = false;
    control.two_pole = camera.two_pole;
    control.active = camera.is_active;

    control.cameraWidth1 = camera.cameras[0].width;
    control.cameraAngleX1 = camera.cameras[0].angle_x;
    control.cameraAngleZ1 = camera.cameras[0].angle_z;
    control.fov1 = camera.cameras[0].fov;
    control.area1 = camera.cameras[0].area;
    control.one_way1 = camera.cameras[0].one_way;

    control.activeCamera2 = camera.cameras[1].is_active;
    control.cameraWidth2 = camera.cameras[1].width;
    control.cameraAngleX2 = camera.cameras[1].angle_x;
    control.cameraAngleZ2 = camera.cameras[1].angle_z;
    control.fov2 = camera.cameras[1].fov;
    control.area2 = camera.cameras[1].area;
    control.one_way2 = camera.cameras[1].one_way;

    control.activeCamera3 = camera.cameras[2].is_active;
    control.cameraWidth3 = camera.cameras[2].width;
    control.cameraAngleX3 = camera.cameras[2].angle_x;
    control.cameraAngleZ3 = camera.cameras[2].angle_z;
    control.fov3 = camera.cameras[2].fov;
    control.area3 = camera.cameras[2].area;
    control.one_way3 = camera.cameras[2].one_way;

    control.activeCamera4 = camera.cameras[3].is_active;
    control.cameraWidth4 = camera.cameras[3].width;
    control.cameraAngleX4 = camera.cameras[3].angle_x;
    control.cameraAngleZ4 = camera.cameras[3].angle_z;
    control.fov4 = camera.cameras[3].fov;
    control.area4 = camera.cameras[3].area;
    control.one_way4 = camera.cameras[3].one_way;

    //save data
    return control;
}

var ControlToCamera = function(camera, control){
    //parse information
    camera.lat = control.lat;
    camera.lon = control.lon;
    camera.name = control.name;
    camera.height = control.height;
    camera.pole_angle = control.pole_angle;
    camera.width = control.width;
    camera.two_pole = control.two_pole;
    camera.is_active = control.active;

    camera.cameras[0].width = control.cameraWidth1;
    camera.cameras[0].angle_x = control.cameraAngleX1;
    camera.cameras[0].angle_z = control.cameraAngleZ1;
    camera.cameras[0].fov = control.fov1;
    camera.cameras[0].area = control.area1;
    camera.cameras[0].one_way = control.one_way1;
    camera.cameras[1].is_active = true;

    camera.cameras[1].is_active = control.activeCamera2;
    camera.cameras[1].width = control.cameraWidth2;
    camera.cameras[1].angle_x = control.cameraAngleX2;
    camera.cameras[1].angle_z = control.cameraAngleZ2;
    camera.cameras[1].fov = control.fov2;
    camera.cameras[1].area = control.area2;
    camera.cameras[1].one_way = control.one_way2;

    camera.cameras[2].is_active = control.activeCamera3;
    camera.cameras[2].width = control.cameraWidth3;
    camera.cameras[2].angle_x = control.cameraAngleX3;
    camera.cameras[2].angle_z = control.cameraAngleZ3;
    camera.cameras[2].fov = control.fov3;
    camera.cameras[2].area = control.area3;
    camera.cameras[2].one_way = control.one_way3;

    camera.cameras[3].is_active = control.activeCamera4;
    camera.cameras[3].width = control.cameraWidth4;
    camera.cameras[3].angle_x = control.cameraAngleX4;
    camera.cameras[3].angle_z = control.cameraAngleZ4;
    camera.cameras[3].fov = control.fov4;
    camera.cameras[3].area = control.area4;
    camera.cameras[3].one_way = control.one_way4;
}

var createGUI = function(controls){
    var gui = new dat.GUI();
    
    // gui.add(controls, 'two_pole').onChange(controls.updateDraw);
    gui.add(controls, 'newCamera');
    gui.add(controls, 'save');
    gui.add(controls, 'name').onChange(controls.updateName);

    gui.add(controls, 'active').onChange(controls.updateName);
    gui.add(controls, 'two_pole').onChange(controls.updateDraw);
    gui.add(controls, 'lat').min(10.5).max(11.0).step(0.00001).onChange(controls.updateDraw);
    gui.add(controls, 'lon').min(106.3).max(107.1).step(0.00001).onChange(controls.updateDraw);
    gui.add(controls, 'changePosition').onChange(controls.updateDraw);
    gui.add(controls, 'height').min(0).max(30).step(0.01).onChange(controls.updateDraw);
    gui.add(controls, 'width').min(0).max(10).step(0.01).onChange(controls.updateDraw);
    gui.add(controls, 'pole_angle', 0, 360).onChange(controls.updateDraw);

    //select camera to view
    gui.add(controls, "viewCamera", controls.list).onChange(controls.updateView);
    //first camera
    var f1 = gui.addFolder('Main camera');
    f1.add(controls, 'cameraWidth1').min(0).max(10).step(0.01).onChange(controls.updateDraw);
    f1.add(controls, 'cameraAngleX1').min(-90).max(90).step(1).onChange(controls.updateDraw);
    f1.add(controls, 'cameraAngleZ1').min(-90).max(90).step(1).onChange(controls.updateDraw);
    f1.add(controls, 'fov1', 0, 180).onChange(controls.updateFov);
    f1.add(controls, 'area1').min(0).max(200).step(0.01);
    f1.add(controls, 'one_way1');
    f1.open();

    //second camera
    var f2 = gui.addFolder('Second camera');
    f2.add(controls, 'activeCamera2').onChange(controls.updateDraw);
    f2.add(controls, 'cameraWidth2').min(0).max(10).step(0.01).onChange(controls.updateDraw);
    f2.add(controls, 'cameraAngleX2').min(-90).max(90).step(1).onChange(controls.updateDraw);
    f2.add(controls, 'cameraAngleZ2').min(-90).max(90).step(1).onChange(controls.updateDraw);
    f2.add(controls, 'fov2', 0, 180).onChange(controls.updateFov);
    f2.add(controls, 'area2').min(0).max(200).step(0.01);
    f2.add(controls, 'one_way2');

    //third camera
    var f3 = gui.addFolder('Third camera');
    f3.add(controls, 'activeCamera3').onChange(controls.updateDraw);
    f3.add(controls, 'cameraWidth3').min(0).max(10).step(0.01).onChange(controls.updateDraw);
    f3.add(controls, 'cameraAngleX3').min(-90).max(90).step(1).onChange(controls.updateDraw);
    f3.add(controls, 'cameraAngleZ3').min(-90).max(90).step(1).onChange(controls.updateDraw);
    f3.add(controls, 'fov3', 0, 180).onChange(controls.updateFov);
    f3.add(controls, 'area3').min(0).max(200).step(0.01);
    f3.add(controls, 'one_way3');

    //fourth camera
    var f4 = gui.addFolder('Fourth camera');
    f4.add(controls, 'activeCamera4').onChange(controls.updateDraw);
    f4.add(controls, 'cameraWidth4').min(0).max(10).step(0.01).onChange(controls.updateDraw);
    f4.add(controls, 'cameraAngleX4').min(-90).max(90).step(1).onChange(controls.updateDraw);
    f4.add(controls, 'cameraAngleZ4').min(-90).max(90).step(1).onChange(controls.updateDraw);
    f4.add(controls, 'fov4', 0, 180).onChange(controls.updateFov);
    f4.add(controls, 'area4').min(0).max(200).step(0.01);
    f4.add(controls, 'one_way4');

    updateGuiElement(gui);
    return gui;
}

var updateGUI = function(camera, control, gui){

    //parse information
    control.lat= camera.lat;
    control.lon= camera.lon;
    // control.changePosition = false;
    control.height = camera.height;
    control.name = camera.name;
    control.pole_angle = camera.pole_angle;
    control.width = camera.width;
    control.two_pole = camera.two_pole;
    control.active = camera.is_active;

    control.cameraWidth1 = camera.cameras[0].width;
    control.cameraAngleX1 = camera.cameras[0].angle_x;
    control.cameraAngleZ1 = camera.cameras[0].angle_z;
    control.fov1 = camera.cameras[0].fov;
    control.area1 = camera.cameras[0].area;
    control.one_way1 = camera.cameras[0].one_way;

    control.activeCamera2 = camera.cameras[1].is_active;
    control.cameraWidth2 = camera.cameras[1].width;
    control.cameraAngleX2 = camera.cameras[1].angle_x;
    control.cameraAngleZ2 = camera.cameras[1].angle_z;
    control.fov2 = camera.cameras[1].fov;
    control.area2 = camera.cameras[1].area;
    control.one_way2 = camera.cameras[1].one_way;

    control.activeCamera3 = camera.cameras[2].is_active;
    control.cameraWidth3 = camera.cameras[2].width;
    control.cameraAngleX3 = camera.cameras[2].angle_x;
    control.cameraAngleZ3 = camera.cameras[2].angle_z;
    control.fov3 = camera.cameras[2].fov;
    control.area3 = camera.cameras[2].area;
    control.one_way3 = camera.cameras[2].one_way;

    control.activeCamera4 = camera.cameras[3].is_active;
    control.cameraWidth4 = camera.cameras[3].width;
    control.cameraAngleX4 = camera.cameras[3].angle_x;
    control.cameraAngleZ4 = camera.cameras[3].angle_z;
    control.fov4 = camera.cameras[3].fov;
    control.area4 = camera.cameras[3].area;
    control.one_way4 = camera.cameras[3].one_way;

    updateGuiElement(gui);
}

//update dat gui elements
var updateGuiElement = function(gui){
    //update main elements
    for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
    }

    //update folder element
    for (var i in gui.__folders) {
        for(var j in gui.__folders[i].__controllers){
            gui.__folders[i].__controllers[j].updateDisplay();
        }
    }
}

//TODO: convert world to meter
var worldToMeter = function(world){
    return world;
}
//TODO: convert meter to world
var MeterToworld = function(meter){
    return 3*meter;
}

//create camera model
var CreateThreeCamera = function(camera, view){
    // build threejs 3d camera model from camera information
    // add all camera's element to threejs group
    // if we finish this work, we will done camera visualize

    //create camera model
    var cameraModel = new THREE.Object3D();

    // get lat lon and world position
    var latlon = new VIZI.LatLon(camera.lat, camera.lon);
    var pos = world.latLonToPoint(latlon);
    var rotateAngle = Math.PI / 180 * camera.pole_angle;
    
    //pole
    var pole = createCube(MeterToworld(settings_3d.default), MeterToworld(camera.height), MeterToworld(settings_3d.default), 1);
    pole.position.set(pos.x, MeterToworld(camera.height/2), pos.y);
    pole.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);

    //other pole
    var otherpole = createCube(MeterToworld(settings_3d.default), MeterToworld(camera.height), MeterToworld(settings_3d.default), 1);
    otherpole.position.set(pos.x, MeterToworld(camera.height/2), pos.y);
    otherpole.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
    otherpole.translateX(MeterToworld(camera.width));
    

    //hand
    var hand = createCube(MeterToworld(camera.width), MeterToworld(settings_3d.default), MeterToworld(settings_3d.default), 1);
    hand.position.set(pos.x, MeterToworld(camera.height), pos.y);
    hand.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
    hand.translateX(MeterToworld(camera.width/ 2));

    //maker
    var maker = createMaker();
    maker.position.set(pos.x, MeterToworld(100), pos.y);

    // camera
    var camera_list = new THREE.Object3D();
    for(var ii=0; ii < camera.cameras.length; ii++){
        iicamera = camera.cameras[ii];
        if(iicamera.is_active){
            //camera
            var icam = createCube(MeterToworld(settings_3d.default), MeterToworld(settings_3d.default*3), MeterToworld(settings_3d.default), 2+ii);
            icam.position.set(pos.x, MeterToworld(camera.height), pos.y);
            icam.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
            icam.translateX(MeterToworld(iicamera.width));            

            // lookat point of camera
            var lookatPoint = createCube(0.001, 0.001, 0.001, 1);
            lookatPoint.position.set(pos.x, MeterToworld(camera.height), pos.y);
            lookatPoint.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
            lookatPoint.translateX(MeterToworld(iicamera.width));

            //rotate for x angle and z angle
            irotateAngle = Math.PI / 180 * iicamera.angle_x;
            icam.rotateOnAxis( new THREE.Vector3(1,0,0), irotateAngle);
            lookatPoint.rotateOnAxis( new THREE.Vector3(1,0,0), irotateAngle);
            irotateAngle = Math.PI / 180 * iicamera.angle_z;
            icam.rotateOnAxis( new THREE.Vector3(0,0,1), irotateAngle);
            lookatPoint.rotateOnAxis( new THREE.Vector3(0,0,1), irotateAngle);

            //translate lookat point
            lookatPoint.translateY(-1); 
            camera_list.add(icam);
            camera_list.add(lookatPoint);
            if(view == ii){
                world._engine._camera1.position.set(icam.position.x, icam.position.y, icam.position.z);
                world._engine._camera1.lookAt( lookatPoint.position );

            }
        }
    }

    //add object to view
    cameraModel.add(camera_list);
    cameraModel.add(pole);
    cameraModel.add(hand);
    cameraModel.add(maker);
    if(camera.two_pole){
        cameraModel.add(otherpole);
    }
    return cameraModel;
}

//new camera with default
var newCamera = function(id){
    var camera = {};
    camera.lat = settings_3d.coords[0];
    camera.lon = settings_3d.coords[1];
    camera.name = "New Camera";
    camera.height = 5;
    camera.pole_angle = 0;
    camera.width = 2;
    camera.two_pole = false;
    camera.is_active = true;
    camera.cameras = [];
    camera.pole_id = id + 1;

    for(var ii=0;ii<4;ii++){
        camera.cameras[ii] = {};
        camera.cameras[ii].is_active = (ii==0);
        camera.cameras[ii].width = 1;
        camera.cameras[ii].angle_x = 10;
        camera.cameras[ii].angle_z = 10;
        camera.cameras[ii].fov = 45;
        camera.cameras[ii].area = 1.1;
        camera.cameras[ii].one_way = true;
        //TODO: change hardcode here
        camera.cameras[ii].stream_id = settings_3d.streamingServer + (id*4 + ii+1);
        camera.cameras[ii].road = [];
    }
    return camera;
}

//----------------------------------- setup video player for camera ------------------------------
var setupPlayer = function(divname, stream_id, width, height){
    //split id
    var res = stream_id.split("/");
    var id = res[res.length-1];
    var host = stream_id.substring(0, stream_id.length - id.length - 1);

    var element = document.getElementById("mediaspace_wrapper");

    //setup player
    jwplayer(divname).setup({
        'flashplayer': 'assets/js/player.swf',
        'file': id,
        'streamer': host,
        'controlbar': 'bottom',
        'width': width,
        'height': height
    });
}

//----------------------------------- Work with server API ---------------------------------------
//get all poles
//TODO: change here if not connected to server
var getJSON = function(url) {
    $.getJSON(url, function (data) {
        cameraInformationList = data;
        console.log("Load data success!");
        // console.log(camerList);

        //display camera
        for(var ii=0; ii<cameraInformationList.length; ii++){
            //create threejs camera model
            if(ii == cameraIndex)
                camerList[ii] = CreateThreeCamera(cameraInformationList[ii], viewIndex);
            else
                camerList[ii] = CreateThreeCamera(cameraInformationList[ii], -1);
            cameraLayer.add(camerList[ii]);        

            // add to camera list

            var option = document.createElement(settings_3d.optionDiv);
            option.text = cameraInformationList[ii].name;
            option.value = ii;
            select_list.add(option);
        }
        cameraLayer.addTo(world);

        // update dat gui
        updateGUI(cameraInformationList[cameraIndex], controls, gui);

    });   
};


//update pole
var updatePole = function(url, camera) {
    // camera.name ="test";
    $.ajax({
        type: "PUT",
        url: url,
        dataType: "json",
        // headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"},
        data: {data: JSON.stringify(camera)},
        success: function(result) {
            // Do something with the result
            console.log(result);
            console.log("Update data success!");
        }
    });
};
// updatePole(settings_3d.updatePole, cameraInformationList[0]);


//TODO: delete pole
var deletePole = function(url, id) {
    
    url = url+id;
    $.ajax({
        url: url,
        type: 'DELETE',
        dataType: "json",
        // headers: {"Id": Id, "bolDeleteReq" : bolDeleteReq},
        success: function(result) {
            // Do something with the result
            console.log(result);
        },
        error: function(err) {
            // Do something with the result
            console.log(err);
        }
    });
};
// console.log(JSON.stringify(cameraInformationList[0]));
// deletePole(settings_3d.deletePole, 3);
//add new pole
var addPole = function(url, camera){
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: {data: JSON.stringify(camera)},
        success: function(result) {
            // Do something with the result
            console.log(result);
            console.log("Add data success!");
        }
    });
}
// addPole(settings_3d.addPole, cameraInformationList[0]);
// addPole(settings_3d.addPole, cameraInformationList[1]);

//-------------------------------- Density --------------------------------
var retColor = {};
var getDensityById = function(osm_id){
    var url = settings_3d.densityAPI+'streetIds[]='+osm_id;
    $.getJSON(url, function (data) {
        if(data.length > 0 ){
            var color = 0;
            data[0].segments.forEach(function(segment) {
                color = color + segment.density;
            });
            retColor[osm_id]  = Math.floor(color / settings_3d.maxDensity * 7);
        } 
    });
}

var getDensityColor = function(state) {
    if(state > 6)
        return '#d73027';
    return state === 0   ? '#5b615f' :
           state === 1   ? '#1a9850' :
           state === 2   ? '#91cf60' :
           state === 3   ? '#d9ef8b' :
           state === 4   ? '#fee08b' :
           state === 5   ? '#fc8d59' :
           state === 6   ? '#d73027' :
                           '#5b615f';
}