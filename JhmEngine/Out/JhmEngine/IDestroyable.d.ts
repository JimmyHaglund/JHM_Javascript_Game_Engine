interface IDestroyable {
    destroy(): void;
    // You can't specify get or set, only that this is accessible somehow
    onDestroy: Action;
}