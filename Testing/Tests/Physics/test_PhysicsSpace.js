function test_physicsSpace() {
    physicsSpaceTest.get_colliders_for_nonexisting_layer_should_return_empty_array();
    physicsSpaceTest.get_colliders_for_an_existing_layer_with_one_collider_should_return_one_collider()
    physicsSpaceTest.removing_all_colliders_should_result_in_empty_array();
    physicsSpaceTest.attempting_to_add_same_collider_twice_should_fail();
    physicsSpaceTest.trying_to_remove_non_existent_collider_should_fail();
    physicsSpaceTest.added_actors_should_be_in_actors_array();
    physicsSpaceTest.removing_added_actor_should_succeed();
}

const physicsSpaceTest = {
    mockLoop: {
        ticksPerSecond: 0,

        pause: function(){},
        play: function(){},
        playing: false,
        onUpdate: {
            add: function(){},
            remove: function(){}
        }
    },
    mockCollider: {
        onDestroy: {
            add: function(){},
            remove: function(){}
        },
        destroy: function(){},
        overlapsPoint: function(){return false;}
    },
    get_colliders_for_nonexisting_layer_should_return_empty_array() {
        let space = new PhysicsSpace(this.mockLoop);
        describe('PhysicsSpace.getColliders().length', () => {
            it('should return empty array if no colliders are added', () =>
                is.equal(space.getColliders().length, 0));
        });
    },
    get_colliders_for_an_existing_layer_with_one_collider_should_return_one_collider() {
        let space = new PhysicsSpace(this.mockLoop);
        space.addCollider(this.mockCollider);
        describe('PhysicsSpace.getColliders().length', () => {
            it('should return 1', () =>
                is.equal(space.getColliders().length, 1));
        });
    },
    removing_all_colliders_should_result_in_empty_array() {
        let space = new PhysicsSpace(this.mockLoop);
        space.addCollider(this.mockCollider);
        space.removeCollider(this.mockCollider);
        describe('PhysicsSpace.getColliders().length', () => {
            it('should return 0', () =>
                is.equal(space.getColliders().length, 0));
        });
    },
    attempting_to_add_same_collider_twice_should_fail() {
        let space = new PhysicsSpace(this.mockLoop);
        space.addCollider(this.mockCollider);
        space.addCollider(this.mockCollider);
        describe('PhysicsSpace.getColliders().length', () => {
            it('should return 1.', () =>
                is.equal(space.getColliders().length, 1));
        });
    },
    trying_to_remove_non_existent_collider_should_fail(){
        let space = new PhysicsSpace(this.mockLoop);
        space.addCollider(this.mockCollider);
        space.removeCollider({});
        describe('PhysicsSpace.getColliders().length', () => {
            it('should return 1.', () =>
                is.equal(space.getColliders().length, 1));
        });
    },
    added_actors_should_be_in_actors_array() {
        let space = new PhysicsSpace(this.mockLoop);
        space.addPhysicsActor({});
        describe('PhysicsSpace.getPhysicsActors()', () => {
            it('should return an array with size 1', () =>
                is.equal(space.getPhysicsActors().length, 1));
        });
    },
    removing_added_actor_should_succeed() {
        let space = new PhysicsSpace(this.mockLoop);
        let actorA = {};
        let actorB = {}
        space.addPhysicsActor(actorA);
        space.addPhysicsActor(actorB);
        space.removePhysicsActor(actorA);
        describe('PhysicsSpace.getPhysicsActors()', () => {
            it('should return an array with length 1', () =>
                is.equal(space.getPhysicsActors().length, 1));
        });
    }
}