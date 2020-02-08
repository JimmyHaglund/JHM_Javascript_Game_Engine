class WalkingCharacter {
    constructor(entity, loop, walkingSpeed = 3, renderSpace, physicsSpace) {
        this._shouldMove = false;
        this._deltaTime = 1.0;
        this._falling = false;
        this._maxFallSpeed = 250;
        this._fallSpeed = 0;
        this._grounded = false;
        this._onExit = new Action();
        this._onGroundedChanged = new Action();
        this._walkingDirection = 1;
        this._direction = {
            left: -1,
            right: 1
        };
        this._onCollisionEnter = new Action();
        this._entity = entity;
        this._shouldMove = false;
        this._walkSpeed = walkingSpeed;
        // this._rigidBody = new PointRigidBody(entity, loop);
        this._sprite = new Sprite(entity, "character_idle");
        this._sprite.width = 30;
        this._sprite.height = 45;
        this._sprite.offsetX = -15; // -this._sprite.width * 0.5;
        this._sprite.offsetY = -45; // -this._sprite.height;
        this._grounded = false;
        // this._rigidBody.onCollisionEnter.add(this.checkCollision, this);
        // loop.onUpdate.add(this.update, this);
        renderSpace.addRenderComponent(this._sprite, -100);
        physicsSpace.addPhysicsActor(this);
    }
    get shouldMove() { return this._shouldMove; }
    set shouldMove(value) { this._shouldMove = value; }
    get walkSpeed() { return this._walkSpeed; }
    set walkSpeed(value) { this._walkSpeed = value; }
    // get layer() { return 0; }
    set shouldMoveLeft(value) {
        this._walkingDirection = value ? this._direction.left : this._direction.right;
    }
    get isMovingLeft() { return this._walkingDirection < 0; }
    get falling() { return !this._grounded; }
    get onGroundedChanged() { return this._onGroundedChanged; }
    get onExit() { return this._onExit; }
    get onCollisionEnter() { return this._onCollisionEnter; }
    get onCollisionStay() { return null; }
    get onCollisionExit() { return null; }
    get onDestroy() { return null; }
    destroy() { }
    move(deltaTime) {
        if (!this.shouldMove)
            return;
        this._deltaTime = deltaTime;
        if (this._grounded) {
            this._falling = false;
            this._entity.transform.x += this._walkSpeed
                * this._walkingDirection * deltaTime / 1000;
        }
        else {
            let fallSpeed = 5000 * deltaTime;
            this._entity.transform.y += fallSpeed * deltaTime / 1000;
        }
        // Gravitational force
    }
    checkCollision(colliders) {
        if (!this.shouldMove)
            return;
        let x0 = this._entity.transform.x;
        let y0 = this._entity.transform.y;
        this.move(this._deltaTime);
        let x1 = this._entity.transform.x;
        let y1 = this._entity.transform.y;
        let dX = x1 - x0;
        let dY = y1 - y0;
        let lean = dY / dX;
        if (dX == 0)
            lean = Math.sign(dY) * 10000;
        let moveDistanceSquared = (dX * dX + dY * dY);
        this._grounded = false;
        colliders.forEach(collider => {
            // Interpolate collision checking by raycasting
            let collisionData = collider.getCollisionPointWithRay(x0, y0, lean);
            let collidedWithWall = false;
            if (collisionData != null
                && squareDistance(x0, y0, collisionData.x, collisionData.y) < moveDistanceSquared) {
                let deltaColX = x1 - collisionData.x;
                let deltaColY = y1 - collisionData.y;
                // Move entity back to 1 pixel next to colliding point
                this._entity.transform.x += Math.ceil(collisionData.normalX + collisionData.normalX * Math.abs(deltaColX));
                this._entity.transform.y += Math.ceil(collisionData.normalY + collisionData.normalY * Math.abs(deltaColY));
                this._onCollisionEnter.invoke.call(this._onCollisionEnter, collisionData, collider);
                // Wall & floor collision
                if (Math.abs(collisionData.normalX) > 2 * Math.abs(collisionData.normalY)) {
                    collidedWithWall = true;
                }
                else {
                    this._grounded = true;
                }
                // Switch movement direction if collided with wall & grounded
                if (collidedWithWall && this._grounded) {
                    this.shouldMoveLeft = !this.isMovingLeft;
                    console.log(collisionData.normalX, collisionData.normalY);
                    console.log(deltaColX, deltaColY);
                }
            }
        });
    }
}
