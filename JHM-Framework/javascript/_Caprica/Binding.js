class Binding {
    constructor(main = "", alternate = "") {
        this.mainBindingCode = "";
        this.alternateBindingCode = "";
        this.onPressed = [];
        this.onReleased = [];
        this.isDown = false;
        this.mainBindingCode = main;
        this.alternateBindingCode = alternate;
    }
    checkPressed(event) {
        if (this.isDown)
            return;
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
    checkReleased(event) {
        if (!this.isDown)
            return;
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
    notifyPressed() {
        this.onPressed.forEach(response => {
            response();
        });
    }
    notifyReleased() {
        this.onReleased.forEach(response => {
            response();
        });
    }
}
