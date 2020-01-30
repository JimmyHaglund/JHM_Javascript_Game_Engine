function component_test(){
    
    console.log(new Component());
    describe('GetEntity', () => {
        it('should return null if not set', () => {
            is.equal(new Component()[iComponent].entity, null);
        });
    });
    describe('GetEntity', () => {
        it('should return a non-null object', () => 
            is.notEqual(new Component({})[iComponent].entity, null))
    });
}