import { Component, OnInit, AfterViewInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { CSSHelper } from '../../../utils/css.helper';

// Import Service
import { CameraService } from '../../../service/camera-service';

// Import models
import { Camera } from '../../../service/models/CameraModel';

@Component({
    moduleId: module.id,
    selector: 'realtime-camera-cmp',
    templateUrl: 'realtime-camera.component.html'
})

export class RealtimeCameraComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() ComponentId: string;
    @Input() Camera: Camera;

    // Chart
    private chartOptions: any;
    private chart:any;

    // Parameters
    private from: number;
    private viewType: string;
    private timeUpdate: number;

    // Timer
    private timer: any;

    constructor(private cameraService: CameraService,
                private element: ElementRef,
                private cssHelper: CSSHelper) {
        this.chart = null;

        var currentTimeStamp = Date.now();
        this.from = currentTimeStamp;
        this.viewType = 'LineGraph';
        this.timeUpdate = 5000;
    }

    ngOnInit(): void {
        // Add Css
        var bootstrapTimepicker = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/bootstrap-timepicker.css');
        this.element.nativeElement.appendChild(bootstrapTimepicker);
        var customStyle = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/custom-style.css');
        this.element.nativeElement.appendChild(customStyle);

        // Create event for search input
        this.createChartOptions();
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

    onViewTypeChange(viewType: string): void {
        this.viewType = viewType;
    }

    onTimeUpdateChange(timeUpdate: number): void {
        this.timeUpdate = timeUpdate;
    }

    createTimepickerFromDiv(): void {
        var timePickerDiv:any = $('#'+this.ComponentId+'_fromdiv');
        timePickerDiv.timepicker();
    }

    ngAfterViewInit(): void {
        this.createTimepickerFromDiv();
    }

    SaveChart(chart:any): void {
        this.chart = chart;
    }

    ClickViewGraph(): void {
        if (this.timer) {
            this.timer.unsubscribe();
        }

        this.chart.addSeries({
            name: 'Camera',
            data: []
        });

        var observable = Observable.timer(0, this.timeUpdate);
        this.timer = observable.subscribe(() => {
            (this.cameraService.GetNumVehiclesCamera(this.Camera))
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
