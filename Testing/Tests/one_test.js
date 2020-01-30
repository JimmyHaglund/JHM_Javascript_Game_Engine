function one_test(){
  return describe('get', function() {
    it('should return 1', function() {
      is.equal(new One().get(), 1);
    });
  });
}