const Transform = function(positionX = 0, positionY = 0, originX = 0, originY = 0, rotation = 0) {
    let transform = new Map();
    transform.set("originX", originX);
    transform.set("originY", originY);
    transform.set("positionX", positionX);
    transform.set("positionY", positionY);
    transform.set("rotation", rotation);
    return transform;
}