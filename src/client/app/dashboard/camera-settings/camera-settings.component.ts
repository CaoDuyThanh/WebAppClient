import { Component, OnInit, EventEmitter,
         ViewChild, ViewContainerRef, ReflectiveInjector, ComponentFactoryResolver
         } from '@angular/core';
import { Observer } from 'rxjs';

// Import Service
import { CameraService } from '../../service/camera-service';

// Import Models
import { TrafficPole } from '../../service/models/CameraModel';

// Import Component
import { TrafficPoleEditComponent } from './sub-component/traffic-pole-edit.component';
import { PopupComponent } from '../../shared/popup/index';
import { YesnoPanelComponent } from '../../shared/yesno-panel/yesno-panel';
import { WarningPanelComponent } from '../../shared/shared-module/warning-panel/warning-panel';

// Import Utils
import { EventData } from '../../utils/event.helper';
import { Pagination } from '../../utils/pagination.helper';

@Component({
    moduleId: module.id,
	selector: 'camera-settings-cmp',
	templateUrl: 'camera-settings.component.html',
    entryComponents: [
        TrafficPoleEditComponent,
        YesnoPanelComponent,
        WarningPanelComponent
    ],
    providers: [
        CameraService
    ]
})

export class CameraSettingsComponent implements OnInit {
    // Constant
    public NUM_ITEMS_PER_PAGE: number = 5;

    // Traffic poles data and pagination
    public TrafficPoles: TrafficPole[];
    public ChoiceTrafficPoles: boolean[];
    public Pages: Pagination;
    private TrafficPoleInfo: string;

    // Create | Edit TrafficPole Modal - variables
    @ViewChild('TrafficPoleModalContainer', { read: ViewContainerRef }) private TrafficPoleModalContainer: ViewContainerRef;
    private TrafficPoleModalComponent: any = null;

    // Delete
    private selectedTrafficPole: number;
    private deleteMessage: string;

    // Yesno
    @ViewChild('YesnoModalContainer', { read: ViewContainerRef }) private YesnoModalContainer: ViewContainerRef;
    private YesnoModalComponent: any = null;

    // Popup message
    private popupType: Observer<string>;
    private popupMessage: string;    

    constructor(private cameraService: CameraService,
                private resolver: ComponentFactoryResolver) {
        this.TrafficPoles = [];
        this.Pages = new Pagination(1, 1);

        this.selectedTrafficPole = -1;
        this.popupMessage = '';
    }

    ngOnInit() {
        this.getNumItems();
        this.getTrafficPoles(1);
	}



    // Event handling ------------------------------------------
    createDeleteMultiItemEvent(): void {
        if (this.YesnoModalComponent) {
            this.YesnoModalComponent.destroy();
        }

        var response = new EventEmitter<EventData>();
        // Create data to pass to modal
        let data = [
            {provide: 'Header', useValue: 'Delete selected traffic poles'},
            {provide: 'Message', useValue: 'Selected traffic poles will be deleted. Are you sure ?'},
            {provide: 'Response', useValue: response}
        ];
        let resolveData = ReflectiveInjector.resolve(data);
        let injector = ReflectiveInjector.fromResolvedProviders(resolveData, this.YesnoModalContainer.parentInjector);

        // Create component
        let factory = this.resolver.resolveComponentFactory(YesnoPanelComponent);
        let component = factory.create(injector);

        // Add component to modal
        this.YesnoModalContainer.insert(component.hostView);
        this.YesnoModalComponent = component;

        // Handle response
        response.subscribe(
            (result: string) => {
                var closeDiv: any;
                switch (result) {
                    case YesnoPanelComponent.YES:
                        let idx = 0;
                        this.ChoiceTrafficPoles.forEach((choiceTrafficPole: boolean) => {
                            if (choiceTrafficPole) {
                                (this.cameraService.DeleteTrafficPole(this.TrafficPoles[idx].PoleId))
                                    .subscribe(
                                        (result: any) => {
                                            if (result.status === 'success') {
                                                this.popupMessage = 'Delete traffic pole.';
                                                this.popupType.next(PopupComponent.Success);
                                            } else {
                                                this.popupMessage = 'Can not delete traffic pole.';
                                                this.popupType.next(PopupComponent.Failure);
                                            }
                                        },
                                        (err: any) => {
                                            console.log(err);
                                        }
                                    );
                            }
                            idx++;
                        });

                        closeDiv = $('#YesnoModalBtn');
                        closeDiv.click();
                        let currentPage = this.Pages.GetPageActive();
                        this.getNumItems(currentPage);

                        break;
                    case YesnoPanelComponent.NO:
                        closeDiv = $('#YesnoModalBtn');
                        closeDiv.click();
                        break;
                    default:
                        // Do nothing here
                        break;
                }
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    createWarningEvent(message: string): void {
        if (this.YesnoModalComponent) {
            this.YesnoModalComponent.destroy();
        }

        // Create data to pass to modal
        var response = new EventEmitter<EventData>();
        let data = [
            {provide: 'Header', useValue: 'Warning'},
            {provide: 'Message', useValue: message},
            {provide: 'Response', useValue: response}
        ];
        let resolveData = ReflectiveInjector.resolve(data);
        let injector = ReflectiveInjector.fromResolvedProviders(resolveData, this.YesnoModalContainer.parentInjector);

        // Create component
        let factory = this.resolver.resolveComponentFactory(WarningPanelComponent);
        let component = factory.create(injector);

        // Add component to modal
        this.YesnoModalContainer.insert(component.hostView);
        this.YesnoModalComponent = component;

        // Handle response
        response.subscribe(
            (result: string) => {
                switch (result) {
                    case WarningPanelComponent.CONFIRM:
                        var closeDiv = $('#YesnoModalBtn');
                        closeDiv.click();
                        break;
                    default:
                        // Do nothing here
                        break;
                }
            },
            (err: any) => {
                console.log(err);
            }
        );
    }
    // Event handling (end) ------------------------------------



    // Actions on table ----------------------------------------
    ClickCheckAll(element: any): void {
        for (let idx: number = 0; idx < this.ChoiceTrafficPoles.length; idx++) {
            this.ChoiceTrafficPoles[idx] = element.checked;
        }
    }

    ClickCheck(event: any, idx: number): void {
        this.ChoiceTrafficPoles[idx] = event.target.checked;
    }

    ClickCreate(): void {
        if (this.TrafficPoleModalComponent) {
            this.TrafficPoleModalComponent.destroy();
        }

        var response = new EventEmitter<EventData>();
        // Create data to pass to modal
        let data = [
            {provide: 'TrafficPole', useValue: new TrafficPole()},
            {provide: 'IsEdit', useValue: false},
            {provide: 'Response', useValue: response}
        ];
        let resolveData = ReflectiveInjector.resolve(data);
        let injector = ReflectiveInjector.fromResolvedProviders(resolveData, this.TrafficPoleModalContainer.parentInjector);

        // Create component
        let factory = this.resolver.resolveComponentFactory(TrafficPoleEditComponent);
        let component = factory.create(injector);

        // Add component to modal
        this.TrafficPoleModalContainer.insert(component.hostView);
        this.TrafficPoleModalComponent = component;

        // Handle response
        response.subscribe(
            (data: EventData) => {
                switch (data.Type) {
                    case EventData.CREATE:
                        var newTrafficPole = data.Data;
                        (this.cameraService.CreateTrafficPole(newTrafficPole))
                            .subscribe(
                                (result: any) => {
                                    if (result.status === 'success') {
                                        this.popupMessage = result.message;
                                        this.popupType.next(PopupComponent.Success);
                                    } else {
                                        this.popupMessage = result.message;
                                        this.popupType.next(PopupComponent.Failure);
                                    }
                                },
                                (err: any) => {
                                    console.log(err);
                                }
                            );
                        break;

                    default:
                        // Do nothing here
                        break;
                }
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    ClickEdit(trafficPole: TrafficPole): void {
        if (this.TrafficPoleModalComponent) {
            this.TrafficPoleModalComponent.destroy();
        }

        // Create data to pass to modal
        var response = new EventEmitter<EventData>();
        let data = [
            {provide: 'TrafficPole', useValue: trafficPole},
            {provide: 'IsEdit', useValue: true},
            {provide: 'Response', useValue: response}
        ];
        let resolveData = ReflectiveInjector.resolve(data);
        let injector = ReflectiveInjector.fromResolvedProviders(resolveData, this.TrafficPoleModalContainer.parentInjector);

        // Create component
        let factory = this.resolver.resolveComponentFactory(TrafficPoleEditComponent);
        let component = factory.create(injector);

        // Add component to modal
        this.TrafficPoleModalContainer.insert(component.hostView);

        this.TrafficPoleModalComponent = component;

        // Handle response
        response.subscribe(
            (data: EventData) => {
                switch (data.Type) {
                    case EventData.EDIT:
                        var newTrafficPole = data.Data;
                        (this.cameraService.EditTrafficPole(newTrafficPole))
                            .subscribe(
                                (result: any) => {
                                    if (result.status === 'success') {
                                        this.popupMessage = result.message;
                                        this.popupType.next(PopupComponent.Success);
                                    } else {
                                        this.popupMessage = result.message;
                                        this.popupType.next(PopupComponent.Failure);
                                    }
                                },
                                (err: any) => {
                                    console.log(err);
                                }
                            );
                        break;

                    default:
                        // Do nothing here
                        break;
                }
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    ClickDelete(poleId: number): void {
        this.deleteMessage = 'Do you want to delete PoleId = ' + this.selectedTrafficPole + ' ?';
        this.selectedTrafficPole = poleId;
    }

    SelectDelete(): void {
        if (this.ChoiceTrafficPoles.indexOf(true) >= 0) {    // At least choose one
            this.createDeleteMultiItemEvent();
        } else {                                            // Not choose any traffic pole
            this.createWarningEvent('Please choose at least one traffic pole');
        }
    }

    SelectActive(): void {
        if (this.ChoiceTrafficPoles.indexOf(true) >= 0) {    // At least choose one
            // TODO    
        } else {                                            // Not choose any traffic pole
            this.createWarningEvent('Please choose at least one traffic pole');
        }
    }

    SelectDeactive(): void {
        if (this.ChoiceTrafficPoles.indexOf(true) >= 0) {    // At least choose one
            // TODO
        } else {                                            // Not choose any traffic pole
            this.createWarningEvent('Please choose at least one traffic pole');
        }
    }

    ClickPrevious(): void {
        let currentPage = this.Pages.GetPageActive();
        this.Pages.SetPageActive(currentPage - 1);
        this.getTrafficPoles(this.Pages.GetPageActive());
    }

    ClickNext(): void {
        let currentPage = this.Pages.GetPageActive();
        this.Pages.SetPageActive(currentPage + 1);
        this.getTrafficPoles(this.Pages.GetPageActive());
    }

    onNumItemsChange(value: number): void {
        this.NUM_ITEMS_PER_PAGE = value;
        let currentPage = this.Pages.GetPageActive();
        this.getNumItems(currentPage);
    }

    GetPage(page:number): void {
        this.Pages.SetPageActive(page);
        this.getTrafficPoles(page);
    }

    ShowTrafficPoleInfo(trafficPole: TrafficPole): void {
        this.TrafficPoleInfo = trafficPole.ToJSON();
    }
    // Actions on table (end) ----------------------------------



    // Data handling -------------------------------------------
    createEmptyChoiceTrafficPole(): void {
        this.ChoiceTrafficPoles = [];
        for (let idx: number = 0; idx < this.TrafficPoles.length; idx++) {
            this.ChoiceTrafficPoles.push(false);
        }
    }
    // Data handling (end) -------------------------------------



    // Database interaction ------------------------------------
    getNumItems(pageActive?: number): void {
        (this.cameraService.GetNumTrafficPoles())
            .subscribe(
                (result: number) => {
                    this.Pages = new Pagination(result, this.NUM_ITEMS_PER_PAGE);
                    if (pageActive) {
                        this.Pages.SetPageActive(pageActive);
                        this.getTrafficPoles(this.Pages.GetPageActive());
                    } else {
                        this.Pages.SetPageActive(1);
                        this.getTrafficPoles(this.Pages.GetPageActive());
                    }
                },
                (err: any) => {
                    console.log(err);
                }
            );
    }

    getTrafficPoles(page: number): void {
        (this.cameraService.GetTrafficPoles(page, this.NUM_ITEMS_PER_PAGE))
            .subscribe(
                (results: TrafficPole[]) => {
                    this.TrafficPoles = results;
                    this.createEmptyChoiceTrafficPole();
                },
                (err: any) => {
                    console.log(err);
                }
            );
    }

    DeleteTrafficPole(): void {
        (this.cameraService.DeleteTrafficPole(this.selectedTrafficPole))
            .subscribe(
                (result: any) => {
                    if (result.status === 'success') {
                        this.popupMessage = 'Delete traffic pole.';
                        this.popupType.next(PopupComponent.Success);
                    } else {
                        this.popupMessage = 'Can not delete traffic pole.';
                        this.popupType.next(PopupComponent.Failure);
                    }

                    let currentPage = this.Pages.GetPageActive();
                    this.getNumItems(currentPage);
                },
                (err: any) => {
                    console.log(err);
                }
            );
    }
    // Database interaction (end) ------------------------------
}
