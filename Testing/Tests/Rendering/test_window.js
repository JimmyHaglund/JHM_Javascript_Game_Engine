function test_window(){
    // windowTester.construct();
    // windowTester.removeRenderComponent();
    // windowTester.addRenderComponent();
}

const windowTester = {
    mockRenderComponent: {
        
        [iRenderComponent]: {
            getLayer: function(){
                return 0;
            },
            render: function(){}
        }
    },
    construct: function() {
        describe('new Window(), (0, 0, 100, 100)', () => {
        it('should create a new window of type "object"', () => 
            is.sameType(new Window(0, 0, 100, 100), {}));
        });
        describe('new Window(), (0, 0, 100, 100)', () => {
            it('should create a new window & not null', () => 
                is.notEqual(new Window(0, 0, 100, 100), null));
        });
    },
    removeRenderComponent: function() {
        describe('removeRenderComponent()', () => {
            it('should do nothing if no render component is added', () => 
                is.notEqual(new Window(0, 0, 100, 100).removeRenderComponent(this.mockRenderComponent), null));
        });
    },
    addRenderComponent: function() {
        describe('addRenderComponent(component)', () => {
        it('adds new render component to correct layer.', () => 
            is.sameType(new Window(0, 0, 100, 100).addRenderComponent(mockRenderComponent)));
        });
    },
    
    addEntity: function(){

    },

};