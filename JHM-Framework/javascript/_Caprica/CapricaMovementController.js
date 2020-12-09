class CapricaMovementController {
    constructor(input, character) {
        this._inputX = 0;
        this._inputY = 0;
        this._accelleration = 5000;
        this._maxSpeed = 250;
        this._minimumSpeed = 50;
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
        let impulseX = this._accelleration * deltaSeconds * this._inputX;
        let impulseY = this._accelleration * deltaSeconds * this._inputY;
        let lastVelocity = this._character.Rigidbody.Velocity;
        let velocity = {
            x: this.ClampMaxSpeed(lastVelocity.x + impulseX),
            y: this.ClampMaxSpeed(lastVelocity.y + impulseY)
        };
        velocity = this.ApplyDrag(velocity.x, velocity.y, deltaSeconds);
        // velocity.x = this.ClampMinSpeed(velocity.x);
        // velocity.y = this.ClampMaxSpeed(velocity.y);
        this._character.Rigidbody.Velocity = velocity;
    }
    ClampMaxSpeed(speed) {
        if (speed > this._maxSpeed) {
            speed = this._maxSpeed;
        }
        else if (speed < -this._maxSpeed) {
            speed = -this._maxSpeed;
        }
        return speed;
    }
    ClampMinSpeed(speed) {
        if (Math.abs(speed) < this._minimumSpeed)
            return 0;
        return speed;
    }
    ApplyDrag(velocityX, velocityY, deltaSeconds) {
        if (this._inputX == 0) {
            velocityX -= this.GetDrag(velocityX, deltaSeconds);
        }
        if (this._inputY == 0) {
            velocityY -= this.GetDrag(velocityY, deltaSeconds);
        }
        return {
            x: velocityX,
            y: velocityY
        };
    }
    GetDrag(speed, deltaSeconds) {
        return speed * deltaSeconds * 5;
    }
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
