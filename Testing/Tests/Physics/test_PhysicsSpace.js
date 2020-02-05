function test_physicsSpace() {
    physicsSpaceTest.get_colliders_for_nonexisting_layer_should_return_null();
    physicsSpaceTest.get_colliders_for_an_existing_layer_with_one_collider_should_return_one_collider()
    physicsSpaceTest.removing_all_colliders_from_a_layer_should_result_in_an_empty_layer();
    physicsSpaceTest.attempting_to_remove_nonexistent_collider_should_do_nothing();
    physicsSpaceTest.trying_to_get_actors_from_an_empty_layer_should_return_null();
    physicsSpaceTest.trying_to_get_actors_from_existing_layer_should_return_the_actors();
    physicsSpaceTest.trying_to_get_actors_from_empty_existing_layer_should_return_an_empty_array();
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
    get_colliders_for_nonexisting_layer_should_return_null() {
        let space = new PhysicsSpace(this.mockLoop);
        space.addCollider({}, 1);
        describe('getColliders(0)', () => {
            it('should return null if no colliders are created', () =>
                is.equal(space.getColliders(0), null));
        });
    },
    get_colliders_for_an_existing_layer_with_one_collider_should_return_one_collider() {
        let space = new PhysicsSpace(this.mockLoop);
        space.addCollider({}, 0);
        describe('getColliders(0)', () => {
            it('should return a collider array if the layer exists', () =>
                is.equal(space.getColliders(0).length, 1));
        });
    },
    removing_all_colliders_from_a_layer_should_result_in_an_empty_layer() {
        let space = new PhysicsSpace(this.mockLoop);
        space.addCollider({}, 0);
        let collider = space.getColliders(0)[0];
        space.removeCollider(collider, 0);
        describe('getColliders(0)', () => {
            it('should return a collider array if the layer exists', () =>
                is.equal(space.getColliders(0).length, 0));
        });
    },
    attempting_to_remove_nonexistent_collider_should_do_nothing() {
        describe('removeCollider({})', () => {
            it('should fail quietly and return undefined.', () =>
                is.equal(new PhysicsSpace(this.mockLoop).removeCollider({}, 0), undefined));
        });
    },
    trying_to_get_actors_from_an_empty_layer_should_return_null() {
        let space = new PhysicsSpace(this.mockLoop);
        space.addPhysicsActor({}, 1);
        describe('getPhysicsActor(0)', () => {
            it('should return null', () =>
                is.equal(space.getPhysicsActors(0), null));
        });
    },
    trying_to_get_actors_from_existing_layer_should_return_the_actors() {
        let space = new PhysicsSpace(this.mockLoop);
        space.addPhysicsActor({}, 0);
        console.log(space._actors.slice(0));
        describe('getPhysicsActor(0)', () => {
            it('should return an array with size 1', () =>
                is.equal(space.getPhysicsActors().length, 1));
        });
    },
    trying_to_get_actors_from_empty_existing_layer_should_return_an_empty_array() {
        let space = new PhysicsSpace(this.mockLoop);
        let actor = {};
        space.addPhysicsActor(actor, 0);
        space.addPhysicsActor(actor, 1);
        space.removePhysicsActor(actor, 0);
        describe('getPhysicsActor(0)', () => {
            it('should return an empty array', () =>
                is.equal(space.getPhysicsActors(0).length, 0));
        });
    }
}