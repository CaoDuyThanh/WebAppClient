import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'realtime-statistic-cmp',
    templateUrl: 'realtime-statistic.component.html'
})

export class RealtimeStatisticComponent {
	private componentIds:number[];

    constructor() {
        this.componentIds = [];
    }

    CreateComponentId(idx: number):string {
        return 'Component' + idx.toString();
    }

    ClickDeleteStreet(componentId:number): void {
        this.componentIds.splice(this.componentIds.indexOf(componentId), 1);
    }

    ClickAddViewGraph(): void {
        var currentTimeStamp = Math.floor(Date.now() / 1000);
        this.componentIds.push(currentTimeStamp);
    }

}
