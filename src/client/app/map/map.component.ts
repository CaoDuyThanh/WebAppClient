import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { ScriptHelper } from '../utils/script.helper';
import { CSSHelper } from '../utils/css.helper';

/**
*	This class represents the lazy loaded LoginComponent.
*/

@Component({
	moduleId: module.id,
	selector: 'map-cmp',
	templateUrl: 'map.component.html'
})

export class MapComponent implements AfterViewInit {
	constructor(private elementRef: ElementRef,
				private scriptHelper: ScriptHelper,
				private cssHelper: CSSHelper) {
		// Load External CSS
		var leafletCss = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/leaflet.css');
		var styleCss = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/style.css');
		var leafletDvfCss = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/leaflet-dvf.css');
		var leafletMarkerClusterCss = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/markercluster.css');
		var leafletMarkerClusterDefaultCss = this.cssHelper.CreateCSSTag('stylesheet', 'text/css', '<%= CSS_SRC %>/markercluster.default.css');
		this.elementRef.nativeElement.appendChild(leafletCss);
		this.elementRef.nativeElement.appendChild(styleCss);
		this.elementRef.nativeElement.appendChild(leafletDvfCss);
		this.elementRef.nativeElement.appendChild(leafletMarkerClusterDefaultCss);
		this.elementRef.nativeElement.appendChild(leafletMarkerClusterCss);

		// Load External Javascript
		var jqueryTag = this.scriptHelper.CreateScriptTag('text/javascript', 'http://code.jquery.com/jquery-1.9.1.min.js');
		var leafletTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/leaflet-src.js');
		var leafletAjaxTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/leaflet.ajax.min.js');
		var leafletVectorgridTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/leaflet.vectorgrid.bundled.js');
		var leafletDvfMarkersClusterTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/leaflet.markercluster-src.js');
		var leafletDvfTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/leaflet-dvf.js');
		var longTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/long.js');
		var byteBufferTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/bytebuffer.js');
		var protobufTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/protobuf.js');


		this.elementRef.nativeElement.appendChild(jqueryTag);
		this.elementRef.nativeElement.appendChild(leafletTag);
		this.elementRef.nativeElement.appendChild(leafletAjaxTag);
		this.elementRef.nativeElement.appendChild(leafletVectorgridTag);
		this.elementRef.nativeElement.appendChild(leafletDvfMarkersClusterTag);
		this.elementRef.nativeElement.appendChild(leafletDvfTag);
		this.elementRef.nativeElement.appendChild(longTag);
		this.elementRef.nativeElement.appendChild(byteBufferTag);
		this.elementRef.nativeElement.appendChild(protobufTag);
	}

	ngAfterViewInit() {
		var mapSettingsTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/settings.js');
		var mapTag = this.scriptHelper.CreateScriptTag('text/javascript', '<%= JS_SRC %>/map.js');

		this.elementRef.nativeElement.appendChild(mapSettingsTag);
		this.elementRef.nativeElement.appendChild(mapTag);
	}
}
