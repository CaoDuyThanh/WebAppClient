import { Component, Injector, QueryList, EventEmitter,
		 ViewChildren, ViewContainerRef, ReflectiveInjector, ComponentFactoryResolver
	   } from '@angular/core';

// Import Models
import { Camera, LatLon } from '../../../service/models/CameraModel';

// Import Component
import { LatlonEditComponent } from './latlon-edit.component';
import { YesnoPanelComponent } from '../../../shared/yesno-panel/yesno-panel';

@Component({
    moduleId: module.id,
	selector: 'camera-edit-cmp',
	templateUrl: 'camera-edit.component.html',
    entryComponents: [
        LatlonEditComponent,
        YesnoPanelComponent
    ]
})

export class CameraEditComponent {
	public CameraIdx: number;
	public Camera: Camera;
	public IsEdit: boolean;

	// Create | Edit Camera Modal - variables
	@ViewChildren('LatlonContainer', { read: ViewContainerRef }) LatlonContainer: QueryList<ViewContainerRef>;
	private listComponents: any[] = [];

	// Yesno camera panels for delete camera
    @ViewChildren('CameraLatlonContainer', { read: ViewContainerRef }) CameraLatlonContainer: QueryList<ViewContainerRef>;
    private listLatlonComponents: any[] = [];

	constructor(private injector: Injector,
				private resolver: ComponentFactoryResolver) {
		this.CameraIdx = this.injector.get('CameraIdx');
		this.Camera = this.injector.get('Camera');
		this.IsEdit = this.injector.get('IsEdit');
	}

	ClickCreate(): void {
		this.Camera.Roads.push(new LatLon());
	}

	ClickDeleteLatlon(idx: number, latlon: LatLon): void {
		if (this.listLatlonComponents[idx]) {
            this.listLatlonComponents[idx].destroy();
        }

        // Create data to pass to modal
        var response = new EventEmitter<string>();
        let data = [
            {provide: 'Header', useValue: null},
            {provide: 'Message', useValue: 'This latlon will be deleted. Are you sure ?'},
            {provide: 'Response', useValue: response}
        ];
        let resolveData = ReflectiveInjector.resolve(data);
        let injector = ReflectiveInjector.fromResolvedProviders(resolveData, this.CameraLatlonContainer.toArray()[idx].parentInjector);

        // Create component
        let factory = this.resolver.resolveComponentFactory(YesnoPanelComponent);
        let component = factory.create(injector);

        // Add component to modal
        this.CameraLatlonContainer.toArray()[idx].insert(component.hostView);

        this.listLatlonComponents[idx] = component;

        // Handle response
        response.subscribe(
            (result: string) => {
                switch (result) {
                    case YesnoPanelComponent.YES:
                        var idx = this.Camera.Roads.indexOf(latlon);
						this.Camera.Roads.splice(idx, 1);
                        break;
                    case YesnoPanelComponent.NO:
                        var id = this.Camera.Roads.indexOf(latlon);
                        this.listLatlonComponents[id].destroy();
                        break;
                    default:
                        // Do nothing
                        break;
                }
            },
            (err: any) => {
                console.log(err);
            }
        );
	}

	ClickLatlon(idx: number, latlon: LatLon) {
		if (this.listComponents[idx]) {
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
