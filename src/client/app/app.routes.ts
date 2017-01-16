import { Routes } from '@angular/router';

import { MapRoutes } from './map/index';
import { LoginRoutes } from './login/index';
import { SignupRoutes } from './signup/index';
import { DashboardRoutes } from './dashboard/index';

import { LoginComponent } from './login/index';
import { MapComponent } from './map/index';

export const routes: Routes = [
	...LoginRoutes,
	...SignupRoutes,
	...DashboardRoutes,
	...MapRoutes,
	{ path: '**', component: MapComponent }
];
