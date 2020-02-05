function test_entity() {
    entityTest.adding_component_results_in_size_1_array();
    entityTest.destroying_entity_calls_destroy_on_components();
    entityTest.entity_position_is_set_correctly();
    entityTest.calling_remove_component_removes_it_from_the_entity();
}

let entityTest = {
    adding_component_results_in_size_1_array: function () {
        let mockDestroyable = {
            destroyed: false,
            destroy: function () { this.destroyed = true; }
        };
        let entity = new Entity();
        entity.addComponent(mockDestroyable);

        describe("Entity.components.length", () =>
            it("should be 1", () =>
                is.equal(entity.components.length, 1)));
    },
    destroying_entity_calls_destroy_on_components: function () {
        let mockDestroyable = {
            destroyed: false,
            destroy: function () { this.destroyed = true; }
        }
        let entity = new Entity();
        entity.addComponent(mockDestroyable);
        entity.destroy();

        describe("Entity.destroy()", () =>
            it("should call destroy on components", () =>
                is.equal(mockDestroyable.destroyed, true)));
    },
    entity_position_is_set_correctly: function(){
        describe("Entity.transform.x", () =>
            it("should be 100", () =>
                is.equal(new Entity(100).transform.x, 100)));
    },
    calling_remove_component_removes_it_from_the_entity: function(){
        let mockDestroyable = {
            destroyed: false,
            destroy: function () { this.destroyed = true; }
        };
        let entity = new Entity();
        entity.addComponent(mockDestroyable);
        entity.removeComponent(mockDestroyable);
        describe("Entity.components.length", () =>
            it("should be 0", () =>
                is.equal(entity.components.length, 0)));
    }
}