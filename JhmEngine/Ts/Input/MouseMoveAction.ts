let onMouseMoved:Action = new Action();
function mouseMoved(mouseEvent:MouseEvent) {
    onMouseMoved.invoke(mouseEvent);
}