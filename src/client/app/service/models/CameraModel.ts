
export class LatLon {
	public Parent: Camera;
	public Lat: number;
	public Lon: number;
	constructor(obj?: any) {
		this.Parent = null;
		this.Lat 	= obj && obj.Lat || null;
		this.Lon 	= obj && obj.Lon || null;
	}

	ToJSON(): any {
		return {
			'lat': this.Lat,
			'lon': this.Lon
		};
	}
}

export class Camera {
	public Parent: TrafficPole;
	public Area: number;
	public OneWay: boolean;
	public IsActive: boolean;
	public Width: number;
	public AngleX: number;
	public AngleZ: number;
	public Fov: number;
	public StreamId: string;
	public Roads: LatLon[];

	constructor(obj?: any) {
		this.Parent 	= null;
		this.Area 		= obj && obj.Area || null;
		this.OneWay 	= obj && obj.OneWay || null;
		this.IsActive 	= obj && obj.IsActive || null;
		this.Width 		= obj && obj.Width || null;
		this.AngleX 	= obj && obj.AngleX || null;
		this.AngleZ 	= obj && obj.AngleZ || null;
		this.Fov 		= obj && obj.Fov || null;
		this.StreamId 	= obj && obj.StreamId || null;
		this.Roads 		= obj && obj.Roads || [];
	}

	ToJSON(): any {
		return {
			'area': this.Area,
			'one_way': this.OneWay,
			'is_active': this.IsActive,
			'width': this.Width,
			'angle_x': this.AngleX,
			'angle_z': this.AngleZ,
			'fov': this.Fov,
			'stream_id': this.StreamId,
			'road': this.Roads.map((road: LatLon) => {
				return road.ToJSON();
			})
		};
	}
}

export class TrafficPole {
	public PoleId: number;
	public Lat: number;
	public Lon: number;
	public Width: number;
	public Height: number;
	public Name: string;
	public PoleAngle: number;
	public Type: boolean;
	public Cameras: Camera[];

	constructor(obj?: any) {
		this.PoleId 	= obj && obj.PoleId || null;
		this.Lat 		= obj && obj.Lat || null;
		this.Lon 		= obj && obj.Lon || null;
		this.Width 		= obj && obj.Width || null;
		this.Height 	= obj && obj.Height || null;
		this.Name 		= obj && obj.Name || null;
		this.PoleAngle 	= obj && obj.PoleAngle || null;
		this.Type 		= obj && obj.Type || null;
		this.Cameras 	= obj && obj.Cameras || [];
	}

	ToJSON(): any {
		return {
			'pole_id': this.PoleId,
			'lat': this.Lat,
			'lon': this.Lon,
			'width': this.Width,
			'height': this.Height,
			'name': this.Name,
			'pole_angle': this.PoleAngle,
			'type': this.Type,
			'cameras': this.Cameras.map((camera: Camera) => {
				return camera.ToJSON();
			})
		};
	}
}


