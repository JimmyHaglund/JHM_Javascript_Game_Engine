// TODO: Isolate test using mock objects
function test_spriteComponent() {
    // spriteComponentTest.base_sprite_alpha_should_be_one();
}
function SpriteComponentTestMockups() {
    this.loop = new Loop(5);
    this.window = new RenderSpace(0, 0, 150, 150, this.loop);
    this.entity = new Entity();
    this.sprite = new SpriteComponent(this.window, this.entity, 'face');
}
// let spriteComponentMockups = new SpriteComponentTestMockups();
let spriteComponentTest = {
    base_sprite_alpha_should_be_one: function () {
        let m = spriteComponentMockups;
        m.window.canvas.style.border = 1 + 'px solid black';
        m.window.canvas.style.position = 'absolute';
        let goLeft = false;
        spriteComponentMockups.loop.update.add(() => {
            if (goLeft) {
                if (m.entity.transform.x <= 0) {
                    goLeft = false
                }
            } else {
                if (m.entity.transform.x > m.window.canvas.width) {
                    goLeft = true;
                }
            }
            m.entity.transform.x += goLeft ? -10 : 10;
            m.window.setPosition(m.window.bounds.left + 1, m.window.bounds.bottom);
        });
        spriteComponentMockups.entity.addComponent(spriteComponentMockups.sprite);
        spriteComponentMockups.window.addRenderComponent(spriteComponentMockups.sprite);
        describe('spriteComponent.alpha', () => {
            it('should be 1 for base sprite', () =>
                is.equal(spriteComponentMockups.sprite.alpha, 1));
        });
    }
}