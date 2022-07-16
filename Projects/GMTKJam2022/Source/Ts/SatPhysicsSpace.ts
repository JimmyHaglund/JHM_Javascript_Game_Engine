class SatPhysicsSpace {
   private _colliders: SatCollider[] = [];
   public get colliders(): SatCollider[] { return this._colliders };

   // TODO: Max distance should be determined by the bounding radius of the colliders.
   public getCollision(actor: SatCollider, maxDistance: number): { x: number, y: number } {
      let result: { x: number, y: number } = null;
      for (let n = 0; n < this._colliders.length; n++) {
         let collider = this._colliders[n];
         if (collider === actor) continue;
         let sqrDistance = algebra.squareDistance(
            collider.entity.worldX, collider.entity.worldY,
            actor.entity.worldX, actor.entity.worldY);
         if (sqrDistance > maxDistance * maxDistance) continue;
         let collisionInfo = actor.GetCollisionPoint(collider);
         if (collisionInfo != null) return collisionInfo;
      }
      return result;
   }

   public addCollider(collider: SatCollider): void {
      let index = this.colliders.indexOf(collider);
      if (index < 0) {
         this.colliders.push(collider);
      }
   }

   public removeCollider(collider: SatCollider): void {
      let index = this._colliders.indexOf(collider);
      if (index < 0) return;
      this.colliders.splice(index, 1);
   }
}