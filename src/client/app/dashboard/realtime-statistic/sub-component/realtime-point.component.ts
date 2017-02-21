import { Component, OnInit, AfterViewInit, OnDestroy, Input,
         ViewChild, ViewContainerRef, ComponentFactoryResolver, EventEmitter, ReflectiveInjector } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MinimapConfig } from './minimap.config';
import { Observable } from 'rxjs';

// Import components
import { WarningPanelComponent } from '../../../shared/shared-module/warning-panel/warning-panel';

// Import Service
// import { CameraService } from '../../../service/camera-service';
import { StreetService } from '../../../service/street-service';

// Import models
import { LatLon } from '../../../service/models/CameraModel';

// Import utils
import { EventData } from '../../../utils/event.helper';

declare let L: any;

@Component({
    moduleId: module.id,
    selector: 'realtime-point-cmp',
    templateUrl: 'realtime-point.component.html',
    entryComponents: [
        WarningPanelComponent
    ]
})

export class RealtimePointComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() ComponentId: string;
    @Input() Point: LatLon;
    @Input() Index: number;

    // Annoucement panel
    @ViewChild('AnnoucementModalContainer', { read: ViewContainerRef }) AnnoucementModalContainer: ViewContainerRef;
    private AnnoucementModalComponent: any = null;

    // Input form
    private group: FormGroup;
    private graphTypeForm: AbstractControl;
    private timeUpdateForm: AbstractControl;

    // Chart
    private chartOptions: any;
    private chart:any;

    // Parameters
    private graphType: string;
    private timeUpdate: string;

    // Timer
    private timer: any;
    private isRunning: boolean;

    // Map
    private mymap: any;

    constructor(private streetService: StreetService,
                private fb: FormBuilder,
                private resolver: ComponentFactoryResolver) {
        // Input form
        this.group = fb.group({
            'graphTypeForm': ['', Validators.required],
            'timeUpdateForm': ['', Validators.required],
        });
        this.graphTypeForm = this.group.controls['graphTypeForm'];
        this.timeUpdateForm = this.group.controls['timeUpdateForm'];

        // Chart
        this.chartOptions = null;
        this.chart = null;

        // Parameters
        this.graphType = '';
        this.timeUpdate = '';

        // Timer
        this.timer = null;
        this.isRunning = false;
    }

    ngOnInit(): void {
        // Create event for search input
        this.createChartOptions();
    }

    ngAfterViewInit(): void {
        // Create map
        setTimeout(this.createMap(), 2000);
    }

    createMap(): void {
        // Create map
        this.mymap = L.map(this.ComponentId + '_Map');
        var rasterOption = { maxZoom: 17, id: MinimapConfig.MAPID };
        var rasterLayer = L.tileLayer(MinimapConfig.RASTER_URL, rasterOption);
        rasterLayer.addTo(this.mymap);
        this.mymap.setView([this.Point.Lat, this.Point.Lon], 17);

        // Disable function
        this.mymap.dragging.disable();
        this.mymap.touchZoom.disable();
        this.mymap.doubleClickZoom.disable();
        this.mymap.scrollWheelZoom.disable();
        this.mymap.boxZoom.disable();
        this.mymap.keyboard.disable();


        // Add marker
        var iconOptions = L.icon({
            iconUrl: '<%= JS_SRC %>/images/marker-icon.png',
            shadowUrl: '<%= JS_SRC %>/images/marker-shadow.png',

            iconSize:     [30, 50],
            iconAnchor:   [15, 50],
            shadowSize:   [70, 20],
            shadowAnchor: [35, 20],
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        var marker = L.marker([this.Point.Lat, this.Point.Lon], {icon: iconOptions});
        marker.addTo(this.mymap);
    }

    createChartOptions(): void {
        this.chartOptions = {
            chart: {
                type: this.graphType === 'LineGraph' ? 'spline' : 'column'
            },
            title: {
                text: 'Density'
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
                    text: 'Density'
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
                },
                column: {
                    pointPadding: 0,
                    borderWidth: 0,
                    groupPadding: 0,
                    shadow: false
                }
            },
            series: []
        };
    }

    onGraphTypeChange(graphType: string): void {
        this.graphType = graphType;
        this.createChartOptions();
    }

    onTimeUpdateChange(timeUpdate: string): void {
        this.timeUpdate = timeUpdate;
    }

    

    SaveChart(chart:any): void {
        this.chart = chart;
    }

    ClickStart(): void {
        if (this.group.valid) {
            // Start get data
            if (this.timer) {
                this.timer.unsubscribe();
            }

            this.chart.addSeries({
                name: 'Point',
                data: []
            });

            this.isRunning = true;
            var observable = Observable.timer(0, +this.timeUpdate);
            this.timer = observable.subscribe(() => {
                    var streetName = 'Lý Thường Kiệt';
                    (this.streetService.GetNumVehiclesStreet(streetName))
                        .subscribe(
                            (result: any) => {
                                var dataLength = this.chart.series[0].data.length;
                                if (dataLength === 0) {
                                    this.chart.series[0].addPoint([result.utc_time, result.num_vehicles]);
                                } else {
                                    var oldUTC = this.chart.series[0].data[dataLength - 1].x;
                                    if (oldUTC < result.utc_time) {
                                        this.chart.series[0].addPoint([result.utc_time, result.num_vehicles]);
                                    }
                                }
                            },
                            (err: any) => {
                                console.log(err);
                            }
                        );
            });
        } else {
            // Open modal
            var openDiv = $('#PointAnnoucementOpenModalBtn');
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
                          'Oops! There is something wrong with the inputs. Please correct them before click "Start"'},
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
                            var closeDiv = $('#PointAnnoucementCloseModalBtn');
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

    ClickStop(): void {
        this.isRunning = false;
        this.timer.unsubscribe();
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
