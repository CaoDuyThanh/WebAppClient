import { Component, OnInit, Injector, QueryList,
         ViewChildren, ViewContainerRef, ReflectiveInjector, ComponentFactoryResolver
	   } from '@angular/core';

// Import Models
import { TrafficPole, Camera, LatLon } from '../../../service/models/CameraModel';

// Import Component
import { CameraEditComponent } from './camera-edit.component';

@Component({
    moduleId: module.id,
	selector: 'traffic-pole-edit-cmp',
	templateUrl: 'traffic-pole-edit.component.html',
    entryComponents: [
        CameraEditComponent
    ]
})

export class TrafficPoleEditComponent {
	public TrafficPole: TrafficPole;
	public IsEdit: boolean;

    // Create | Edit Camera Modal - variables
	@ViewChildren('CameraContainer', { read: ViewContainerRef }) CameraContainer: QueryList<ViewContainerRef>;
	private listComponents: any[] = [];

	constructor(private injector: Injector,
                private resolver: ComponentFactoryResolver){

		this.TrafficPole = this.injector.get('TrafficPole');
		this.IsEdit = this.injector.get('IsEdit');
	}

	ClickCreate(): void{
		this.TrafficPole.Cameras.push(new Camera());
	}

	ClickCamera(idx: number, camera: Camera){
		if (this.listComponents[idx]){
            this.listComponents[idx].destroy();
        }

        // Create data to pass to modal
        let data = [
            {provide: 'CameraIdx', useValue: idx},
            {provide: 'Camera', useValue: camera},
            {provide: 'IsEdit', useValue: true}
        ];
        let resolveData = ReflectiveInjector.resolve(data);
        let injector = ReflectiveInjector.fromResolvedProviders(resolveData, this.CameraContainer.toArray()[idx].parentInjector);

        // Create component
        let factory = this.resolver.resolveComponentFactory(CameraEditComponent);
        let component = factory.create(injector);

        // Add component to modal
        this.CameraContainer.toArray()[idx].insert(component.hostView);

        this.listComponents[idx] = component;
	}
}
