import { Component, OnInit, EventEmitter,
		 ViewChild, ViewContainerRef, ReflectiveInjector, ComponentFactoryResolver
         } from '@angular/core';

// Import Service
import { ServerService } from '../../service/server-service';

// Import Models
import { Server } from '../../service/models/ServerModel';
import { Camera } from '../../service/models/CameraModel';

// Import Component
import { YesnoPanelComponent } from '../../shared/yesno-panel/yesno-panel';
import { WarningPanelComponent } from '../../shared/shared-module/warning-panel/warning-panel';

// Import Utils
import { EventData } from '../../utils/event.helper';
import { Pagination } from '../../utils/pagination.helper';

@Component({
    moduleId: module.id,
    selector: 'server-density-settings-cmp',
    templateUrl: 'server-density-settings.component.html',
    providers: [
        ServerService
    ]
})

export class ServerDensitySettingsComponent implements OnInit {
	// Constant
	private NUM_ITEMS_PER_PAGE: number = 5;

	// Server density and pagination
	private serverDensities: Server[];
	private choiceServerDensities: boolean[];
	private pages: Pagination;
	private serverDensityInfo: string;

	// Create | Edit ServerDensity Modal - variables
    @ViewChild('ServerDensityModalContainer', { read: ViewContainerRef }) private serverDensityModalContainer: ViewContainerRef;
    private serverDensityModalComponent: any = null;

	// Yesno
    @ViewChild('YesnoModalContainer', { read: ViewContainerRef }) private YesnoModalContainer: ViewContainerRef;
    private YesnoModalComponent: any = null;


    constructor(private serverService: ServerService,
    			private resolver: ComponentFactoryResolver) {
		// Server density and pagination
    	this.serverDensities = [];
    	this.choiceServerDensities = [];
    	this.pages = new Pagination(1, 1);

    }

    ngOnInit() {
    	this.getNumItems();
    	this.getServerDensities(1);
    }

    // Event handling ------------------------------------------
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
    	for (let idx: number = 0; idx < this.choiceServerDensities.length; idx++) {
            this.choiceServerDensities[idx] = element.checked;
        }
    }

    ClickCheck(event: any, idx: number): void {
    	this.choiceServerDensities[idx] = event.target.checked;
    }

    ClickCreate(): void {
    	// TODO
    }

	ClickEdit(): void {

    }

    ClickDelete(): void {

    }

    SelectDelete(): void {
    	if (this.choiceServerDensities.indexOf(true) >= 0) {    // At least choose one
            // TODO
        } else {                                            	// Not choose any traffic pole
            this.createWarningEvent('Please choose at least one server density');
        }
    }

    SelectActive(): void {
    	if (this.choiceServerDensities.indexOf(true) >= 0) {    // At least choose one
            // TODO    
        } else {                                            	// Not choose any traffic pole
            this.createWarningEvent('Please choose at least one server density');
        }
    }

    SelectDeactive(): void {
    	if (this.choiceServerDensities.indexOf(true) >= 0) {    // At least choose one
            // TODO    
        } else {                                            	// Not choose any traffic pole
            this.createWarningEvent('Please choose at least one server density');
        }
    }

	ClickPrevious(): void {
    	let currentPage = this.pages.GetPageActive();
    	this.pages.SetPageActive(currentPage - 1);

    	// TODO
    	this.getServerDensities(this.pages.GetPageActive());
    }

    ClickNext(): void {
    	let currentPage = this.pages.GetPageActive();
    	this.pages.SetPageActive(currentPage - 1);

    	// TODO
    	this.getServerDensities(this.pages.GetPageActive());
    }

    GetPage(page: number): void {
    	this.pages.SetPageActive(page);
        this.getServerDensities(page);
    }

    ShowServerDensityInfo(serverDensity: Server): void {
    	this.serverDensityInfo = serverDensity.ToJSON();
    }
    // Actions on table (end) ----------------------------------



    // Data handling -------------------------------------------
	createEmptyChoiceServerDensities(): void {
        this.choiceServerDensities = [];
        for (let idx: number = 0; idx < this.serverDensities.length; idx++) {
            this.choiceServerDensities.push(false);
        }
    }
    // Data handling (end) -------------------------------------



    // Database interaction ------------------------------------
    getNumItems(pageActive?: number): void {
    	(this.serverService.GetNumServerDensity())
            .subscribe(
                (result: number) => {
                    this.pages = new Pagination(result, this.NUM_ITEMS_PER_PAGE);
                    if (pageActive) {
                        this.pages.SetPageActive(pageActive);
                        this.getServerDensities(this.pages.GetPageActive());
                    } else {
                        this.pages.SetPageActive(1);
                        this.getServerDensities(this.pages.GetPageActive());
                    }
                },
                (err: any) => {
                    console.log(err);
                }
            );
    }

    getServerDensities(page: number): void {
        (this.serverService.GetServerDensities(page, this.NUM_ITEMS_PER_PAGE))
            .subscribe(
                (results: Server[]) => {
                    this.serverDensities = results;
                    this.createEmptyChoiceServerDensities();
                },
                (err: any) => {
                    console.log(err);
                }
            );
    }
    // Database interaction (end) ------------------------------
}
