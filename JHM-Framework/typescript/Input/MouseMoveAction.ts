let OnMouseMoved:Action = new Action();
function MouseMoved(mouseEvent:MouseEvent) {
    OnMouseMoved.invoke(mouseEvent);
}