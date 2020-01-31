function test_window() {
    windowTester.added_render_components_should_be_updated_by_calling_render();
    windowTester.removed_render_components_should_no_longer_be_updated();
    windowTester.wiped_window_should_no_longer_render();
}
function MockLoop(){
    
    let updateables = [];

    class mockLoop {
        constructor() {
            let me = this;
            this.ticksPerSecond = 0;
            this.playing = true;
            this.update = {
                add: function (value) { updateables.push(value) },
                remove: function () { updateables.shift(0, 0)}
            }
        }
        pause() { }
        play() {
            updateables.forEach(element => element(1));
        }
    };
    return new mockLoop();
}
class mockRenderComponent {
    constructor() {
        this.renderCount = 0;
        this.layer = 0;
        this.render = function (renderContext) { this.renderCount++; }
    }
}
let realLoop = new Loop(15);
const windowTester = {
    added_render_components_should_be_updated_by_calling_render: function () {
        let loop = new MockLoop();
        let testWindow = new Window(0, 0, 150, 150, loop);
        let renderComponent = new mockRenderComponent();
        testWindow.addRenderComponent(renderComponent);
        loop.play();
        testWindow.wipe();
        describe('Render components in window', () => {
            it('should be updated with each update call', () =>
                is.greaterThan(renderComponent.renderCount, 0));
        });
    },
    removed_render_components_should_no_longer_be_updated: function () {
        let loop = new MockLoop();
        let renderComponent = new mockRenderComponent();
        let window = new Window(0, 0, 0, 0, loop);
        window.addRenderComponent(renderComponent);
        loop.play();
        window.removeRenderComponent(renderComponent);
        loop.play();
        window.wipe();
        describe('removeRenderComponent(component)', () => {
            it('should remove the render component and stop it from being updated.', () =>
                is.equal(renderComponent.renderCount, 1));
        });
    },
    wiped_window_should_no_longer_render: function () {
        let loop = new MockLoop();
        let renderComponent = new mockRenderComponent();
        let window = new Window(0, 0, 0, 0, loop);
        window.addRenderComponent(renderComponent);
        loop.play();
        window.wipe();
        loop.play();
        describe('window.wipe()', () => {
            it('render component should not be updated by loop', () =>
                is.equal(renderComponent.renderCount, 1));
        });
    }
};