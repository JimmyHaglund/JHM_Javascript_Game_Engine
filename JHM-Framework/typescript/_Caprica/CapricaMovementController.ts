class CapricaMovementController {
    private _character: CapricaMainCharacter;
    private _inputX: number = 0;
    private _inputY: number = 0;
    private _accelleration: number = 5000;
    private _maxSpeed: number = 250;
    private _minimumSpeed = 50;

    private get InputX(): number { return this._inputX; }
    private set InputX(value: number) {
        this._inputX = value;
        if (this._inputX > 1) this._inputX = 1;
        else if (this._inputX < -1) this._inputX = -1;
    }

    private get InputY(): number { return this._inputY; }
    private set InputY(value: number) {
        this._inputY = value;
        if (this._inputY > 1) this._inputY = 1;
        else if (this._inputY < -1) this._inputY = -1;
    }

    constructor(input: CapricaMovementInput, character: CapricaMainCharacter) {
        this.InitialiseInput(input)
        this._character = character;
    }

    public Update(deltaSeconds: number) {
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

    private ClampMaxSpeed(speed:number):number {
        if (speed > this._maxSpeed) {
            speed = this._maxSpeed;
        } else if (speed < -this._maxSpeed) {
            speed = -this._maxSpeed;
        }
        return speed;
    }

    private ClampMinSpeed(speed:number):number{
        if (Math.abs(speed) < this._minimumSpeed) return 0;
        return speed;
    }

    private ApplyDrag(velocityX:number, velocityY:number, deltaSeconds: number): {x:number, y:number} {
        if (this._inputX == 0) {
            velocityX -= this.GetDrag(velocityX, deltaSeconds);
        }
        if (this._inputY == 0) {
            velocityY -= this.GetDrag(velocityY, deltaSeconds);
        }
        return {
            x:velocityX,
            y:velocityY
        };
    }

    private GetDrag(speed: number, deltaSeconds: number): number {
        return speed * deltaSeconds * 5;
    }

    private InitialiseInput(input: CapricaMovementInput): void {
        input.Up.OnPressed.add(AddInputUp, this);
        input.Right.OnPressed.add(AddInputRight, this);
        input.Down.OnPressed.add(AddInputDown, this);
        input.Left.OnPressed.add(AddInputLeft, this);

        input.Up.OnReleased.add(AddInputDown, this);
        input.Right.OnReleased.add(AddInputLeft, this);
        input.Down.OnReleased.add(AddInputUp, this);
        input.Left.OnReleased.add(AddInputRight, this);

        function AddInputUp(): void { this.InputY -= 1; }
        function AddInputDown(): void { this.InputY += 1; }
        function AddInputRight(): void { this.InputX += 1; }
        function AddInputLeft(): void { this.InputX -= 1; }
    }

}