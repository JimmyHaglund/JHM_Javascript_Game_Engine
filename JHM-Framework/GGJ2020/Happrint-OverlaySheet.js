const overlayColors = [
    '#354281', // Blue
    '#356d39', // Green
    '#bc5469', // Red
    '#aa8912', // Orange
    '#6d4767' // Purple
]
const OverlaySheet = function(renderSpace, physicsSpace, leftCoord = 0, rightCoord = 0, color = 'black', buttonIndex = 1){
    let _walls = [];
    let _renderSpace = renderSpace;
    let _physicsSpace = physicsSpace;
    let _entity = new Entity(leftCoord, rightCoord);
    let _index = buttonIndex - 1;
    let _button = new UiElement(renderSpace, 10, 20 + (buttonIndex * 80), 
    80, 80, 'button_' + buttonIndex + '_normal', 'button_' + buttonIndex + '_hover', 
    'button_' + buttonIndex + '_press');
    _button.onClick.add(() => happrintInstance.setHeldOverlay(_index));

    class overlaySheet{
        constructor(){ 
            uiManager.uiElements.push(_button);
        }
        get walls(){return _walls;}
        addWall(leftCoord, topCoord, width, height){
            let newWall = new VisibleBoxColliderEntity(leftCoord,
                topCoord, width, height, _renderSpace, _physicsSpace, overlayColors[_index]);
            newWall.entity.transform.parent = _entity.transform;
                _walls.push(newWall);
        }
        move(x, y){
            _entity.transform.x = x;
            _entity.transform.y = y;
        }
        destroy(){
            // _entity[iDestroyable].destroy();
            _walls.forEach(wall => {
                wall.visual.destroy();
                wall.collider.destroy();
            });
            _button.sprite.destroy();
            _button.collider.destroy();
        }
    }
    return new overlaySheet();
}