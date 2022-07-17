class RayRenderOffset implements IRenderable {
   private _x1: number;
   private _y1: number;
   private _x2: number;
   private _y2: number;
   private _color: string;
   private _onDestroy: Action = new Action();
   get onDestroy() { return this._onDestroy; }
   constructor(layer: RenderLayer, x0, y0, lean, length = 1, color = 'black', duration = 100) {
       let line = rayToLine(x0, y0, lean, length);
       this._x1 = line.x1;
       this._y1 = line.y1;
       this._x2 = line.x2;
       this._y2 = line.y2;
       this._color = color;
       layer.addRenderable(this);
       this._onDestroy.add(() => layer.removeRenderable(this), this);
       setTimeout(() => this.destroy.call(this), duration);
   }
   destroy() { this._onDestroy.invoke(); }

   render(context: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
       context.strokeStyle = this._color;
       context.beginPath();
       context.moveTo(this._x1 - offsetX, this._y1 - offsetY);
       context.lineTo(this._x2 - offsetX, this._y2 - offsetY);
       context.stroke();
   }

}