import {EnvConfig} from './env-config.interface';

const BaseConfig: EnvConfig = {
	HOST_API: 'http://192.168.1.107:4000/',

	HOST_DENSITY_API: 'http://192.168.1.107:4000/density',

	HOST_STREETS_API: 'http://192.168.1.107:4000/streets',

	HOST_CAMERA_API: 'http://192.168.1.107:4000/simulation',

	HOST_QUICKSEARCH_API: 'http://192.168.1.107:4000/quicksearch',

	HOST_STATISTIC_API: 'http://192.168.1.107:4000/statistic',

	HOST_SERVER_DENSITY_API: 'http://192.168.1.107:4000/servers',

	// Sample API url
	API: 'https://demo.com'
};

export = BaseConfig;

