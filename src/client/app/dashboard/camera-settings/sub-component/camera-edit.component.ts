import { Component, OnInit, Injector, QueryList,
		 ViewChildren, ViewContainerRef, ReflectiveInjector, ComponentFactoryResolver
	   } from '@angular/core';

// Import Models
import { TrafficPole, Camera, LatLon } from '../../../service/models/CameraModel';

// Import Component
import { LatlonEditComponent } from './latlon-edit.component';

@Component({
    moduleId: module.id,
	selector: 'camera-edit-cmp',
	templateUrl: 'camera-edit.component.html',
    entryComponents: [
        LatlonEditComponent
    ]
})

export class CameraEditComponent {
	public CameraIdx: number;
	public Camera: Camera;
	public IsEdit: boolean;

	// Create | Edit Camera Modal - variables
	@ViewChildren('LatlonContainer', { read: ViewContainerRef }) LatlonContainer: QueryList<ViewContainerRef>;
	private listComponents: any[] = [];

	constructor(private injector: Injector,
				private resolver: ComponentFactoryResolver){
		this.CameraIdx = this.injector.get('CameraIdx');
		this.Camera = this.injector.get('Camera');
		this.IsEdit = this.injector.get('IsEdit');
	}

	ClickCreate(): void{
		this.Camera.Roads.push(new LatLon());
	}

	ClickLatlon(idx: number, latlon: LatLon){
		if (this.listComponents[idx]){
            this.listComponents[idx].destroy();
        }

        // Create data to pass to modal
        let data = [
            {provide: 'Latlon', useValue: latlon},
            {provide: 'IsEdit', useValue: true}
        ];
        let resolveData = ReflectiveInjector.resolve(data);
        let injector = ReflectiveInjector.fromResolvedProviders(resolveData, this.LatlonContainer.toArray()[idx].parentInjector);

        // Create component
        let factory = this.resolver.resolveComponentFactory(LatlonEditComponent);
        let component = factory.create(injector);

        // Add component to modal
        this.LatlonContainer.toArray()[idx].insert(component.hostView);

        this.listComponents[idx] = component;
	}
}
