class RayRenderOffset implements IRenderable {
   private _x1: number;
   private _y1: number;
   private _x2: number;
   private _y2: number;
   private _color: string;
   private _onDestroy: Action = new Action();
   get onDestroy() { return this._onDestroy; }
   constructor(layer: RenderLayer, x0, y0, x1, y1, color = 'black', duration = 100) {
       this._x1 = x0;
       this._y1 = y0;
       this._x2 = x1;
       this._y2 = y1;
       this._color = color;
       layer.addRenderable(this);
       this._onDestroy.add(() => layer.removeRenderable(this), this);
       if (duration <= 0) return;
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