class SatColliderRenderer implements IRenderable {
   private _onDestroy: Action = new Action();
   private _collider: SatCollider;
   private _color: string;

   get onDestroy(): Action { return this._onDestroy; }

   constructor(collider: SatCollider, color: string = 'black') {
      this._collider = collider;
      this._color = color;
   }
   render(context: CanvasRenderingContext2D, viewX: number, viewY: number): void {
      let points = this._collider.vertices;
      if (points == null || points.length == 0) return;
      let point = this.getVertexViewPosition(points[0], viewX, viewY);
      
      context.fillStyle = this._color;
      context.strokeStyle = this._color;
      context.beginPath();
      context.moveTo(point.x, point.y);
      for (let p = 1; p < points.length; p++) {
         point = this.getVertexViewPosition(points[p], viewX, viewY);
         context.lineTo(point.x, point.y);
      }
      context.closePath();
      context.stroke();

      context.strokeStyle = "red";
      for(let n = 0; n < this._collider.normals.length; n++) {
         let nextN = (n == this._collider.vertices.length -1) ? 0 : n +1;
         let pointA = this.getVertexViewPosition(points[n], viewX, viewY);
         let pointB = this.getVertexViewPosition(points[nextN], viewX, viewY);
         let directionX = 0.5 * (pointB.x - pointA.x);
         let directionY = 0.5 * (pointB.y - pointA.y);
         let start = {x: pointA.x + directionX, y: pointA.y + directionY};
         let normal = this._collider.normals[n];
         let end = {x: start.x + normal.x * 10, y: start.y + normal.y * 10};
         context.beginPath();
         context.moveTo(start.x, start.y);
         context.lineTo(end.x, end.y);
         context.stroke();
      }



      // render(context: CanvasRenderingContext2D, viewX:number, viewY:number): void {
      //    context.beginPath();
      //    let contextColor = context.fillStyle;
      //    let left = this._collider.left - viewX;
      //    let right = this._collider.right - viewX;
      //    let top = this._collider.top - viewY;
      //    let bottom = this._collider.bottom - viewY;
   }
   destroy(): void {
      this._onDestroy.invoke();
   }

   private getVertexWorldPosition(point: {x: number, y: number}): {x: number, y: number} {
      let x = point.x + this._collider.entity.worldX;
      let y = point.y + this._collider.entity.worldY;
      return {x: x, y: y};
   }

   private getVertexViewPosition(point: {x: number, y: number}, viewX: number, viewY: number): {x: number, y: number} {
      let worldPoint = this.getVertexWorldPosition(point);
      let x = worldPoint.x - viewX;
      let y = worldPoint.y - viewY;
      return {x: x, y: y};
   }
}