function component_test(){
    return describe('GetEntity', () => {
        it('should return null if not set', () => 
            is.equal(new Component().GetEntity(), null))
    })
}