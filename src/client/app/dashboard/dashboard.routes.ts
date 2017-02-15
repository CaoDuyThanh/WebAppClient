import { Route } from '@angular/router';

import { HomeRoutes } from './home/index';
import { MapSettingsRoutes } from './map-settings/index';
import { CameraSettingsRoutes } from './camera-settings/index';
import { CameraVisualizeRoutes } from './camera-visualize/index';
import { RealtimeStatisticRoutes } from './realtime-statistic/index';
import { DatabaseStatisticRoutes } from './database-statistic/index';
// import { ChartRoutes } from './charts/index';
// import { BlankPageRoutes } from './blank-page/index';
// import { TableRoutes } from './tables/index';
// import { FormRoutes } from './forms/index';
// import { GridRoutes } from './grid/index';
// import { BSComponentRoutes } from './bs-component/index';
// import { BSElementRoutes } from './bs-element/index';

import { DashboardComponent } from './index';

export const DashboardRoutes: Route[] = [
  	{
    	path: 'dashboard',
    	component: DashboardComponent,
    	children: [
	    	...HomeRoutes,

            // Settings Components
            ...MapSettingsRoutes,
            ...CameraSettingsRoutes,

            // Statistic Component
            ...DatabaseStatisticRoutes,
            ...RealtimeStatisticRoutes,

            //camera visualize component
            ...CameraVisualizeRoutes,
	    	// ...ChartRoutes,
	    	// ...BSComponentRoutes,
      //       ...TableRoutes,
	    	// ...BlankPageRoutes,
      //       ...FormRoutes,
      //       ...GridRoutes,
      //       ...BSElementRoutes
    	]
  	}
];
