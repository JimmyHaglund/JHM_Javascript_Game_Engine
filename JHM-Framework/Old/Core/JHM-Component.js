const iComponent = Symbol("Component");

function Component(entity = null) {
    let _entity = entity;
    let component = {
        [iComponent]: {
            start: function() {},
            awake: function() {},
            destroy: function() {
                var ID = this;
                var entityIndex = ID.gameEntity.FindComponentIndex(ID);
                if (entityIndex != -1)
                {
                    ID.gameEntity.RemoveComponent(entityIndex);
                    return;
                }
            },
            set entity(value) {
                entity = value;
            },
            get entity() {
                return _entity;
            }
        }
    };
    return component;
}