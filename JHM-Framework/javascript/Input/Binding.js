class Binding {
    constructor(main = "", alternate = "") {
        this.MainBindingCode = "";
        this.AlternateBindingCode = "";
        this.OnPressed = new Action();
        this.OnReleased = new Action();
        this._isDown = false;
        this.MainBindingCode = main;
        this.AlternateBindingCode = alternate;
    }
    CheckPressed(event) {
        if (this._isDown)
            return;
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
    CheckReleased(event) {
        if (!this._isDown)
            return;
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
    NotifyPressed() {
        this.OnPressed.invoke();
    }
    NotifyReleased() {
        this.OnReleased.invoke();
    }
}
