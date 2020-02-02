const SimpleWalkingPhysicsActor = function (entity, loop, speed = 3) {
    let _entity = entity;
    let _walkSpeed = speed;
    let _lastDeltaTime = 1.0;
    let _falling = false;
    const _maxFallSpeed = 250;
    let _fallSpeed = 0;
    let _grounded = false;
    let _onExit = new Action();
    let _onGroundedChanged = new Action();
    let _walkingDirection = 1; // Right: 1. Left: -1

    class simpleWalkingPhysicsActor {
        constructor() {
            loop.update.add(update);
            this.shouldMove = false;
        }
        get speed() { return _walkSpeed; }
        set speed(value) { _walkSpeed = value; }
        get layer() { return 0; }
        get onExit() { return _onExit; }
        set moveToLeft(value) { _walkingDirection = value ? -1 : 1; }
        get movingLeft() { return _walkingDirection < 0; }
        get falling() { return !_grounded; }
        get onGroundedChanged() { return _onGroundedChanged; }
        checkCollision(colliders) {
            let geometryLayer = colliders.get("geometry");
            let exitLayer = colliders.get("exit");

            // Check movement collision
            if (geometryLayer != undefined) {
                let collisionPointX = _entity.transform.worldX + _walkingDirection * _walkSpeed * _lastDeltaTime / 1000;
                let collisionPointY = _entity.transform.worldY;
                let fallPointX = _entity.transform.worldX;
                let fallPointY = _entity.transform.worldY + _maxFallSpeed * _lastDeltaTime / 1000;
                let oldGrounded = _grounded;
                _grounded = false;
                // Check if falling
                for (let n = 0; n < geometryLayer.length; n++) {
                    if (geometryLayer[n].overlapsPoint(fallPointX, fallPointY)) {
                        _grounded = true;
                        _fallSpeed = 0;
                        break;
                    }
                }
                // Check wall collision if grounded
                if (_grounded) {
                    for (let n = 0; n < geometryLayer.length; n++) {
                        if (geometryLayer[n].overlapsPoint(collisionPointX, collisionPointY)) {
                            _walkingDirection *= -1;
                            break;
                        }
                    };
                }
                if (_grounded != oldGrounded) {
                    _onGroundedChanged.invoke();
                }
            }

            // Check exit collision
            if (!exitLayer == undefined) {
                if (exitLayer[0].overlapsPoint(_entity.transform.worldX, _entity.transform.worldY)) {
                    _onExit.invoke();
                }
            }
        }
    }
    let _simpleWalkingPhysicsActor = new simpleWalkingPhysicsActor();
    return _simpleWalkingPhysicsActor;
    function update(deltaTime) {
        if (!_simpleWalkingPhysicsActor.shouldMove) return;
        _lastDeltaTime = deltaTime;
        if (_grounded) {
            _entity.transform.x += _walkSpeed * _walkingDirection * deltaTime / 1000;
        } else {
            _fallSpeed += 1000 * deltaTime / 1000;
            if (_fallSpeed > _maxFallSpeed) _fallSpeed = _maxFallSpeed;
            _entity.transform.y += _fallSpeed * deltaTime / 1000;
        }
    }
}