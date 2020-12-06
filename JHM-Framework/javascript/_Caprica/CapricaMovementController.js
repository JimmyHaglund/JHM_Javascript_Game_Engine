class CapricaMovementController {
    constructor(input, character) {
        this._inputX = 0;
        this._inputY = 0;
        this._accelleration = 5000;
        this._maxSpeed = 250;
        this.InitialiseInput(input);
        this._character = character;
    }
    get InputX() { return this._inputX; }
    set InputX(value) {
        this._inputX = value;
        if (this._inputX > 1)
            this._inputX = 1;
        else if (this._inputX < -1)
            this._inputX = -1;
    }
    get InputY() { return this._inputY; }
    set InputY(value) {
        this._inputY = value;
        if (this._inputY > 1)
            this._inputY = 1;
        else if (this._inputY < -1)
            this._inputY = -1;
    }
    Update(deltaSeconds) {
        let deltaX = this._accelleration * deltaSeconds * this._inputX;
        let deltaY = this._accelleration * deltaSeconds * this._inputY;
        let velocity = this._character.Rigidbody.Velocity;
        console.log(this._inputY);
        if (velocity.x > this._maxSpeed) {
            velocity.x = this._maxSpeed;
        }
        else if (velocity.x < -this._maxSpeed) {
            velocity.x = -this._maxSpeed;
        }
        if (velocity.y > this._maxSpeed) {
            velocity.y = this._maxSpeed;
        }
        else if (velocity.y < -this._maxSpeed) {
            velocity.y = -this._maxSpeed;
        }
        this._character.Rigidbody.Velocity = {
            x: deltaX + velocity.x,
            y: deltaY + velocity.y
        };
    }
    // TODO: Automatically decelerate when no input is given. Here or in rigidbody.
    InitialiseInput(input) {
        input.up.onPressed.add(AddInputUp, this);
        input.right.onPressed.add(AddInputRight, this);
        input.down.onPressed.add(AddInputDown, this);
        input.left.onPressed.add(AddInputLeft, this);
        input.up.onReleased.add(AddInputDown, this);
        input.right.onReleased.add(AddInputLeft, this);
        input.down.onReleased.add(AddInputUp, this);
        input.left.onReleased.add(AddInputRight, this);
        function AddInputUp() { this.InputY -= 1; }
        function AddInputDown() { this.InputY += 1; }
        function AddInputRight() { this.InputX += 1; }
        function AddInputLeft() { this.InputX -= 1; }
    }
}
