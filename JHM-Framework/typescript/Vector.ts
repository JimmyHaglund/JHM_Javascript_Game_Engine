let vector = {
    up: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    add: function (a: { x: number, y: number }, b: { x: number, y: number }): { x: number, y: number } {
        return {
            x: a.x + b.x,
            y: a.y + b.y
        };
    }
}