function test_entity() {
    entityTest.adding_component_results_in_size_1_array();
    entityTest.destroying_entity_marks_components_for_destruction();
    entityTest.entity_should_contain_iDestroyable_symbol();
}

let TestComponent = function() {
    let _iDestoyable = {
        destroy: function () { this.isDestroyed = true },
        isDestroyed: false
    }
    class testComponent {
        get [iDestroyable]() {
            return _iDestoyable;
        }
    }
    return new testComponent();
}

let entityTest = {
    adding_component_results_in_size_1_array: function() {
        let entity = new Entity();
        entity.addComponent(new TestComponent());
        
        describe("entity.components", () =>
            it("should have length 1", () =>
                is.equal(entity.components.length, 1)));
    },
    destroying_entity_marks_components_for_destruction: function() {
        let component = new TestComponent();
        let entity = new Entity();
        entity.addComponent(component);
        entity[iDestroyable].destroy();
        
        describe("entity component destroyed", () =>
            it("should be true", () =>
                is.equal(component[iDestroyable].isDestroyed, true)));
    },
    entity_should_contain_iDestroyable_symbol: function() {
        let entity = new Entity();
        describe("iDestoyable symbol in entity", () =>
            it("should be true", () =>
                is.notEqual(entity[iDestroyable], undefined)));
    }
}