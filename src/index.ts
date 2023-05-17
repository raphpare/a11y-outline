export class A11yOutline {
    static readonly DATA_ATTRIBUTE_NAME: string = 'data-a11y-outline';

    #isMouseDown: boolean = false;
    #isEnabled: boolean = false;
    #focusElementScope: HTMLElement;
    #eventMousedown: () => void = this.#onMousedown.bind(this);
    #eventMouseup: () => void = this.#onMouseup.bind(this);
    #eventFocusin: () => void = this.#onFocusin.bind(this);

    constructor(focusElementScope: HTMLElement = document.documentElement) {
        this.#focusElementScope = focusElementScope;
        this.start();
    }

    start(): void {
        if (this.#isEnabled) return;
        this.#isEnabled = true;
        this.#addEventListeners();
    }

    stop(): void {
        if (!this.#isEnabled) return;
        this.#isEnabled = false;
        this.#removeEventListeners();
        this.#resetOutline();
    }

    updateFocusElementScope(focusElementScope: HTMLElement): void {
        if (this.#isEnabled) {
            this.#removeEventListeners()
            this.#resetOutline();
        };
        this.#focusElementScope = focusElementScope;
        if (this.#isEnabled) this.#addEventListeners();
    }

    #addEventListeners(): void {
        this.#focusElementScope.addEventListener('mousedown', this.#eventMousedown);
        this.#focusElementScope.addEventListener('touchstart', this.#eventMousedown);
        this.#focusElementScope.addEventListener('mouseup', this.#eventMouseup);
        this.#focusElementScope.addEventListener('touchend', this.#eventMouseup);
        this.#focusElementScope.addEventListener('focusin', this.#eventFocusin);
    }

    #removeEventListeners(): void {
        this.#focusElementScope.removeEventListener('mousedown', this.#eventMousedown);
        this.#focusElementScope.removeEventListener('touchstart', this.#eventMousedown);
        this.#focusElementScope.removeEventListener('mouseup', this.#eventMouseup);
        this.#focusElementScope.removeEventListener('touchend', this.#eventMouseup);
        this.#focusElementScope.removeEventListener('focusin', this.#eventFocusin);
    }

    #onMousedown(event: MouseEvent): void {
        this.#isMouseDown = true;
    }

    #onMouseup(): void {
        this.#isMouseDown = false;
        const refFocusElement: HTMLElement = this.#getFocusElement();
        if (refFocusElement && refFocusElement.hasAttribute(A11yOutline.DATA_ATTRIBUTE_NAME)) return;
        this.#removeOutline();
    }

    #onFocusin(): void {
        if (this.#isMouseDown) {
            this.#removeOutline();
            return;
        }
        this.#resetOutline();
    }

    #resetOutline(): void {
        const refFocusElements = this.#focusElementScope.querySelectorAll(`[${A11yOutline.DATA_ATTRIBUTE_NAME}]`);
        
        refFocusElements.forEach((e: HTMLElement) => {
            e.removeAttribute(A11yOutline.DATA_ATTRIBUTE_NAME);
            e.style.removeProperty('outline');

            if (e.style.length === 0) e.removeAttribute('style');
        });
    }

    #removeOutline(): void {
        this.#resetOutline();
        const refFocusElement: HTMLElement = this.#getFocusElement();
 
        if (!refFocusElement) return;

        refFocusElement.setAttribute(A11yOutline.DATA_ATTRIBUTE_NAME, 'none');
        refFocusElement.style.outline = "none";
    }

    #getFocusElement(): HTMLElement | null {
        return this.#focusElementScope.querySelector(':focus');
    }
}