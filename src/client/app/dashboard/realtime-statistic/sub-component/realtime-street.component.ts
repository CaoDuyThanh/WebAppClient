import { Component, OnInit, Injector, ElementRef, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { CSSHelper } from '../../../utils/css.helper';

// Import Service
import { StreetService } from '../../../service/street-service';

@Component({
    moduleId: module.id,
    selector: 'realtime-street-cmp',
    templateUrl: 'realtime-street.component.html',
    inputs: [
        'ComponentId'
    ]
})

export class RealtimeStreetComponent implements OnInit{
    // CONSTANT
    private NUM_ITEMS: number = 5;

    public ComponentId: string;

    private suggestSearch: string[];
    private chartOptions: any;
    private chart:any;

    // Parameters
    private listRoads: string[];
    private from: number;
    private viewType: string;
    private timeUpdate: number;

    // Timer
    private timer: any;

    constructor(private streetService: StreetService,
                private element: ElementRef,
                private cssHelper: CSSHelper){
        this.suggestSearch = [];
        this.chart = null;

        var currentTimeStamp = Date.now();
        this.listRoads = [];
        this.from = currentTimeStamp;
        this.viewType = 'LineGraph';
        this.timeUpdate = 5000;
    }

    ngOnInit(): void{
        // Add Css
        var bootstrapTimepicker = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/bootstrap-timepicker.css');
        this.element.nativeElement.appendChild(bootstrapTimepicker);

        // Create event for search input
        this.createSearchEvent();
        this.createChartOptions();
    }

    onViewTypeChange(viewType: string): void{
        this.viewType = viewType;
    }

    onTimeUpdateChange(timeUpdate: number): void{
        this.timeUpdate = timeUpdate;
    }
    
    createSearchEvent(): void{
        Observable.fromEvent(this.element.nativeElement, 'keyup')
            .map((e: any) => e.target.value)
            .filter((text: string) => text.length > 1)
            .debounceTime(200)
            .map((query: string) => this.streetService.SearchName(query, this.NUM_ITEMS))
            .switch()
            .subscribe(
                (results: any) => {
                    this.suggestSearch = results;
                    console.log(this.suggestSearch);
                },
                (err: any) => {
                    console.log(err);
                },
                () => {
                }
            );
    }

    createTimepickerFromDiv(): void{
        var timePickerDiv:any = $('#'+this.ComponentId+'_fromdiv');
        timePickerDiv.timepicker();
    }

    ngAfterViewInit(): void{
        this.createTimepickerFromDiv();
    }
    
    SaveChart(chart:any): void{
        this.chart = chart;
        console.log(this.chart);
    }

    createChartOptions(): void{
        this.chartOptions = {
            chart: {
                type: this.viewType == "LineGraph" ? 'spline' : 'spline'
            },
            title: {
                text: 'Number of vehicles at some street'
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
                pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
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

    ClickAddRoad(searchString: any): void{
        this.listRoads.push(searchString);
    }

    ClickViewGraph(): void{
        if (this.timer){
            this.timer.unsubscribe();
        }
        
        for (let idx:number = 0; idx < this.listRoads.length; idx++){
            var roadName = this.listRoads[idx];
            this.chart.addSeries({
                name: roadName,
                data: []
            })
        }

        var observable = Observable.timer(0, this.timeUpdate);
        this.timer = observable.subscribe(() => {
            for (let idx:number = 0; idx < this.listRoads.length; idx++){
                var streetName = this.listRoads[idx];
                (this.streetService.GetNumVehiclesStreet(streetName))
                    .subscribe(
                        (result: number) => {
                            console.log(result);
                            this.chart.series[idx].addPoint([Date.now(), result]);
                        },
                        (err: any) => {
                            console.log(err);
                        },
                        () => {}
                    );
            }
            
        });
    }

    ngOnDestroy(){
        if (this.timer){
            this.timer.unsubscribe();
        }
    }

    ClickReset(): void{
        this.chart.series[0].addPoint(
                    [Date.UTC(1971, 0, 11), 0.79]);

    }
}
