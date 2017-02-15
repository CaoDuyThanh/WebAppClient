import { Component, ElementRef, AfterViewInit, EventEmitter,
         ViewChild, ViewContainerRef, ReflectiveInjector, ComponentFactoryResolver
         } from '@angular/core';
import { ScriptHelper } from '../../utils/script.helper';
import { CSSHelper } from '../../utils/css.helper';
import { Pagination } from '../../utils/pagination.helper';
import { Observer } from 'rxjs';

// Import Service
import { CameraService } from '../../service/camera-service';


// Import Models
import { TrafficPole } from '../../service/models/CameraModel';

// Import Component
// import { TrafficPoleEditComponent } from './sub-component/traffic-pole-edit.component';
import { PopupComponent } from '../../shared/popup/index';
import { YesnoPanelComponent } from '../../shared/yesno-panel/yesno-panel';
import { WarningPanelComponent } from '../../shared/shared-module/warning-panel/warning-panel';

// Import Utils
import { EventData } from '../../utils/event.helper';

@Component({
    moduleId: module.id,
	selector: 'camera-visualize-cmp',
	templateUrl: 'camera-visualize.component.html'
})

export class CameraVisualizeComponent implements AfterViewInit {
    
	loadCss(): void {
		// Load External CSS
		var viziCss = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/vizicities.css');
		var styleCss = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/3d-map.css');
		var datGuiCss = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/dat.gui.css');

		this.elementRef.nativeElement.appendChild(viziCss);
		this.elementRef.nativeElement.appendChild(styleCss);
	}

	loadJavascript(): void {
		// Load External Javascript
		var jqueryTag = this.scriptHelper.CreateScriptTag('text/javascript', 'http://code.jquery.com/jquery-1.9.1.min.js');
		var threejsTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/three.min.js');
		var tweenMaxTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/TweenMax.min.js');
		var chromaTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/chroma.min.js');
		var vizicitiesTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/vizicities.js');
		var datGuiTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/dat.gui.js');
		var jwplayerTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/jwplayer.js');

		var settingsTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/3d-map-settings.js');
  		var dataTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/3d-map-camera-data.js');
  		var utilsTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/3d-map-utils.js');
		var mainTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/3d-map.js');
		// <script src="settings.js"></script>
  //   <script src="camera_data.js"></script>
  //   <script src="utils.js"></script>
  		

		this.elementRef.nativeElement.appendChild(jqueryTag);
		this.elementRef.nativeElement.appendChild(threejsTag);
		this.elementRef.nativeElement.appendChild(tweenMaxTag);
		this.elementRef.nativeElement.appendChild(chromaTag);
		this.elementRef.nativeElement.appendChild(vizicitiesTag);
		this.elementRef.nativeElement.appendChild(datGuiTag);
		this.elementRef.nativeElement.appendChild(jwplayerTag);
		this.elementRef.nativeElement.appendChild(settingsTag);
		this.elementRef.nativeElement.appendChild(dataTag);
		this.elementRef.nativeElement.appendChild(utilsTag);
		this.elementRef.nativeElement.appendChild(mainTag);
	}

    constructor(private elementRef: ElementRef,
				private cssHelper: CSSHelper,
				private scriptHelper: ScriptHelper) {
		
	}

    ngAfterViewInit() {
        this.loadCss();
		this.loadJavascript();

		
    }
}
