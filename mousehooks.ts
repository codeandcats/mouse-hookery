/// <reference path="./typings/index.d.ts" />

import * as $ from 'jquery';

export interface IMouseState {
	x: number;
	y: number;
	button: number;
	withinElement: boolean;
}

interface IPoint {
	x: number;
	y: number;
}

export class MouseHooks {
	constructor(element: HTMLElement | JQuery) {
		const $element = $(element);
		const $document = $($element[0].ownerDocument);

		this.element = $element[0];

		$element.mousedown(this.elementMouseDown.bind(this));
		$element.mousemove(this.elementMouseMove.bind(this));
		$element.mouseup(this.elementMouseUp.bind(this));

		$document.mousedown(this.bodyMouseDown.bind(this));
		$document.mousemove(this.bodyMouseMove.bind(this));
		$document.mouseup(this.bodyMouseUp.bind(this));
	}

	private element: HTMLElement;

	private state: IMouseState;

	private elementMouseMove(event: MouseEvent) {
		this.state = {
			x: event.offsetX,
			y: event.offsetY,
			button: this.state && this.state.button,
			withinElement: true
		};
	}

	private elementMouseDown(event: MouseEvent) {
		this.state = {
			x: event.offsetX,
			y: event.offsetY,
			button: this.state && this.state.button,
			withinElement: true
		};
	}

	private elementMouseUp(event: MouseEvent) {
		this.state = {
			x: event.offsetX,
			y: event.offsetY,
			button: null,
			withinElement: true
		};
	}

	private elementMouseEnter(event: MouseEvent) {
		this.state = {
			x: event.offsetX,
			y: event.offsetY,
			button: this.state && this.state.button,
			withinElement: true
		}
	}

	private elementMouseLeave(event: MouseEvent) {
		this.state = {
			x: event.offsetX,
			y: event.offsetY,
			button: this.state && this.state.button,
			withinElement: false
		}
	}

	private bodyMouseDown(event: MouseEvent) {
	}

	private bodyMouseMove(event: MouseEvent) {
		if (!this.state || this.state.button == null) {
			return;
		}
		
		const { x, y } = this.bodyToClient(this.element, { x: event.offsetX, y: event.offsetY });

		this.state = {
			x,
			y,
			button: this.state.button,
			withinElement: this.state.withinElement
		};
	}

	private bodyMouseUp(event: MouseEvent) {
		if (!this.state || this.state.button == null) {
			return;
		}
		
		const { x, y } = this.bodyToClient(this.element, { x: event.offsetX, y: event.offsetY });

		this.state = {
			x,
			y,
			button: null,
			withinElement: this.state.withinElement
		};
	}

	private bodyToClient(element: HTMLElement, point: IPoint) {
		let result = {
			x: (point && point.x) || 0,
			y: (point && point.y) || 0
		};

		do {
			if (!isNaN(element.offsetLeft)) {
				result.x += element.offsetLeft + element.clientLeft;
				result.y += element.offsetTop + element.clientTop;
			}
		} while (element = element.offsetParent as HTMLElement);

		return result;
	}
}