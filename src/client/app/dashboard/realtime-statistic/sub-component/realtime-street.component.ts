import { Component, OnInit, Injector, ElementRef, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { CSSHelper } from '../../../utils/css.helper';

// Import module
import { Typeahead } from 'ng2-typeahead';

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
    private NUM_ITEMS: number = 10;

    public ComponentId: string;

    // Search component
    private searchStr: string;
    private suggestSearch: any[];
    private selectedSearch: any;
    private streetSearch: any[];
    
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
        var customStyle = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/custom-style.css');
        this.element.nativeElement.appendChild(customStyle);

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

    suggestSearchSelected(suggestSearch: any) {
        this.searchStr = suggestSearch ? suggestSearch.name : 'none';
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
                    this.suggestSearch = results.map((result: any) => {
                        return {
                            name: result,
                            searchText: result   
                        }
                    });
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
        console.log(timePickerDiv);
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

    ClickSearchRoad(): void{
        var searchDiv: any = $('#' + this.ComponentId + '_typeahead' + ' .typeahead-input');
        this.searchStr = searchDiv.val();
        (this.streetService.SearchStreets(this.searchStr))
            .subscribe((results: any[]) => {
                    this.streetSearch = results;
                },
                (err: any) => {
                    console.log(err);
                },
                () => {}
            )
    }

    ClickDelete(streetName: string): void{
        this.listRoads.splice(this.listRoads.indexOf(streetName), 1);
    }

    ClickAddRoad(streetName: string): void{
        if (this.listRoads.indexOf(streetName) < 0){
            this.listRoads.push(streetName);
        }
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
                        (result: any) => {
                            console.log(result);
                            console.log(result.utc_time);
                            var dataLength = this.chart.series[idx].data.length;
                            if (dataLength == 0){
                                this.chart.series[idx].addPoint([result.utc_time, result.num_vehicles]);
                            }else{
                                var oldUTC = this.chart.series[idx].data[dataLength - 1].x;    
                                console.log(this.chart.series[idx].data);
                                console.log(this.chart.series[idx].data[dataLength - 1]);

                                console.log(oldUTC);
                                if (oldUTC < result.utc_time){
                                    this.chart.series[idx].addPoint([result.utc_time, result.num_vehicles]);
                                }
                            }
                            
                            
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
