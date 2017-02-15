var cameraInformationList = [];
cameraInformationList = [{
	pole_id:0,
	lat:10.799679358581198,
	lon: 106.67499757610022,
    height :10,
    pole_angle :20,
    name:"Hoang Van Thu",
    width :3,
    two_pole :true,
    is_active:true,
    cameras:[{
    	area:13.1,
    	one_way:false,
    	is_active:true,
    	width :2.1,
	    angle_x :30,
	    angle_z :20,
	    fov :45,
	    stream_id:"rtmp://localhost/myapp/camera_1",
	    road:[{lat:100,lon:100},{lat:100,lon:100},{lat:100,lon:100}]
	},{
		area:13.2,
    	one_way:true,
	    is_active:false,
    	width :1,
	    angle_x :0,
	    angle_z :0,
	    fov :45,
	    stream_id:"rtmp://localhost/myapp/camera_2",
	    road:[{lat:100,lon:100},{lat:100,lon:100},{lat:100,lon:100}]
    },{
    	area:13.3,
    	one_way:true,
    	is_active:false,
    	width :1,
	    angle_x :0,
	    angle_z :0,
	    fov :45,
	    stream_id:"rtmp://localhost/myapp/camera_3",
	    road:[{lat:100,lon:100},{lat:100,lon:100},{lat:100,lon:100}]
    },{
    	area:13.4,
    	one_way:true,
    	is_active:false,
    	width :1,
	    angle_x :0,
	    angle_z :0,
	    fov :45,
	    stream_id:"rtmp://localhost/myapp/camera_4",
	    road:[{lat:100,lon:100},{lat:100,lon:100},{lat:100,lon:100}]
    }]
}]