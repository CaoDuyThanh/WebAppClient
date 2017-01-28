import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Config } from '../shared/index';

// IMPORT MODELS
import { TrafficPole, Camera, LatLon } from './models/CameraModel';

@Injectable()
export class CameraService{
	constructor(private http: Http){
	}

	GetNumTrafficPoles(): Observable<number>{
		let queryUrl = Config.HOST_CAMERA_API + '/numtrafficpoles/';

		return this.http.get(queryUrl)
	            .map((res: Response) => {
	                let totalItems = res.json();
	                return (+totalItems);
	            });
	}

	GetTrafficPoles(page: number, numItems: number): Observable<TrafficPole[]>{
		let params: string = [
			`page=${page}`,
			`num_items_per_page=${numItems}`
		].join('&');
		let queryUrl = Config.HOST_CAMERA_API + '/trafficpolesbypage?' + params;
		
		return this.http.get(queryUrl)
				.map((res: Response) => {
					return (<any>res.json()).map((trafficpole: any) => {
						return new TrafficPole({
							PoleId: trafficpole.pole_id,
							Lat: trafficpole.lat,
							Lon: trafficpole.lon,
							Width: trafficpole.width,
							Height: trafficpole.height,
							Name: trafficpole.name,
							PoleAngle: trafficpole.pole_angle,
							Type: trafficpole.type,
							Cameras: trafficpole.cameras.map((camera: any) => {
								return new Camera({
									Area: camera.area,
									OneWay: camera.one_way,
									IsActive: camera.active,
									Width: camera.width,
									AngleX: camera.angle_x,
									AngleZ: camera.angle_z,
									Fov: camera.fov,
									StreamId: camera.stream_id,
									Roads: camera.road.map((latlon: any) => {
										return new LatLon({
											Lat: latlon.lat,
											Lon: latlon.lon
										});
									})
								});
							})
						});
					});
				});
	}

	DeleteTrafficPole(poleId: number): Observable<any>{
		let queryUrl = Config.HOST_CAMERA_API + '/trafficpole/' + poleId;

		return this.http.delete(queryUrl)	
				.map((res: Response) => {
					let result = <any>res.json();
					return result;
				});

	}
}

