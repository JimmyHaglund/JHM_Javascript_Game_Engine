function rayToLine(x0: number, y0: number,
    lean: number, length: number): { x1: number, y1: number, x2: number, y2: number } {
    // Using Pythagoras theorem and substitution to get x position 
    let x1 = x0 + Math.sqrt(length * length / (lean * lean + 1));
    let y1 = y0 + (x1 - x0) * lean;
    return { x1: x0, y1: y0, x2: x1, y2: y1 };
}
function lineToRay(x1: number, y1: number, x2: number, y2: number): { x0: number, y0: number, lean: number, length: number } {
    let dx = (x2 - x1);
    let dy = (y2 - y1);
    return{
        x0: x1,
        y0: y1,
        lean: dy / dx,
        length: Math.sqrt(dx * dx + dy * dy)
    }
}

class RayRender implements IRenderable, IDestroyable {
    private _x1: number;
    private _y1: number;
    private _x2: number;
    private _y2: number;
    private _color: string;
    private _onDestroy: Action = new Action();
    get onDestroy() { return this._onDestroy; }
    constructor(renderSpace: RenderSpace, x0, y0, lean, length = 1, color = 'black', duration = 100) {
        let line = rayToLine(x0, y0, lean, length);
        this._x1 = line.x1;
        this._y1 = line.y1;
        this._x2 = line.x2;
        this._y2 = line.y2;
        this._color = color;
        renderSpace.addRenderComponent(this, -10000);
        this._onDestroy.add(() => renderSpace.removeRenderComponent(this, -10000), this);
        setTimeout(() => this.destroy.call(this), duration);
    }
    destroy() { this._onDestroy.invoke(); }

    render(context: CanvasRenderingContext2D) {
        context.strokeStyle = this._color;
        context.moveTo(this._x1, this._y1);
        context.lineTo(this._x2, this._y2);
        context.stroke();
    }

}