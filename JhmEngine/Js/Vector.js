let vector = {
    up: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    add: function (a, b) {
        return {
            x: a.x + b.x,
            y: a.y + b.y
        };
    }
};
