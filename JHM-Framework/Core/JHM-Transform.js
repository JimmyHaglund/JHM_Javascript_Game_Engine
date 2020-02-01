const Transform = function(positionX = 0, positionY = 0, rotation = 0, parent = null) {
    let transform = new Map();
    transform.set("parent", parent);
    transform.set("x", positionX);
    transform.set("y", positionY);
    transform.set("worldX", parent == null ? positionX : parent.get("worldX") + positionX);
    transform.set("worldY", parent == null ? positionY : parent.get("worldY") + positionY);
    transform.set("rotation", rotation);
    return transform;
}