import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

// Import config
import { Config } from '../shared/index';

// Import models
import { Server } from './models/ServerModel';
import { Camera, LatLon } from './models/CameraModel';

@Injectable()
export class ServerService {
	constructor(private http: Http) {
	}

	GetNumServerDensity(): Observable<number> {
		let queryUrl = Config.HOST_SERVER_DENSITY_API + '/numserverdensities';
		return this.http.get(queryUrl)
				.map((res: Response) => {
	                let result = res.json();

	                if (result.status === 'success') {
	                	return (+result.data.num_server_densities);
	                } else {
	                	console.log(result.message);
	                	return 0;
	                }
	            });
	}


	GetAllServerDensity(): Observable<Server[]> {
		let queryUrl = Config.HOST_SERVER_DENSITY_API + '/allserverdensity';
		return this.http.get(queryUrl)
				.map((res: Response) => {
					return (<any>res.json()).map((server: any) => {
						return new Server({
							ServerId: server.server_id,
							Address: server.address,
							Port: server.port,
							IsActive: server.is_active,
							Cameras: server.cameras.map((camera: any) => {
								return new Camera({
									Area: camera.area,
									OneWay: camera.one_way,
									IsActive: camera.is_active,
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

	GetServerDensities(page: number, numItems: number): Observable<Server[]> {
		let params: string = [
			`page=${page}`,
			`num_items_per_page=${numItems}`
		].join('&');
		let queryUrl = Config.HOST_CAMERA_API + '/serverdensitiesbypage?' + params;

		return this.http.get(queryUrl)
				.map((res: Response) => {
					return (<any>res.json()).map((server: any) => {
						return new Server({
							ServerId: server.server_id,
							Address: server.address,
							Port: server.port,
							IsActive: server.is_active,
							Cameras: server.cameras.map((camera: any) => {
								return new Camera({
									Area: camera.area,
									OneWay: camera.one_way,
									IsActive: camera.is_active,
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
}

