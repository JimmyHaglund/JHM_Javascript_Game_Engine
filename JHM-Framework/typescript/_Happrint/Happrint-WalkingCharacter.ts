class WalkingCharacter implements IPhysicsActor, IDestroyable {
    private _entity: Entity;
    private _walkSpeed: number;

    private _shouldMove: boolean = false;
    private _deltaTime: number = 1.0;
    private _falling: boolean = false;
    private readonly _maxFallSpeed: number = 250;
    private _fallSpeed: number = 0;
    private _grounded: boolean = false;
    private readonly _onExit: Action = new Action();
    private readonly _onGroundedChanged: Action = new Action();
    private _walkingDirection: number = 1;
    private readonly _direction = {
        left: -1,
        right: 1
    };
    private _rigidBody: PointRigidBody;
    private _sprite: Sprite;
    private _onCollisionEnter: Action = new Action();

    get shouldMove(): boolean { return this._shouldMove; }
    set shouldMove(value: boolean) { this._shouldMove = value; }
    get walkSpeed(): number { return this._walkSpeed; }
    set walkSpeed(value: number) { this._walkSpeed = value; }
    // get layer() { return 0; }
    set shouldMoveLeft(value: boolean) {
        this._walkingDirection = value ? this._direction.left : this._direction.right;
    }
    get isMovingLeft(): boolean { return this._walkingDirection < 0; }
    get falling(): boolean { return !this._grounded; }
    get onGroundedChanged(): Action { return this._onGroundedChanged; }
    get onExit(): Action { return this._onExit; }

    get onCollisionEnter(): Action { return this._onCollisionEnter; }
    get onCollisionStay(): Action { return null; }
    get onCollisionExit(): Action { return null; }
    get onDestroy(): Action { return null; }

    constructor(entity: Entity, loop: ILoop, walkingSpeed: number = 3, renderSpace: RenderSpace, physicsSpace: PhysicsSpace) {
        this._entity = entity;
        this._shouldMove = false;
        this._walkSpeed = walkingSpeed;
        // this._rigidBody = new PointRigidBody(entity, loop);
        this._sprite = new Sprite(entity, "character_idle");
        this._sprite.width = 30;
        this._sprite.height = 45;
        this._sprite.offsetX = -15// -this._sprite.width * 0.5;
        this._sprite.offsetY = -45// -this._sprite.height;
        this._grounded = false;

        // this._rigidBody.onCollisionEnter.add(this.checkCollision, this);
        // loop.onUpdate.add(this.update, this);

        renderSpace.addRenderComponent(this._sprite, -100);
        physicsSpace.addPhysicsActor(this);
    }
    destroy(): void { }

    move(deltaTime: number): void {
        if (!this.shouldMove) return;
        this._deltaTime = deltaTime;
        if (this._grounded) {
            this._entity.transform.x += this._walkSpeed
                * this._walkingDirection * deltaTime / 1000;
        } else {
            let fallSpeed = 5000 * deltaTime;
            this._entity.transform.y += fallSpeed * deltaTime / 1000;
        }
        // Gravitational force
    }

    checkCollision(colliders: ICollider[]): void {
        if (!this.shouldMove) return;
        let x0 = this._entity.transform.x;
        let y0 = this._entity.transform.y;
        this.move(this._deltaTime);
        let x1 = this._entity.transform.x;
        let y1 = this._entity.transform.y;
        let dX = x1 - x0;
        let dY = y1 - y0;
        let lean = dY / dX;
        if (dX == 0) lean = Math.sign(dY) * 10000;
        let moveDistanceSquared = (dX * dX + dY * dY);
        let grounded = false;
        let collidedWithWall = false;
        colliders.forEach(collider => {
            // Interpolate collision checking by raycasting
            let verticalCollisionData = collider.getCollisionPointWithRay(x0, y0, 0, 10);
            let horizontalCollisionData = collider.getCollisionPointWithRay(x0, y0, (x1 - x0), 0);
            // Floor collision found
            if (verticalCollisionData != null) {
                grounded = true;
                let deltaColY = y1 - verticalCollisionData.y;
                this._entity.transform.y += Math.ceil(verticalCollisionData.normalY
                    + verticalCollisionData.normalY * Math.abs(deltaColY));
            }
            // Wall collision found
            if (horizontalCollisionData != null) {
                let deltaColX = x1 - horizontalCollisionData.x;
                // Move entity back to 1 pixel next to colliding point
                this._entity.transform.x += Math.ceil(horizontalCollisionData.normalX
                    + horizontalCollisionData.normalX * Math.abs(deltaColX));
                this._onCollisionEnter.invoke.call(this._onCollisionEnter,
                    horizontalCollisionData, collider);
                collidedWithWall = true;
                // Switch movement direction if collided with wall & grounded
            }
            if (this._grounded != grounded){
                this._grounded = grounded;
                this.onGroundedChanged.invoke.call(this._onGroundedChanged, grounded);
            }
            if (grounded) {
                if (collidedWithWall) {
                    this.shouldMoveLeft = !this.isMovingLeft;
                }
            }
        });
    }
}