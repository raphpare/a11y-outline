export class A11yOutline {
    static readonly DATA_ATTRIBUTE_NAME: string = 'data-a11y-outline';

    private isMouseDown: boolean = false;
    private eventMousedown: () => void = this.onMousedown.bind(this);
    private eventMouseup: () => void = this.onMouseup.bind(this);
    private eventFocusin: () => void = this.onFocusin.bind(this);

    constructor(private focusElementScope: HTMLElement = document.body) {
        this.start();
    }

    public start(): void {
        this.addEventListeners();
    }

    public stop(): void {
        this.removeEventListeners();
    }

    public updateFocusElementScope(focusElementScope: HTMLElement): void {
        this.focusElementScope = focusElementScope;
    }

    private addEventListeners(): void {
        document.addEventListener('mousedown', this.eventMousedown);
        document.addEventListener('touchstart', this.eventMousedown);
        document.addEventListener('mouseup', this.eventMouseup);
        document.addEventListener('touchend', this.eventMouseup);
        document.addEventListener('focusin', this.eventFocusin);
    }

    private removeEventListeners(): void {
        document.removeEventListener('mousedown', this.eventMousedown);
        document.removeEventListener('touchstart', this.eventMousedown);
        document.removeEventListener('mouseup', this.eventMouseup);
        document.removeEventListener('touchend', this.eventMouseup);
        document.removeEventListener('focusin', this.eventFocusin);
    }

    private onMousedown(): void {
        this.isMouseDown = true;
        this.removeOutline();
    }

    private onMouseup(): void {
        this.isMouseDown = false;
    }

    private onFocusin(): void {
        if (this.isMouseDown) {
            return;
        }
        this.resetDefaultOutline();
    }

    private resetDefaultOutline(): void {
        const refFocusElements = document.querySelectorAll(`[${A11yOutline.DATA_ATTRIBUTE_NAME}]`);
        
        refFocusElements.forEach((e: HTMLElement) => {
            e.removeAttribute(A11yOutline.DATA_ATTRIBUTE_NAME);
            e.style.removeProperty('outline');

            if (e.style.length === 0) e.removeAttribute('style');
        });
    }

    private removeOutline(): void {
        const refFocusElements: HTMLElement = this.focusElementScope.querySelector(':focus');

        if (!refFocusElements) return;

        refFocusElements.setAttribute(A11yOutline.DATA_ATTRIBUTE_NAME, 'none');
        refFocusElements.style.outline = "none";
    }
}