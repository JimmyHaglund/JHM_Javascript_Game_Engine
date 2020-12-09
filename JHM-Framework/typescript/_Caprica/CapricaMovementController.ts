class CapricaMovementController {
    private _character: CapricaMainCharacter;
    private _inputX: number = 0;
    private _inputY: number = 0;
    private _accelleration: number = 5000;
    private _maxSpeed: number = 250;
    private _minimumSpeed = 50;

    private get inputX(): number { return this._inputX; }
    private set inputX(value: number) {
        this._inputX = value;
        if (this._inputX > 1) this._inputX = 1;
        else if (this._inputX < -1) this._inputX = -1;
    }

    private get inputY(): number { return this._inputY; }
    private set inputY(value: number) {
        this._inputY = value;
        if (this._inputY > 1) this._inputY = 1;
        else if (this._inputY < -1) this._inputY = -1;
    }

    constructor(input: CapricaMovementInput, character: CapricaMainCharacter) {
        this.initialiseInput(input)
        this._character = character;
    }

    public update(deltaSeconds: number) {
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

    private clampMaxSpeed(speed:number):number {
        if (speed > this._maxSpeed) {
            speed = this._maxSpeed;
        } else if (speed < -this._maxSpeed) {
            speed = -this._maxSpeed;
        }
        return speed;
    }

    private clampMinSpeed(speed:number):number{
        if (Math.abs(speed) < this._minimumSpeed) return 0;
        return speed;
    }

    private applyDrag(velocityX:number, velocityY:number, deltaSeconds: number): {x:number, y:number} {
        if (this._inputX == 0) {
            velocityX -= this.getDrag(velocityX, deltaSeconds);
        }
        if (this._inputY == 0) {
            velocityY -= this.getDrag(velocityY, deltaSeconds);
        }
        return {
            x:velocityX,
            y:velocityY
        };
    }

    private getDrag(speed: number, deltaSeconds: number): number {
        return speed * deltaSeconds * 5;
    }

    private initialiseInput(input: CapricaMovementInput): void {
        input.Up.onPressed.add(addInputUp, this);
        input.Right.onPressed.add(addInputRight, this);
        input.Down.onPressed.add(addInputDown, this);
        input.Left.onPressed.add(addInputLeft, this);

        input.Up.onReleased.add(addInputDown, this);
        input.Right.onReleased.add(addInputLeft, this);
        input.Down.onReleased.add(addInputUp, this);
        input.Left.onReleased.add(addInputRight, this);

        function addInputUp(): void { this.InputY -= 1; }
        function addInputDown(): void { this.InputY += 1; }
        function addInputRight(): void { this.InputX += 1; }
        function addInputLeft(): void { this.InputX -= 1; }
    }
}