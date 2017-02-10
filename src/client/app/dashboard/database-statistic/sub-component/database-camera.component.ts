import { Component, OnInit, AfterViewInit, OnDestroy, Input,
         ViewChild, ViewContainerRef, ComponentFactoryResolver, EventEmitter, ReflectiveInjector } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

// Import components
import { WarningPanelComponent } from '../../../shared/shared-module/warning-panel/warning-panel';

// Import Service
import { CameraService } from '../../../service/camera-service';

// Import models
import { Camera } from '../../../service/models/CameraModel';

// Import utils
import { EventData } from '../../../utils/event.helper';

@Component({
    moduleId: module.id,
    selector: 'database-camera-cmp',
    templateUrl: 'database-camera.component.html',
    entryComponents: [
        WarningPanelComponent
    ]
})

export class DatabaseCameraComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() ComponentId: string;
    @Input() Camera: Camera;

    // Annoucement panel
    @ViewChild('AnnoucementModalContainer', { read: ViewContainerRef }) AnnoucementModalContainer: ViewContainerRef;
    private AnnoucementModalComponent: any = null;

    // Input form
    private group: FormGroup;
    private fromToGroup: FormGroup;
    private fromForm: AbstractControl;
    private toForm: AbstractControl;
    private graphTypeForm: AbstractControl;
    private viewTypeForm: AbstractControl;

    // Chart
    private chartOptions: any;
    private chart:any;

    // Parameters
    private from: string;
    private to: string;
    private graphType: string;
    private viewType: string;

    // Timer
    private timer: any;

    constructor(private cameraService: CameraService,
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
            'fromToGroup': this.fromToGroup,
            'graphTypeForm': ['', Validators.required],
            'viewTypeForm': ['', Validators.required],
        });
        this.fromForm = this.fromToGroup.controls['fromForm'];
        this.toForm = this.fromToGroup.controls['toForm'];
        this.graphTypeForm = this.group.controls['graphTypeForm'];
        this.viewTypeForm = this.group.controls['viewTypeForm'];

        // Chart
        this.chartOptions = null;
        this.chart = null;

        // Parameters
        this.from = '';
        this.to = '';
        this.graphType = '';
        this.viewType = '';

        // Timer
        this.timer = null;
    }

    // Validations (start) ---------------------------

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
        this.createChartOptions();
    }

    onGraphTypeChange(graphType: string): void {
        this.graphType = graphType;
        this.createChartOptions();
    }

    onViewTypeChange(viewType: string): void {
        this.viewType = viewType;
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
                type: this.viewType === 'LineGraph' ? 'spline' : 'spline'
            },
            title: {
                text: 'Number of vehicles'
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

    ClickViewGraph(): void {
        if (this.group.valid) {
            if (this.timer) {
                this.timer.unsubscribe();
            }

            this.chart.addSeries({
                name: 'Camera',
                data: []
            });

            // var observable = Observable.timer(0, this.timeUpdate);
            // this.timer = observable.subscribe(() => {
            //     (this.cameraService.GetNumVehiclesCamera(this.Camera))
            //         .subscribe(
            //             (result: any) => {
            //                 var dataLength = this.chart.series[0].data.length;
            //                 if (dataLength === 0) {
            //                     this.chart.series[0].addPoint([result.utc_time, result.num_vehicles]);
            //                 } else {
            //                     var oldUTC = this.chart.series[0].data[dataLength - 1].x;
            //                     if (oldUTC < result.utc_time) {
            //                         this.chart.series[0].addPoint([result.utc_time, result.num_vehicles]);
            //                     }
            //                 }
            //             },
            //             (err: any) => {
            //                 console.log(err);
            //             }
            //         );
            // });
        } else {
            // Open modal
            var openDiv = $('#CameraAnnoucementOpenModalBtn');
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
                            var closeDiv = $('#CameraAnnoucementCloseModalBtn');
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
        console.log('Click reset');
    }
}
