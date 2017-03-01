// Import models
import { Camera } from './CameraModel';

export class Server {
	public ServerId: string;
	public Address: string;
	public Port: number;
	public IsActive: boolean;
	public Cameras: Camera[];

	constructor(obj?: any) {
		this.ServerId = obj && obj.ServerId || '';
		this.Address  = obj && obj.Address || '';
		this.Port     = obj && obj.Port || 8080;
		this.IsActive = obj && obj.IsActive || true;
		this.Cameras  = obj && obj.Cameras || [];
	}

	ToJSON(): any {
		return {
			'server_id': this.ServerId,
			'address': this.Address,
			'port': this.Port,
			'is_active': this.IsActive,
			'cameras': this.Cameras.map((camera: Camera) => {
							return camera.ToJSON();
						})
		};
	}
}

