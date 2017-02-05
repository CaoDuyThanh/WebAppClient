import { Component, Injector, QueryList, EventEmitter,
         ViewChildren, ViewChild, ViewContainerRef, ReflectiveInjector, ComponentFactoryResolver
	   } from '@angular/core';

// Import Models
import { TrafficPole, Camera } from '../../../service/models/CameraModel';

// Import Component
import { CameraEditComponent } from './camera-edit.component';
import { YesnoPanelComponent } from '../../../shared/yesno-panel/yesno-panel';

// Import Utils
import { EventData } from '../../../utils/event.helper';

@Component({
    moduleId: module.id,
	selector: 'traffic-pole-edit-cmp',
	templateUrl: 'traffic-pole-edit.component.html',
    entryComponents: [
        CameraEditComponent,
        YesnoPanelComponent
    ]
})

export class TrafficPoleEditComponent {
	public TrafficPole: TrafficPole;
	public IsEdit: boolean;
    public Response: EventEmitter<EventData>;

    // Create | Edit Camera Modal - variables
	@ViewChildren('CameraContainer', { read: ViewContainerRef }) CameraContainer: QueryList<ViewContainerRef>;
	private listComponents: any[] = [];

    // Yesno camera panels for delete camera
    @ViewChildren('CameraYesnoContainer', { read: ViewContainerRef }) CameraYesnoContainer: QueryList<ViewContainerRef>;
    private listYesnoComponents: any[] = [];


    // Yesno panel for edit function
    @ViewChild('YesnoContainer', { read: ViewContainerRef }) YesnoContainer: ViewContainerRef;
    private yesnoComponent: any = null;
    private isShowYesnoPanel: boolean = false;

	constructor(private injector: Injector,
                private resolver: ComponentFactoryResolver) {
		this.TrafficPole = this.injector.get('TrafficPole');
		this.IsEdit = this.injector.get('IsEdit');
        this.Response = this.injector.get('Response');
	}

	ClickCreateCamera(): void {
		this.TrafficPole.Cameras.push(new Camera());
	}

    ClickDeleteCamera(idx: number, camera: Camera): void {
        if (this.listYesnoComponents[idx]) {
            this.listYesnoComponents[idx].destroy();
        }

        // Create data to pass to modal
        var response = new EventEmitter<string>();
        let data = [
            {provide: 'Header', useValue: null},
            {provide: 'Message', useValue: 'This camera will be deleted. Are you sure ?'},
            {provide: 'Response', useValue: response}
        ];
        let resolveData = ReflectiveInjector.resolve(data);
        let injector = ReflectiveInjector.fromResolvedProviders(resolveData, this.CameraYesnoContainer.toArray()[idx].parentInjector);

        // Create component
        let factory = this.resolver.resolveComponentFactory(YesnoPanelComponent);
        let component = factory.create(injector);

        // Add component to modal
        this.CameraYesnoContainer.toArray()[idx].insert(component.hostView);

        this.listYesnoComponents[idx] = component;

        // Handle response
        response.subscribe(
            (result: string) => {
                switch (result) {
                    case YesnoPanelComponent.YES:
                        var idx = this.TrafficPole.Cameras.indexOf(camera);
                        this.TrafficPole.Cameras.splice(idx, 1);
                        break;
                    case YesnoPanelComponent.NO:
                        var id = this.TrafficPole.Cameras.indexOf(camera);
                        this.listYesnoComponents[id].destroy();
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

	ClickCamera(idx: number, camera: Camera): void {
		if (this.listComponents[idx]) {
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

    ClickCreate(): void {
        // Create event data with type = CREATE &
        //                        data = this.TrafficPole
        // and send bach to response
        var eventData = new EventData();
        eventData.Type = EventData.CREATE;
        eventData.Data = this.TrafficPole;
        this.Response.next(eventData);
    }

    ClickEdit(): void {
        this.isShowYesnoPanel = true;

        if (this.yesnoComponent) {
            this.yesnoComponent.destroy();
        }

        // Create data to pass to modal
        var response = new EventEmitter<string>();
        let data = [
            {provide: 'Header', useValue: null},
            {provide: 'Message', useValue: 'This traffic pole will be editted. Are you sure ?'},
            {provide: 'Response', useValue: response}
        ];
        let resolveData = ReflectiveInjector.resolve(data);
        let injector = ReflectiveInjector.fromResolvedProviders(resolveData, this.YesnoContainer.parentInjector);

        // Create component
        let factory = this.resolver.resolveComponentFactory(YesnoPanelComponent);
        let component = factory.create(injector);

        // Add component to modal
        this.YesnoContainer.insert(component.hostView);

        this.yesnoComponent = component;

        // Handle response
        response.subscribe(
            (result: string) => {
                switch (result) {
                    case YesnoPanelComponent.YES:
                        // code...
                        // Send event data with type = EDIT &
                        //                      data = this.TrafficPole
                        var eventData = new EventData();
                        eventData.Type = EventData.EDIT;
                        eventData.Data = this.TrafficPole;
                        this.Response.next(eventData);


                        var cancelDiv = $('#CancelTrafficPoleEditModal');
                        console.log(cancelDiv);
                        cancelDiv.click();
                        break;
                    case YesnoPanelComponent.NO:
                        this.isShowYesnoPanel = false;
                        this.yesnoComponent.destroy();
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
}
