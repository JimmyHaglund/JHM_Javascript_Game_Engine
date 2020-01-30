function test_windowManager(){
    // windowManagerTester.createWindow();
    // windowManagerTester.getWindow();
}


const windowManagerTester = {
    createWindow: function() {
        let mockWindow = {};
        return describe('windowManager.createWindow(0, 0, 100, 100)', () => {
            it('should return a type of object', () =>{
                is.sameType(windowManager.createWindow(0, 0, 100, 100), mockWindow);
            })
        });
    },
    getWindow: function(){
        describe('windowManager.getWindow(50, 50)', () => {
            it('should return non-null object', () => {
                is.notEqual(windowManager.getWindow(50, 50), null);
            })
        });
        describe('windowManager.getWindow(45, 101)', () => {
            it('should return null', () => {
                is.equal(windowManager.getWindow(45, 101), null);
            })
        });
    },
    render: function(){

    },
    checkPoint: function(){

    },
    endLoop: function(){

    }
}

function entity_test(){
    return describe('GetType', () =>{
        it('should return "Entity"', () => 
            is.equal(new Entity().GetType(), 'Entity'));
    });
}