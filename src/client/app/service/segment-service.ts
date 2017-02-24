import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Config } from '../shared/index';

@Injectable()
export class SegmentService {
	constructor(private http: Http) {

	}

	GetPointDensity(lat: Number, lon: Number): Observable<any> {
		let params: string = [
			`lat=${lat}`,
			`lon=${lon}`
		].join('&');
		let queryUrl = Config.HOST_STATISTIC_API + '/density/point?' + params;
		return this.http.get(queryUrl)
				.map((res: any) => {
					let result = res.json();
	                if (result.status === 'success') {
	                	return result.data;
	                } else {
	                	console.log(result.message);
	                	return 0;
	                }
				});
	}
}

