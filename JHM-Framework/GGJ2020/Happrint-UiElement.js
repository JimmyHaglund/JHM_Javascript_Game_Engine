const UiElement = function (renderSpace, left, top, width, height,
    normalSprite = "", hoverSprite = "", pressSprite = "") {
    this.sprites = {
        normal: normalSprite,
        hover: hoverSprite,
        press: pressSprite
    };
    this.entity = new Entity(left, top);
    this.sprite = new SpriteComponent(renderSpace, this.entity, normalSprite, 'ui');
    this.collider = new BoxColliderComponent(this.entity, width, height);
    this.state = "passive"; // pressed, hovered, passive
    this.onClick = new Action();
    
    this.sprite.size.width = width;
    this.sprite.size.height = height;
    this.sprite.setOffset(this.sprite.size.width * 0.5, -this.sprite.size.height * 0.5);
    this.sprite.layer = ""
    this.entity.addComponent(this.sprite);
    this.entity.addComponent(this.collider);
    renderSpace.addRenderComponent(this.sprite);


    this.press = function () {
        if (this.state == "pressed") return;
        this.state = "pressed";
        this.updateSprite();
    }
    this.release = function (mouseX = -2000, mouseY = -2000) {
        if (this.state != "pressed") return;
        if (this.collider.overlapsPoint(mouseX, mouseY)) {
            this.onClick.invoke();
            this.hover();
            return;
        }
        this.state = "passive";
        this.updateSprite();
    }
    this.hover = function () {
        this.state = "hovered";
        this.updateSprite();
    }
    this.stopHover = function () {
        this.state = "passive";
        this.updateSprite();
    }
    this.updateSprite = function () {
        switch (this.state) {
            case "pressed":
                this.sprite.spriteId = this.sprites.press;
                break;
            case "hovered":
                this.sprite.spriteId = this.sprites.hover;
                break;
            default:
                this.sprite.spriteId = this.sprites.normal;
                break;
        }
    }
}