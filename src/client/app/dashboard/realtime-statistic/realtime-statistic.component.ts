import { Component, OnInit, ElementRef } from '@angular/core';
import { CSSHelper } from '../../utils/css.helper';
import { ScriptHelper } from '../../utils/script.helper';


@Component({
    moduleId: module.id,
    selector: 'realtime-statistic-cmp',
    templateUrl: 'realtime-statistic.component.html'
})

export class RealtimeStatisticComponent implements OnInit {
	private componentIds:number[];

    constructor(private cssHelper: CSSHelper,
                private scriptHelper: ScriptHelper,
                private element: ElementRef) {
        this.componentIds = [];
    }

    ngOnInit(): void {
        var bootstrapTimepicker = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/bootstrap-timepicker.css');
        this.element.nativeElement.appendChild(bootstrapTimepicker);

        var bootstrapDateTimepicker = this.cssHelper.CreateCSSTag('stylesheet', 'text/css',
                                                      '<%= CSS_SRC %>/bootstrap-datetimepicker.min.css');
        this.element.nativeElement.appendChild(bootstrapDateTimepicker);

        var customStyle = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/custom-style.css');
        this.element.nativeElement.appendChild(customStyle);

        var jwplayer = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/jwplayer.js');
        this.element.nativeElement.appendChild(jwplayer);

        var jsDateTime = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/bootstrap-datetimepicker.js');
        this.element.nativeElement.appendChild(jsDateTime);

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
