class Binding {
    public mainBindingCode: string = "";
    public alternateBindingCode: string = "";

    public onPressed = new Action();
    public onReleased = new Action();

    private isDown: boolean = false;

    constructor(main: string = "", alternate: string = "") {
        this.mainBindingCode = main;
        this.alternateBindingCode = alternate;
    }

    public checkPressed(event: KeyboardEvent) {
        if (this.isDown) return;
        let keyCode = event.code;
        switch (keyCode) {
            case this.mainBindingCode:
            case this.alternateBindingCode:
                this.isDown = true;
                this.notifyPressed();
                break;
            default:
                break;
        }
    }

    public checkReleased(event: KeyboardEvent): void {
        if (!this.isDown) return;
        switch (event.code) {
            case this.mainBindingCode:
            case this.alternateBindingCode:
                this.isDown = false;
                this.notifyReleased();
                break;
            default:
                break;
        }
    }

    private notifyPressed(): void {
        this.onPressed.invoke();
    }

    private notifyReleased(): void {
        this.onReleased.invoke();
    }
}