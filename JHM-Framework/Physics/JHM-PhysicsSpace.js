const iPhysicsActor = Symbol("Physics Actor");
// void update(deltaTime);
// Number speed {get, set}
// Number mass {get, set}
// checkCollision(iCollider[] others)
const iCollider = Symbol("Collider");
// overlapsPoint(pointX, pointY)

/** 
 * @description Stores physics actors and colliders.
 * @param {*} originX Left side of space relative to screen
 * @param {*} originY Bottom side of space relative to screen
 * @param {*} width 
 * @param {*} height 
 * @param {*} loop Update loop. Determines frequency of collision checks.
 */
const PhysicsSpace = function (originX, originY, width, height, loop) {
    let _origin = {
        x: originX,
        y: originY
    };
    let _width = width;
    let _height = height;
    let _colliders = new Map();
    let _physicsActors = new Map();
    let _loop = loop;

    class physicsSpace {
        constructor() {
            _loop.update.add(update);
        }
        addCollider(collider, layer) {
            // Add a collider to physics space
            let layerKey = layer.toString();
            if (!(_colliders.has(layerKey))) {
                _colliders.set(layerKey, []);
            }
            _colliders.get(layerKey).push(collider);
            return collider;
        }
        removeCollider(collider, layer) {
            let layerKey = layer.toString();
            if (!_colliders.has(layerKey)) return;
            let colliders = _colliders.get(layerKey);
            let colliderIndex = colliders.indexOf(collider);
            if (colliderIndex < 0) return;
            colliders.shift(colliderIndex, 0);
        }
        getColliders(layer) {
            let layerKey = layer.toString();
            if (!_colliders.has(layerKey)) return null;
            return _colliders.get(layerKey);
        }
        addPhysicsActor(actor, layer) {
            // You can pass either an interface or an object implementing the interface.
            if (actor[iPhysicsActor] != undefined) actor = actor[iPhysicsActor];
            let layerKey = layer.toString();
            if (!_physicsActors.has(layerKey)) {
                _physicsActors.set(layerKey, []);
            }
            let actors = _physicsActors.get(layerKey);
            let index = actors.indexOf(actor);
            if (index < 0) {
                actors.push(actor);
            }
        }
        removePhysicsActor(actor, layer) {
            let layerKey = layer.toString();
            if (!_physicsActors.has(layerKey)) return;
            let actors = _physicsActors.get(layerKey);
            let index = actors.indexOf(actor);
            if (index < 0) return;
            actors.shift(index, 0);
        }
        getPhysicsActors(layer) {
            let layerKey = layer.toString();
            if (!_physicsActors.has(layerKey)) return null;
            return _physicsActors.get(layerKey);
        }

        get bounds() {
            let boundsData = new Map();
            boundsData.set("x0", _origin.x);
            boundsData.set("y0", _origin.y);
            boundsData.set("x1", _origin.x + _width);
            boundsData.set("y1", _origin.y + _height);
            return boundsData;
        }
    }
    let myPhysicsSpace = new physicsSpace();
    return myPhysicsSpace;

    function update(deltaTime) {
        _physicsActors.forEach((physicsactor) => {
            physicsactor.checkCollision(_colliders);
        });
    }
}