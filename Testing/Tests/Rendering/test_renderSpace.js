function test_renderSpace() {
    renderSpaceTester.added_render_components_should_be_added_to_render_loop();
    renderSpaceTester.added_render_components_should_be_updated_when_loop_updates();
}
const renderSpaceTester = {
    added_render_components_should_be_added_to_render_loop: function () {
        let mockRenderComponent = {
            render: 1,
            onDestroy: {
                add: function () { }
            }
        };
        let mockLoop = {
            onUpdate: {
                add: function (value) { this.value = 1 }
            }
        };
        console.log("Render space")
        let testedRenderSpace = new RenderSpace(mockLoop, 0, 0);
        testedRenderSpace.addRenderComponent(mockRenderComponent);
        testedRenderSpace.wipe();
        describe('Added render component', () => {
            it('should have been added to update loop', () =>
                is.equal(mockLoop.onUpdate.value, 1));
        });
    },
    added_render_components_should_be_updated_when_loop_updates: function () {
        let mockRenderComponent = {
            renderCount: 0,
            render: function(){this.renderCount++;},
            onDestroy: {
                add: function () { }
            }
            
        };
        let mockLoop = {
            onUpdate: {
                value: null,
                caller: null,
                add: function (value, caller) { 
                    this.value = value;
                    this.caller = caller;
                },
                run: function () { this.value.call(this.caller); }
            }
        };
        let window = new RenderSpace(mockLoop, 0, 0);
        window.addRenderComponent(mockRenderComponent, 0);
        mockLoop.onUpdate.run();
        window.wipe();
        describe('added rendering component and running loop', () => {
            it('should call render method on render component', () =>
                is.equal(mockRenderComponent.renderCount, 1));
        });
    }
};