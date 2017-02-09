import { Injectable } from '@angular/core';
import { Http, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';
import { Config } from '../shared/index';

declare let dcodeIO: any;

@Injectable()
export class DensityService {
	private densityStreetsLightProtobuf: any = null;

	constructor(private http: Http) {

	}

	GetDensity(bounds: any, streetType: string): Observable<any> {
		if (!this.densityStreetsLightProtobuf) {
			var protobuf: any = dcodeIO.ProtoBuf;
			var builder: any = protobuf.loadProtoFile('/app/service/models/streets_light.proto');
			this.densityStreetsLightProtobuf = builder.build('DensityStreetsLight').DensityStreetsLight;
		}

		let params: string = [
			`lat_start=${bounds.lat_start}`,
			`lat_end=${bounds.lat_end}`,
			`lon_start=${bounds.lon_start}`,
			`lon_end=${bounds.lon_end}`,
			`street_type=${streetType}`
		].join('&');
		let queryUrl = Config.HOST_DENSITY_API + '/streetslightpbf?' + params;

		return this.http.get(queryUrl, { responseType: ResponseContentType.ArrayBuffer })
				.map((res: any) => {
					var buffer = res.arrayBuffer();
					var data = this.densityStreetsLightProtobuf.decode(buffer);
					return data;
				});
	}
}

