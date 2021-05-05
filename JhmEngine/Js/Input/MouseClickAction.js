let onMouseDown = new Action();
let onMouseUp = new Action();
function mouseDown(mouseEvent) {
    onMouseDown.invoke(mouseEvent);
}
function mouseUp(mouseEvent) {
    onMouseUp.invoke(mouseEvent);
}
