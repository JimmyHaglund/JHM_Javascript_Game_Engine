class MainCharacterBuilder extends EntityBuilder {
    build(xPosition, yPosition) {
        return new CapricaMainCharacter(xPosition, yPosition, this._loop, this._layer, this._physics);
    }
}
