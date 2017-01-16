import { Injectable } from '@angular/core';

@Injectable()
export class CSSHelper{
	public CreateCSSTag(rel: string, type: string, url: string): any{
		var tag = document.createElement('link');
		tag.type = type;
		tag.rel = rel;
		tag.href = url;
		return tag;
	}
}
