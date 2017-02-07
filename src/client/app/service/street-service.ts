import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Config } from '../shared/index';

@Injectable()
export class StreetService {
	constructor(private http: Http) {
	}

	SearchName(name: string, numItems: number): Observable<any> {
		let params: string = [
			`street_name=${name}`,
			`num_items=${numItems}`
		].join('&');
		let queryUrl = Config.HOST_QUICKSEARCH_API + '/street?' + params;
		return this.http.get(queryUrl)
            .map((res: Response) => {
                let result = res.json();
                if (result.status === 'success') {
                	return result.data.suggest;
                } else {
                	console.log(result.message);
                	return [];
                }
            });
	}

	GetNumVehiclesStreet(streetName: string): Observable<any> {
		let params: string = [
			`street_name=${streetName}`,
		].join('&');
		let queryUrl = Config.HOST_STATISTIC_API + '/vehicles/street?' + params;
		return this.http.get(queryUrl)
            .map((res: Response) => {
                let result = res.json();
                if (result.status === 'success') {
                	return result.data;
                } else {
                	console.log(result.message);
                	return 0;
                }
            });
	}

    SearchStreets(streetName: string): Observable<any[]> {
        let params: string = [
            `street_name=${streetName}`
        ].join('&');
        let queryUrl = Config.HOST_STREETS_API + '?' + params;
        return this.http.get(queryUrl)
            .map((res: Response) => {
                let result = res.json();
                if (result.status === 'success') {
                    return result.data;
                } else {
                    console.log(result.message);
                    return [];
                }
            });
    }

    GetLocation(streetName: string): Observable<any> {
        let params: string = [
            `street_name=${streetName}`
        ].join('&');
        let queryUrl = Config.HOST_QUICKSEARCH_API + '/getlocation?' + params;
        return this.http.get(queryUrl)
            .map((res: Response) => {
                let result = res.json();
                if (result.status === 'success') {
                    return result.data;
                } else {
                    console.log(result.message);
                    return [];
                }
            });
    }
}

