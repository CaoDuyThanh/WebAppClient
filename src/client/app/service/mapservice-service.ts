import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Config } from '../shared/index';

@Injectable()
export class MapserviceService {
	constructor(private http: Http) {
	}

	FindPath(startLocation: any, endLocation: any): Observable<any> {
		let params: string = [
			`node_start_lon=${startLocation.lng}`,
			`node_start_lat=${startLocation.lat}`,
			`node_end_lon=${endLocation.lng}`,
			`node_end_lat=${endLocation.lat}`
		].join('&');
		let queryUrl = Config.HOST_SERVICE_API + '/findpath?' + params;
		return this.http.get(queryUrl)
            .map((res: Response) => {
                let result = res.json();
                if (result.status === 'success') {
                	return result.data.path;
                } else {
                	console.log(result.message);
                	return [];
                }
            });
	}
}