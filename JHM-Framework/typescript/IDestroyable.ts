interface IDestroyable {
    Destroy(): void;
    // You can't specify get or set, only that this is accessible somehow
    onDestroy: Action;
}