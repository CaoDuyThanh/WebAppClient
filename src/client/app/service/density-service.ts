import { Injectable } from '@angular/core';
import { Http, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';
import { Config } from '../shared/index';

declare let dcodeIO: any;

@Injectable()
export class DensityService {
	private densityStreetsProtobuf: any;

	constructor(private http: Http) {

	}

	GetDensity(trafficPoleIds: number[]): Observable<any> {
		var protobuf:any = dcodeIO.ProtoBuf;
		var builder:any = protobuf.loadProtoFile('/app/service/models/streets.proto');
		this.densityStreetsProtobuf = builder.build('DensityStreets').DensityStreets;

		let params: string = trafficPoleIds.map((trafficPole: number) => {
													return 'streetIds[]=' + trafficPole;
												})
											.join('&');
		let queryUrl = Config.HOST_DENSITY_API + '/streetspbf?' + params;

		return this.http.get(queryUrl, { responseType: ResponseContentType.ArrayBuffer })
				.map((res: any) => {
					var buffer = res.arrayBuffer();
					var data = this.densityStreetsProtobuf.decode(buffer);
					return data;
				});
	}
}

