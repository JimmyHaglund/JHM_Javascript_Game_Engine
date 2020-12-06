class CapricaMovementController {
    private _character: CapricaMainCharacter;
    private _inputX: number = 0;
    private _inputY: number = 0;
    private _accelleration: number = 5000;
    private _maxSpeed:number = 250;

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
        let deltaX = this._accelleration * deltaSeconds * this._inputX;
        let deltaY = this._accelleration * deltaSeconds * this._inputY;
        let velocity = this._character.Rigidbody.Velocity;

        if (velocity.x > this._maxSpeed) {
            velocity.x = this._maxSpeed;
        } else if (velocity.x < -this._maxSpeed) {
            velocity.x = -this._maxSpeed;
        }
        if (velocity.y > this._maxSpeed) {
            velocity.y = this._maxSpeed;
        } else if (velocity.y < -this._maxSpeed) {
            velocity.y = -this._maxSpeed;
        }
        this._character.Rigidbody.Velocity = { 
            x: deltaX + velocity.x, 
            y: deltaY + velocity.y 
        };
    }
    // TODO: Automatically decelerate when no input is given. Here or in rigidbody.

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