const OverlaySheet = function(renderSpace, physicsSpace, leftCoord = 0, rightCoord = 0){
    let _walls = [];
    let _renderSpace = renderSpace;
    let _physicsSpace = physicsSpace;
    let _entity = new Entity(leftCoord, rightCoord);

    class overlaySheet{
        constructor(){}
        get walls(){return _walls;}
        addWall(leftCoord, topCoord, width, height){
            let newWall = new VisibleBoxColliderEntity(leftCoord,
                topCoord, width, height, _renderSpace, _physicsSpace);
            newWall.entity.transform.parent = _entity.transform;
                _walls.push(newWall);
        }
        move(x, y){
            _entity.transform.x = x;
            _entity.transform.y = y;
        }
        destroy(){
            _entity.destroy();
        }
    }
    return new overlaySheet();
}