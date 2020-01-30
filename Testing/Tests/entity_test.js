function entity_test(){
    return describe('GetType', () =>{
        it('should return "Entity"', () => 
            is.equal(new Entity().GetType(), 'Entity'));
    });
}