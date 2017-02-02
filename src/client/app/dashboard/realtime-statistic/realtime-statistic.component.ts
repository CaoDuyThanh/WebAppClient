import { Component, OnInit, ViewChildren, ViewContainerRef, QueryList, ReflectiveInjector, ComponentFactoryResolver } from '@angular/core';
import { Config } from '../../shared/index';

// Import sub components
import { RealtimeStreetComponent } from './sub-component/realtime-street.component';

@Component({
    moduleId: module.id,
    selector: 'realtime-statistic-cmp',
    templateUrl: 'realtime-statistic.component.html'
})

export class RealtimeStatisticComponent implements OnInit {

	@ViewChildren('RealtimeStreetContainer', { read: ViewContainerRef }) RealtimeStreetContainer: QueryList<ViewContainerRef>;
	private realtimeStreetComps: any[];

	private componentIds:number[];

    constructor(private resolver: ComponentFactoryResolver){
        this.realtimeStreetComps = [];
        this.componentIds = [];
    }

    ngOnInit() {
    }

    Createsome(idx: number):string{
        return "Component" + idx.toString();
    }

    ClickDeleteStreet(componentId:number): void{
        this.componentIds.splice(this.componentIds.indexOf(componentId), 1);
    }

    ClickAddViewGraph(): void{
        var currentTimeStamp = Math.floor(Date.now() / 1000); 
        this.componentIds.push(currentTimeStamp);
    }

}
