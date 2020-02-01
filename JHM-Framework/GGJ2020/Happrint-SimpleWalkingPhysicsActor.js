const SimpleWalkingPhysicsActor = function (entity, loop, speed = 3) {
    let _entity = entity;
    let _walkSpeed = speed;
    let _lastDeltaTime = 1.0;
    let _falling = false;
    const _maxFallSpeed = 500;
    let _fallSpeed = 0;
    let _grounded = false;
    let _onExit = new Action();

    let _walkingDirection = 1; // Right: 1. Left: -1
    class simpleWalkingPhysicsActor {
        constructor() {
            loop.update.add(update);
        }
        get speed() { return _walkSpeed; }
        set speed(value) { _walkSpeed = value; }
        get layer() { return 0; }
        get onExit() { return _onExit; }
        checkCollision(colliders) {
            let geometryLayer = colliders.get("geometry");
            let exitLayer = colliders.get("exit");

            // Check movement collision
            if (geometryLayer != undefined) {
                let collisionPointX = _entity.transform.worldX + _walkingDirection * _walkSpeed * _lastDeltaTime / 1000;
                let collisionPointY = _entity.transform.worldY;
                let fallPointX = _entity.transform.worldX;
                let fallPointY = _entity.transform.worldY - _maxFallSpeed * _lastDeltaTime / 1000;
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
            }

            // Check exit collision
            if (!exitLayer == undefined) {
                if (exitLayer[0].overlapsPoint(_entity.transform.worldX, _entity.transform.worldY)) {
                    _onExit.invoke();
                }
            }
        }
    }
    return new simpleWalkingPhysicsActor();
    function update(deltaTime) {
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