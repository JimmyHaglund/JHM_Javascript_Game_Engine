function VisibleBoxColliderEntity(posX, posY, width, height, renderSpace, physicsSpace, color = 'black') {
    this.entity = new Entity(posX, posY);
    this.collider = new BoxColliderComponent(this.entity, width, height);
    this.visual = new BoxColliderRendererComponent(this.collider, 0, color, true);

    this.entity.addComponent(this.collider);
    this.entity.addComponent(this.visual);

    renderSpace.addRenderComponent(this.visual);
    physicsSpace.addCollider(this.collider, "geometry");
}