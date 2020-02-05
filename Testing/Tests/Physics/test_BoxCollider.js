function test_boxColliderComponent(){
    boxColliderComponentTester.box_top_should_equal_entity_position_plus_height();
    boxColliderComponentTester.box_offset_should_move_top_position();
    boxColliderComponentTester.box_offset_should_move_top_position();
    boxColliderComponentTester.should_overlap_point_within_bounds();
    boxColliderComponentTester.should_not_overlap_point_outside_bounds();
}

let boxColliderComponentTester = {
    mockEntity: {
        destroy: function(){},
        onDestroy: [],
        transform : {x: 0, y: 0},
        components: [],
        addComponent: function(){},
        removeComponent: function(){}
    },
    box_top_should_equal_entity_position_plus_height: function(){
        let box = new BoxCollider(this.mockEntity, 80, 138);
        describe('BoxCollider.bottom', () => {
            it('should be 138 when initialised with 138 height', () =>
                is.equal(box.bottom, 138));
        });
    },
    box_offset_should_move_top_position: function(){
        let box = new BoxCollider(this.mockEntity, 80, 80, -80, -80);
        describe('BoxCollider.bottom', () => {
            it('should be 0 when initialised with 80 height and -80 offset', () =>
                is.equal(box.bottom, 0));
        });
    },
    should_overlap_point_within_bounds: function(){
        let box = new BoxCollider(this.mockEntity, 160, 160, -80, -80);
        describe('BoxCollider.overlapsPoint()', () => {
            it('should return true', () =>
                is.equal(box.overlapsPoint(0, 0), true));
        }); 
    },
    should_not_overlap_point_outside_bounds: function(){
        let box = new BoxCollider(this.mockEntity, 80, 80, 0, 0);
        describe('BoxCollider.overlapsPoint', () => {
            it('should be false', () =>
                is.equal(box.overlapsPoint(81, 70), false));
        }); 
    }
}