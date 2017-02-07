import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, Input,
         ViewChild, ViewContainerRef, ComponentFactoryResolver, EventEmitter, ReflectiveInjector  } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { CSSHelper } from '../../../utils/css.helper';

// Import components
import { WarningPanelComponent } from '../../../shared/shared-module/warning-panel/warning-panel';

// Import Service
import { StreetService } from '../../../service/street-service';

// Import utils
import { EventData } from '../../../utils/event.helper';

@Component({
    moduleId: module.id,
    selector: 'database-street-cmp',
    templateUrl: 'database-street.component.html',
    entryComponents: [
        WarningPanelComponent
    ]
})

export class DatabaseStreetComponent implements OnInit, AfterViewInit, OnDestroy {
    // CONSTANT
    static NUM_ITEMS: number = 10;

    @Input() ComponentId: string;

    // Annoucement panel
    @ViewChild('AnnoucementModalContainer', { read: ViewContainerRef }) AnnoucementModalContainer: ViewContainerRef;
    private AnnoucementModalComponent: any = null;

    // Input form
    private group: FormGroup;
    private fromToGroup: FormGroup;
    private listRoadsForm: AbstractControl;
    private fromForm: AbstractControl;
    private toForm: AbstractControl;
    private graphTypeForm: AbstractControl;
    private viewTypeForm: AbstractControl;

    // Search component
    @ViewChild('searchdiv') private searchDiv: ElementRef;
    private searchStr: string;
    private suggestSearch: any[];
    private selectedSearch: any;
    private streetSearch: any[];

    // Chart
    private chartOptions: any;
    private chart:any;

    // Parameters
    private listRoads: string[];
    private from: string;
    private to: string;
    private graphType: string;
    private viewType: string;

    // Timer
    private timer: any;

    constructor(private streetService: StreetService,
                private element: ElementRef,
                private cssHelper: CSSHelper,
                private fb: FormBuilder,
                private resolver: ComponentFactoryResolver) {
        // Input form
        this.fromToGroup = fb.group({
            'fromForm': ['', Validators.required],
            'toForm': ['',  Validators.required]}
        ,{
            validator: this.fromToValidation.bind(this)
        });
        this.group = fb.group({
            'listRoadsForm': ['', this.listRoadvalidation],
            'fromToGroup': this.fromToGroup,
            'graphTypeForm': ['', Validators.required],
            'viewTypeForm': ['', Validators.required],
        });
        this.listRoadsForm = this.group.controls['listRoadsForm'];
        this.fromForm = this.fromToGroup.controls['fromForm'];
        this.toForm = this.fromToGroup.controls['toForm'];
        this.graphTypeForm = this.group.controls['graphTypeForm'];
        this.viewTypeForm = this.group.controls['viewTypeForm'];

        // Search
        this.searchStr = '';
        this.suggestSearch = [];
        this.selectedSearch = null;
        this.streetSearch = [];

        // Chart
        this.chartOptions = null;
        this.chart = null;

        // Parameters
        this.listRoads = [];
        this.from = '';
        this.to = '';
        this.graphType = '';
        this.viewType = '';

        // Timer
        this.timer = null;
    }

    // Validations (start) ---------------------------

    listRoadvalidation(control: FormControl): any {
        if (control.value === 0) {
            return {'AtLeastOneRoad': true};
        }
    }

    fromToValidation(group: FormGroup): any {
        var from = group.value.fromForm.split('/');
        var to = group.value.toForm.split('/');
        var fromDate = new Date(from[2], from[0] - 1, from[1]);
        var toDate = new Date(to[2], to[0] - 1, to[1]);
        if (fromDate > toDate) {
            return {'FromLessTo': true};
        }
    }

    // Validations (end) -----------------------------


    ngOnInit(): void {
        // Create event for search input
        this.createSearchEvent();
        this.createChartOptions();
    }

    onGraphTypeChange(graphType: string): void {
        this.graphType = graphType;
        this.createChartOptions();
    }

    onViewTypeChange(viewType: string): void {
        this.viewType = viewType;
    }

    suggestSearchSelected(suggestSearch: any) {
        this.searchStr = suggestSearch ? suggestSearch.name : 'none';
    }

    createSearchEvent(): void {
        Observable.fromEvent(this.searchDiv.nativeElement, 'keyup')
            .map((e: any) => e.target.value)
            .filter((text: string) => text.length > 1)
            .debounceTime(200)
            .map((query: string) => this.streetService.SearchName(query, DatabaseStreetComponent.NUM_ITEMS))
            .switch()
            .subscribe(
                (results: any) => {
                    this.suggestSearch = results.map((result: any) => {
                        return {
                            name: result,
                            searchText: result
                        };
                    });
                },
                (err: any) => {
                    console.log(err);
                }
            );
    }

    // Create Date pick for From and To Div (start) ------------------
    createDatepickerFromDiv(): void {
        var datePickerDiv:any = $('#'+this.ComponentId+'_fromdiv');
        datePickerDiv.datepicker({
            'maxDate': 0
        }).on('changeDate', (event: any) => {
            this.from = datePickerDiv.val();
        });
    }

    createDatepickerToDiv(): void {
        var datePickerDiv:any = $('#'+this.ComponentId+'_todiv');
        datePickerDiv.datepicker({
            'maxDate': 0
        }).on('changeDate', (event: any) => {
            this.to = datePickerDiv.val();
        });
    }
    // Create Date pick for From and To Div (end) --------------------


    ngAfterViewInit(): void {
        this.createDatepickerFromDiv();
        this.createDatepickerToDiv();
    }

    SaveChart(chart:any): void {
        this.chart = chart;
    }

    createChartOptions(): void {
        this.chartOptions = {
            chart: {
                type: this.graphType === 'LineGraph' ? 'spline' : 'spline'
            },
            title: {
                text: 'Number of vehicles at some streets'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%e. %b',
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Number of vehicles'
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%e. %b}: {point.y:.2f} vehicle(s)'
            },
            plotOptions: {
                spline: {
                    marker: {
                        enabled: true
                    }
                }
            },
            series: []
        };
    }

    ClickSearchRoad(): void {
        var searchDiv: any = $('#' + this.ComponentId + '_typeahead' + ' .typeahead-input');
        this.searchStr = searchDiv.val();
        (this.streetService.SearchStreets(this.searchStr))
            .subscribe((results: any[]) => {
                    this.streetSearch = results;
                },
                (err: any) => {
                    console.log(err);
                }
            );
    }

    ClickDelete(streetName: string): void {
        this.listRoads.splice(this.listRoads.indexOf(streetName), 1);
    }

    ClickAddRoad(streetName: string): void {
        if (this.listRoads.indexOf(streetName) < 0) {
            this.listRoads.push(streetName);
        }
    }

    ClickViewGraph(): void {
        if (this.group.valid) {
            if (this.timer) {
                this.timer.unsubscribe();
            }

            for (let idx:number = 0; idx < this.listRoads.length; idx++) {
                var roadName = this.listRoads[idx];
                this.chart.addSeries({
                    name: roadName,
                    data: []
                });
            }

            // TODO
            // var observable = Observable.timer(0, this.timeUpdate);
            // this.timer = observable.subscribe(() => {
            //     for (let idx:number = 0; idx < this.listRoads.length; idx++) {
            //         var streetName = this.listRoads[idx];
            //         (this.streetService.GetNumVehiclesStreet(streetName))
            //             .subscribe(
            //                 (result: any) => {
            //                     var dataLength = this.chart.series[idx].data.length;
            //                     if (dataLength === 0) {
            //                         this.chart.series[idx].addPoint([result.utc_time, result.num_vehicles]);
            //                     } else {
            //                         var oldUTC = this.chart.series[idx].data[dataLength - 1].x;
            //                         if (oldUTC < result.utc_time) {
            //                             this.chart.series[idx].addPoint([result.utc_time, result.num_vehicles]);
            //                         }
            //                     }
            //                 },
            //                 (err: any) => {
            //                     console.log(err);
            //                 }
            //             );
            //     }
            // });
        } else {
            // Open modal
            var openDiv = $('#StreetAnnoucementOpenModalBtn');
            openDiv.click();

            // Show warning
            if (this.AnnoucementModalComponent) {
                this.AnnoucementModalComponent.destroy();
            }

            // Create data to pass to modal
            var response = new EventEmitter<EventData>();
            let data = [
                {provide: 'Header', useValue: 'Warning'},
                {provide: 'Message', useValue:
                          'Oops! There is something wrong with the inputs. Please correct them before click "View Graph"'},
                {provide: 'Response', useValue: response}
            ];
            let resolveData = ReflectiveInjector.resolve(data);
            let injector = ReflectiveInjector.fromResolvedProviders(resolveData, this.AnnoucementModalContainer.parentInjector);

            // Create component
            let factory = this.resolver.resolveComponentFactory(WarningPanelComponent);
            let component = factory.create(injector);

            // Add component to modal
            this.AnnoucementModalContainer.insert(component.hostView);
            this.AnnoucementModalComponent = component;

            // Handle response
            response.subscribe(
                (result: string) => {
                    switch (result) {
                        case WarningPanelComponent.CONFIRM:
                            var closeDiv = $('#StreetAnnoucementCloseModalBtn');
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
    }

    ngOnDestroy() {
        if (this.timer) {
            this.timer.unsubscribe();
        }
    }

    ClickReset(): void {
        // TODO
        console.log('Click Reset');
    }
}
