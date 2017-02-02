import {EnvConfig} from './env-config.interface';

const BaseConfig: EnvConfig = {
	HOST_API: 'http://localhost:4000/',

	HOST_DENSITY_API: 'http://localhost:4000/density',

	HOST_CAMERA_API: 'http://localhost:4000/simulation',

	HOST_QUICKSEARCH_API: 'http://localhost:4000/quicksearch',

	HOST_STATISTIC_API: 'http://localhost:4000/statistic',

	// Sample API url
	API: 'https://demo.com'
};

export = BaseConfig;

