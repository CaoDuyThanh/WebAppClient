// Feel free to extend this interface
// depending on your app specific config.
export interface EnvConfig {
	HOST_API?: string;

	HOST_DENSITY_API?: string;

	HOST_STREETS_API?: string;

	HOST_CAMERA_API?: string;

	HOST_QUICKSEARCH_API?: string;

	HOST_STATISTIC_API?: string;

	HOST_SERVICE_API?: string;

  	API?: string;
  	ENV?: string;
}

export const Config: EnvConfig = JSON.parse('<%= ENV_CONFIG %>');
