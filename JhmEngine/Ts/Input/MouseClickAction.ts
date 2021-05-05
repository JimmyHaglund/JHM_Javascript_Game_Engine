let onMouseDown:Action = new Action();
let onMouseUp:Action = new Action();
function mouseDown(mouseEvent:MouseEvent) {
    onMouseDown.invoke(mouseEvent);
}
function mouseUp(mouseEvent:MouseEvent) {
    onMouseUp.invoke(mouseEvent);
}