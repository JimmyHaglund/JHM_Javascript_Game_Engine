class Bullet {
   private _entity: Entity;
   private _rigidbody: IRigidbody;
   private _sprite: RotatedSprite;
   private _collider: ICollider;
   private _onDestroy: Action = new Action();
   private _renderLayer: IRenderLayer;

   public get onDestroy(): Action { return this._onDestroy; }
   public get entity(): Entity { return this._entity; }
   public get rigidbody(): IRigidbody { return this._rigidbody; }

   constructor(xPosition: number, yPosition: number, spriteId: string, colliderDiameter: number, renderLayer: IRenderLayer) {
      const collider = createSatBox(colliderDiameter).collider;
      this._collider = collider;
      this._entity = collider.entity;
      this._rigidbody = new RigidBody(this._entity, this._collider);
      this._rigidbody.dragEnabled = false;
      this._sprite = new RotatedSprite(this._entity, spriteId);
      this._rigidbody.onCollisionEnter.add(this.onHit, this);
      this._renderLayer = renderLayer;
   }

   public enable(): void {
      this._renderLayer.addRenderable(this._sprite);
   }

   public disable(): void {
      this._renderLayer.removeRenderable(this._sprite);
      this._rigidbody.velocity = {x: 0, y: 0};
   }

   private onHit(collisionData, collider): void {
      this.disable();
   }
}