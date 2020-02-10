class WalkingCharacter {
    constructor(entity, walkingSpeed = 3, renderSpace, physicsSpace) {
        this._shouldMove = false;
        this._deltaTime = 1.0;
        this._maxFallSpeed = 250;
        this._fallSpeed = 5;
        this._grounded = false;
        this._onExit = new Action();
        this._onGroundedChanged = new Action();
        this._walkingDirection = 1;
        this._direction = {
            left: -1,
            right: 1
        };
        this._onCollisionEnter = new Action();
        this._onDestroy = new Action();
        this._entity = entity;
        this._shouldMove = false;
        this._walkSpeed = walkingSpeed;
        this._sprite = new Sprite(entity, "character_idle");
        this._sprite.width = 30;
        this._sprite.height = 45;
        this._sprite.offsetX = -15; // -this._sprite.width * 0.5;
        this._sprite.offsetY = -45; // -this._sprite.height;
        this._entity.addComponent(this._sprite);
        renderSpace.addRenderComponent(this._sprite, -100);
        physicsSpace.addPhysicsActor(this);
        this._onDestroy.add(() => renderSpace.removeRenderComponent(this._sprite, -100), this);
        this._onDestroy.add(() => physicsSpace.removePhysicsActor(this), this);
    }
    get shouldMove() { return this._shouldMove; }
    set shouldMove(value) { this._shouldMove = value; }
    get walkSpeed() { return this._walkSpeed; }
    set walkSpeed(value) { this._walkSpeed = value; }
    set shouldMoveLeft(value) {
        this._walkingDirection = value ? this._direction.left : this._direction.right;
    }
    get isMovingLeft() { return this._walkingDirection < 0; }
    get falling() { return !this._grounded; }
    get onGroundedChanged() { return this._onGroundedChanged; }
    get onExit() { return this._onExit; }
    get entity() { return this._entity; }
    get onCollisionEnter() { return this._onCollisionEnter; }
    get onCollisionStay() { return null; }
    get onCollisionExit() { return null; }
    get onDestroy() { return this._onDestroy; }
    destroy() {
        this._entity.destroy();
        this._onDestroy.invoke.call(this._onDestroy);
    }
    move(deltaTime) {
        if (!this.shouldMove)
            return;
        this._deltaTime = deltaTime;
        if (this._grounded) {
            this._entity.transform.x += this._walkSpeed
                * this._walkingDirection * deltaTime / 1000;
        }
        else {
            this._entity.transform.y += this._fallSpeed * deltaTime;
        }
    }
    checkCollision(colliders) {
        if (!this.shouldMove)
            return;
        let x0 = this._entity.transform.x;
        let y0 = this._entity.transform.y;
        this.move(this._deltaTime);
        let fallDistance = this._fallSpeed * this._deltaTime;
        let x1 = this._entity.transform.x;
        let y1 = y0 + fallDistance;
        let dX = x1 - x0;
        let grounded = false;
        let collidedWithWall = false;
        let tallestFloorY = 10000000;
        colliders.forEach(collider => {
            let corner = collider.getNearestCorner(x0, y0);
            let verticalCollisionData = null;
            let horizontalCollisionData = null;
            // Interpolate collision checking by raycasting
            if (insideRange(corner.y, y0, y1)) {
                horizontalCollisionData = collider.getCollisionPointWithRay(x0, y0, 0, 1);
            }
            if (this._grounded && insideRange(corner.x, x0, x1)) {
                verticalCollisionData = collider.getCollisionPointWithRay(x0, y0, dX, 0);
            }
            // Floor collision found
            if (horizontalCollisionData != null) {
                let moveTo = horizontalCollisionData.y - 1;
                if (moveTo < tallestFloorY) {
                    tallestFloorY = moveTo;
                }
                grounded = true;
            }
            // Wall collision found
            if (verticalCollisionData != null) {
                this._entity.transform.x = verticalCollisionData.x - Math.sign(dX);
                collidedWithWall = true;
            }
        });
        if (this._grounded) {
            if (collidedWithWall) {
                this.shouldMoveLeft = !this.isMovingLeft;
            }
        }
        if (this._grounded != grounded) {
            this._grounded = grounded;
            this.onGroundedChanged.invoke.call(this._onGroundedChanged, grounded);
        }
        if (grounded) {
            this._entity.transform.y = tallestFloorY;
        }
    }
}
