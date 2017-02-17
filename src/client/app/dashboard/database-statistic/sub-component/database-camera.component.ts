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

declare let jwplayer: any;

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
        var from = group.value.fromForm.split(' ').join('-').split(':').join('-').split('-');
        var to = group.value.toForm.split(' ').join('-').split(':').join('-').split('-');

        var fromDate = Date.UTC(from[0], from[1] - 1, from[2], from[3], from[4], from[5]);
        var toDate = Date.UTC(to[0], to[1] - 1, to[2], to[3], to[4], to[5]);
        if ((fromDate - toDate) >= 0) {
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
        datePickerDiv.datetimepicker({
            format: 'yyyy-mm-dd hh:ii:ss',
            autoclose: true,
            todayBtn: true,
            pickerPosition: 'bottom-left'
        }).on('changeDate', (event: any) => {
            this.from = datePickerDiv.val();
        });
    }

    createDatepickerToDiv(): void {
        var datePickerDiv:any = $('#'+this.ComponentId+'_todiv');
        datePickerDiv.datetimepicker({
            format: 'yyyy-mm-dd hh:ii:ss',
            autoclose: true,
            todayBtn: true,
            pickerPosition: 'bottom-left'
        }).on('changeDate', (event: any) => {
            this.to = datePickerDiv.val();
        });
    }

    createLiveStreamCamera(): void {
        var lastIdx = this.Camera.StreamId.lastIndexOf('/');
        var first = this.Camera.StreamId.substring(0, lastIdx);
        var second = this.Camera.StreamId.substring(lastIdx + 1, this.Camera.StreamId.length);
        jwplayer(this.ComponentId+'_Camera').setup({
            'flashplayer': 'assets/js/player.swf',
            'file': second,
            'streamer': first,
            'controlbar': 'bottom',
            'width': '100%',
            'height': '450'
        });
    }
    // Create Date pick for From and To Div (end) --------------------

    ngAfterViewInit(): void {
        this.createDatepickerFromDiv();
        this.createDatepickerToDiv();
        this.createLiveStreamCamera();
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
                data: [[Date.UTC(2016, 9, 21), 0],
                    [Date.UTC(2016, 10, 4), 28],
                    [Date.UTC(2016, 10, 9), 25],
                    [Date.UTC(2016, 10, 27), 2],
                    [Date.UTC(2016, 11, 2), 28],
                    [Date.UTC(2016, 11, 26), 28],
                    [Date.UTC(2016, 11, 29), 47],
                    [Date.UTC(2017, 0, 11), 79],
                    [Date.UTC(2017, 0, 26), 72],
                    [Date.UTC(2017, 1, 3), 2],
                    [Date.UTC(2017, 1, 11), 12],
                    [Date.UTC(2017, 1, 25), 2],
                    [Date.UTC(2017, 2, 11), 18],
                    [Date.UTC(2017, 3, 11), 19],
                    [Date.UTC(2017, 4, 1), 85],
                    [Date.UTC(2017, 4, 5), 22],
                    [Date.UTC(2017, 4, 19), 15],
                    [Date.UTC(2017, 5, 3), 0]]
            });
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
