interface IComponent extends IDestroyable {
    destroy(): void;
    entity: Entity;
    get typeName():string;
}