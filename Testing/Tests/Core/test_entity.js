function test_entity() {
    entityTest.adding_component_results_in_size_1_array();
    entityTest.destroying_entity_marks_components_for_destruction();
    entityTest.making_entity_with_x_origin_60_should_result_in_x_origin_60_for_transform();
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
        entity.destroy();
        
        describe("component destroyed", () =>
            it("should be true", () =>
                is.equal(component[iDestroyable].isDestroyed, true)));
    },
    making_entity_with_x_origin_60_should_result_in_x_origin_60_for_transform: function() {
        let entity = new Entity(0, 0, 60, 0);
        describe("origin", () =>
            it("should be 60", () =>
                is.equal(entity.transform.get("originX"), 60)));
    },
    entity_should_contain_iDestroyable_symbol: function() {
        let entity = new Entity();
        describe("iDestoyable symbol in entity", () =>
            it("should be true", () =>
                is.equal(entity[iDestroyable] === iDestroyable, true)));
    }
}