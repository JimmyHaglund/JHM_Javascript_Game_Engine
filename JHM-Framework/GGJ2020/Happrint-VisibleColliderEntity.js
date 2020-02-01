function VisibleBoxColliderEntity(posX, posY, width, height, renderSpace, physicsSpace) {
    this.entity = new Entity(posX, posY);
    this.collider = new BoxColliderComponent(this.entity, width, height);
    this.visual = new BoxColliderRendererComponent(this.collider, 0, 'black', true);

    this.entity.addComponent(this.collider);
    this.entity.addComponent(this.visual);

    renderSpace.addRenderComponent(this.visual);
    physicsSpace.addCollider(this.collider, "geometry");
}