/// <reference path="./typings/index.d.ts" />

import * as $ from 'jquery';
const createEventEmitter = require('event-emitter');

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

declare class EventEmitter {
	on(eventName: string, listener: Function);
	off(eventName: string, listener: Function);
	emit(eventName: string, ...args: any[]);
}

export type MouseEventName = 'mousemove' | 'mousedown' | 'mouseup' | 'mouseenter' | 'mouseleave';

export type MouseListener = (event: IMouseState) => any; 

export class MouseHooker {
	constructor(element: HTMLElement | JQuery) {
		const $element = $(element);
		const $document = $($element[0].ownerDocument.body);

		this.element = $element[0];

		this.eventEmitter = createEventEmitter();

		$element.mousedown(this.elementMouseDown.bind(this));
		$element.mousemove(this.elementMouseMove.bind(this));
		$element.mouseup(this.elementMouseUp.bind(this));
		$element.mouseenter(this.elementMouseEnter.bind(this));
		$element.mouseleave(this.elementMouseLeave.bind(this));

		$document.mousedown(this.bodyMouseDown.bind(this));
		$document.mousemove(this.bodyMouseMove.bind(this));
		$document.mouseup(this.bodyMouseUp.bind(this));
	}

	private element: HTMLElement;

	private state: IMouseState;

	private eventEmitter: EventEmitter;

	private elementMouseMove(event: MouseEvent) {
		this.updateState({
			x: event.offsetX,
			y: event.offsetY,
			button: this.state && this.state.button,
			withinElement: true
		},
		'mousemove');
	}

	private elementMouseDown(event: MouseEvent) {
		this.updateState({
			x: event.offsetX,
			y: event.offsetY,
			button: event.button,
			withinElement: true
		},
		'mousedown');
	}

	private elementMouseUp(event: MouseEvent) {
		if (this.state.button == null) {
			return;
		}

		this.updateState({
			x: event.offsetX,
			y: event.offsetY,
			button: event.button,
			withinElement: true
		},
		'mouseup');
	}

	private elementMouseEnter(event: MouseEvent) {
		this.updateState({
			x: event.offsetX,
			y: event.offsetY,
			button: this.state && this.state.button,
			withinElement: true
		});
	}

	private elementMouseLeave(event: MouseEvent) {
		this.updateState({
			x: event.offsetX,
			y: event.offsetY,
			button: this.state && this.state.button,
			withinElement: false
		});
	}

	private bodyMouseDown(event: MouseEvent) {
	}

	private bodyMouseMove(event: MouseEvent) {
		if (!this.state || this.state.button == null) {
			return;
		}
		
		const { x, y } = this.bodyToClient(this.element, { x: event.offsetX, y: event.offsetY });

		this.updateState({
			x,
			y,
			button: this.state && this.state.button,
			withinElement: (this.state || false) && this.state.withinElement
		},
		this.state.withinElement ? undefined : 'mousemove');
	}

	private bodyMouseUp(event: MouseEvent) {
		if (!this.state || this.state.button == null) {
			return;
		}
		
		const { x, y } = this.bodyToClient(this.element, { x: event.offsetX, y: event.offsetY });

		const withinElement =
			x >= 0 &&
			x < this.element.clientWidth &&
			y >= 0 &&
			y < this.element.clientHeight;

		if (!withinElement) {
			this.updateState({
				x,
				y,
				button: event.button,
				withinElement
			},
			'mouseup');
		}
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

	private updateState(state: IMouseState, eventName?: string) {
		this.state = state;

		if (eventName) {
			this.eventEmitter.emit(eventName, state);
		}

		if (eventName == 'mouseup') {
			this.state = {
				x: state.x,
				y: state.y,
				button: null,
				withinElement: state.withinElement
			};
		}
	}

	private emit(eventName: MouseEventName, ...args: any[]) {
		this.eventEmitter.emit(eventName, ...args);
	}

	on(eventName: MouseEventName, listener: MouseListener) {
		this.eventEmitter.on(eventName, listener);
	}

	off(eventName: MouseEventName, listener: MouseListener) {
		this.eventEmitter.off(eventName, listener);
	}
}