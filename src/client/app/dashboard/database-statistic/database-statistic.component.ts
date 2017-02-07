import { Component, OnInit, ElementRef } from '@angular/core';
import { CSSHelper } from '../../utils/css.helper';

@Component({
    moduleId: module.id,
    selector: 'database-statistic-cmp',
    templateUrl: 'database-statistic.component.html'
})

export class DatabaseStatisticComponent implements OnInit {
	private componentIds: number[];

    constructor(private cssHelper: CSSHelper,
                private element: ElementRef) {
    	this.componentIds = [];
    }

    ngOnInit(): void {
        // Add Css
        var bootstrapDatepicker = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/bootstrap-datepicker.min.css');
        this.element.nativeElement.appendChild(bootstrapDatepicker);

        var customStyle = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/custom-style.css');
        this.element.nativeElement.appendChild(customStyle);
    }

    CreateComponentId(idx: number):string {
        return 'Component' + idx.toString();
    }

    ClickDeleteStreet(componentId:number): void {
        this.componentIds.splice(this.componentIds.indexOf(componentId), 1);
    }

    ClickAddViewGraph(): void {
        var currentTimeStamp = Math.floor(Date.now());
        this.componentIds.push(currentTimeStamp);
    }
}
