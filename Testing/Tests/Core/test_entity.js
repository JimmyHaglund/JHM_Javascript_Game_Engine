function test_entity() {
    entityTest.adding_component_results_in_size_1_array();
    entityTest.destroying_entity_marks_components_for_destruction();
}

class MockDestroyable {
    destroyed = false;
    destroy(){
        this.destroyed = true;
    }
}

let entityTest = {
    adding_component_results_in_size_1_array: function() {
        let entity = new Entity();
        entity.addComponent(new MockDestroyable());
        
        describe("entity.components", () =>
            it("should have length 1", () =>
                is.equal(entity.components.length, 1)));
    },
    destroying_entity_marks_components_for_destruction: function() {
        let component = new MockDestroyable();
        let entity = new Entity();
        entity.addComponent(component);
        entity.destroy();
        
        describe("entity component destroyed", () =>
            it("should be true", () =>
                is.equal(component.destroyed, true)));
    }
}