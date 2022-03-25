export class A11yOutline {
    static readonly DATA_ATTRIBUTE_NAME: string = 'data-a11y-outline';

    private isMouseDown: boolean = false;
    private isEnabled: boolean = false;
    private eventMousedown: () => void = this.onMousedown.bind(this);
    private eventMouseup: () => void = this.onMouseup.bind(this);
    private eventFocusin: () => void = this.onFocusin.bind(this);

    constructor(private focusElementScope: HTMLElement = document.documentElement) {
        this.start();
    }

    public start(): void {
        if (this.isEnabled) return;
        this.isEnabled = true;
        this.addEventListeners();
    }

    public stop(): void {
        if (!this.isEnabled) return;
        this.isEnabled = false;
        this.removeEventListeners();
        this.resetOutline();
    }

    public updateFocusElementScope(focusElementScope: HTMLElement): void {
        if (this.isEnabled) {
            this.removeEventListeners()
            this.resetOutline();
        };
        this.focusElementScope = focusElementScope;
        if (this.isEnabled) this.addEventListeners();
    }

    private addEventListeners(): void {
        this.focusElementScope.addEventListener('mousedown', this.eventMousedown);
        this.focusElementScope.addEventListener('touchstart', this.eventMousedown);
        this.focusElementScope.addEventListener('mouseup', this.eventMouseup);
        this.focusElementScope.addEventListener('touchend', this.eventMouseup);
        this.focusElementScope.addEventListener('focusin', this.eventFocusin);
    }

    private removeEventListeners(): void {
        this.focusElementScope.removeEventListener('mousedown', this.eventMousedown);
        this.focusElementScope.removeEventListener('touchstart', this.eventMousedown);
        this.focusElementScope.removeEventListener('mouseup', this.eventMouseup);
        this.focusElementScope.removeEventListener('touchend', this.eventMouseup);
        this.focusElementScope.removeEventListener('focusin', this.eventFocusin);
    }

    private onMousedown(event: MouseEvent): void {
        this.isMouseDown = true;
    }

    private onMouseup(): void {
        this.isMouseDown = false;
        const refFocusElement: HTMLElement = this.getFocusElement();
        if (refFocusElement && refFocusElement.hasAttribute(A11yOutline.DATA_ATTRIBUTE_NAME)) return;
        this.removeOutline();
    }

    private onFocusin(): void {
        if (this.isMouseDown) {
            this.removeOutline();
            return;
        }
        this.resetOutline();
    }

    private resetOutline(): void {
        const refFocusElements = this.focusElementScope.querySelectorAll(`[${A11yOutline.DATA_ATTRIBUTE_NAME}]`);
        
        refFocusElements.forEach((e: HTMLElement) => {
            e.removeAttribute(A11yOutline.DATA_ATTRIBUTE_NAME);
            e.style.removeProperty('outline');

            if (e.style.length === 0) e.removeAttribute('style');
        });
    }

    private removeOutline(): void {
        this.resetOutline();
        const refFocusElement: HTMLElement = this.getFocusElement();
 
        if (!refFocusElement) return;

        refFocusElement.setAttribute(A11yOutline.DATA_ATTRIBUTE_NAME, 'none');
        refFocusElement.style.outline = "none";
        
    }

    private getFocusElement(): HTMLElement | null {
        return this.focusElementScope.querySelector(':focus');
    }
}