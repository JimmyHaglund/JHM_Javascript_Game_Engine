class Binding {
    public MainBindingCode: string = "";
    public AlternateBindingCode: string = "";
    public OnPressed = new Action();
    public OnReleased = new Action();

    private _isDown: boolean = false;

    constructor(main: string = "", alternate: string = "") {
        this.MainBindingCode = main;
        this.AlternateBindingCode = alternate;
    }

    public CheckPressed(event: KeyboardEvent) {
        if (this._isDown) return;
        let keyCode = event.code;
        switch (keyCode) {
            case this.MainBindingCode:
            case this.AlternateBindingCode:
                this._isDown = true;
                this.NotifyPressed();
                break;
            default:
                break;
        }
    }

    public CheckReleased(event: KeyboardEvent): void {
        if (!this._isDown) return;
        switch (event.code) {
            case this.MainBindingCode:
            case this.AlternateBindingCode:
                this._isDown = false;
                this.NotifyReleased();
                break;
            default:
                break;
        }
    }

    private NotifyPressed(): void {
        this.OnPressed.invoke();
    }

    private NotifyReleased(): void {
        this.OnReleased.invoke();
    }
}