class CapricaMovementController {
    constructor(input, character) {
        this._inputX = 0;
        this._inputY = 0;
        this._accelleration = 5000;
        this._maxSpeed = 250;
        this._minimumSpeed = 50;
        this._dragProfile = new PercentageDrag(5);
        this.initialiseInput(input);
        this._character = character;
    }
    get inputX() { return this._inputX; }
    set inputX(value) {
        this._inputX = value;
        if (this._inputX > 1)
            this._inputX = 1;
        else if (this._inputX < -1)
            this._inputX = -1;
    }
    get inputY() { return this._inputY; }
    set inputY(value) {
        this._inputY = value;
        if (this._inputY > 1)
            this._inputY = 1;
        else if (this._inputY < -1)
            this._inputY = -1;
    }
    update(deltaSeconds) {
        let impulseX = this._accelleration * deltaSeconds * this._inputX;
        let impulseY = this._accelleration * deltaSeconds * this._inputY;
        let lastVelocity = this._character.rigidbody.velocity;
        let velocity = {
            x: this.clampMaxSpeed(lastVelocity.x + impulseX),
            y: this.clampMaxSpeed(lastVelocity.y + impulseY)
        };
        velocity = this.applyDrag(velocity.x, velocity.y, deltaSeconds);
        // velocity.x = this.ClampMinSpeed(velocity.x);
        // velocity.y = this.ClampMaxSpeed(velocity.y);
        this._character.rigidbody.velocity = velocity;
    }
    clampMaxSpeed(speed) {
        if (speed > this._maxSpeed) {
            speed = this._maxSpeed;
        }
        else if (speed < -this._maxSpeed) {
            speed = -this._maxSpeed;
        }
        return speed;
    }
    clampMinSpeed(speed) {
        if (Math.abs(speed) < this._minimumSpeed)
            return 0;
        return speed;
    }
    applyDrag(velocityX, velocityY, deltaSeconds) {
        let drag = this._dragProfile.getDrag(velocityX, velocityY);
        if (this._inputX == 0) {
            velocityX -= drag.dragX * deltaSeconds;
        }
        if (this._inputY == 0) {
            velocityY -= drag.dragY * deltaSeconds;
        }
        return {
            x: velocityX,
            y: velocityY
        };
    }
    initialiseInput(input) {
        input.Up.onPressed.add(addInputUp, this);
        input.Right.onPressed.add(addInputRight, this);
        input.Down.onPressed.add(addInputDown, this);
        input.Left.onPressed.add(addInputLeft, this);
        input.Up.onReleased.add(addInputDown, this);
        input.Right.onReleased.add(addInputLeft, this);
        input.Down.onReleased.add(addInputUp, this);
        input.Left.onReleased.add(addInputRight, this);
        function addInputUp() { this.inputY -= 1; }
        function addInputDown() { this.inputY += 1; }
        function addInputRight() { this.inputX += 1; }
        function addInputLeft() { this.inputX -= 1; }
    }
}
