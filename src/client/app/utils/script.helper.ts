import { Injectable } from '@angular/core';

@Injectable()
export class ScriptHelper {
	public CreateScriptTag(type: string, src: string): any {
		var s = document.createElement('script');
		s.type = type;
		s.src = src;
		s.async = false;
		return s;
	}
}
