const SimpleWalkingPhysicsActor = function (entity, loop, speed = 3) {
    let _entity = entity;
    let _walkSpeed = speed;
    let lastDeltaTime = 1.0;
    // let _maxFallSpeed = 10;
    // let _fallSpeed = 0;

    let _walkingDirection = 1; // Right: 1. Left: -1
    class simpleWalkingPhysicsActor {
        constructor() {
            loop.update.add(update)
        }
        get speed() { return _walkSpeed; }
        set speed(value) { _walkSpeed = value; }
        checkCollision(colliders) {
            let collisionPointX = _entity.transform.worldX + _walkingDirection * _walkSpeed * lastDeltaTime / 1000;
            let collisionPointY = _entity.transform.worldY;
            // let collisionUnder = false;
            colliders.forEach(layer => {
                for (let n = 0; n < layer.length; n++) {
                    if (layer[n].overlapsPoint(collisionPointX, collisionPointY)) {
                        _walkingDirection *= -1;
                        console.log("!!");
                        break;
                    }
                }
            });
        }
    }
    return new simpleWalkingPhysicsActor();
    function update(deltaTime) {
        _lastDeltaTime = deltaTime;
        _entity.transform.x += _walkSpeed * _walkingDirection * deltaTime / 1000;
    }
}