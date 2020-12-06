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
        input.Up.OnPressed.add(AddInputUp, this);
        input.Right.OnPressed.add(AddInputRight, this);
        input.Down.OnPressed.add(AddInputDown, this);
        input.Left.OnPressed.add(AddInputLeft, this);
        input.Up.OnReleased.add(AddInputDown, this);
        input.Right.OnReleased.add(AddInputLeft, this);
        input.Down.OnReleased.add(AddInputUp, this);
        input.Left.OnReleased.add(AddInputRight, this);
        function AddInputUp() { this.InputY -= 1; }
        function AddInputDown() { this.InputY += 1; }
        function AddInputRight() { this.InputX += 1; }
        function AddInputLeft() { this.InputX -= 1; }
    }
}
