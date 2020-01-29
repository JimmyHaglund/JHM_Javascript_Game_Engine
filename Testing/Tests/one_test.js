function one_test(){
  describe('get', function() {
    it('should return 2', function() {
      is.equal(new One().get(), 2);
    });
  });
}