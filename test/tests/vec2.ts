namespace la.vec2.tests {
    QUnit.module("vec2");

    function toArray(f32arr: Float32Array): number[] {
        return Array.prototype.slice.call(f32arr, 0);
    }

    function close(num1: number, num2: number): boolean {
        return Math.abs(num1 - num2) < EPSILON;
    }

    QUnit.test("create", () => {
        var vec = vec2.create(1, 2);
        ok(vec instanceof Float32Array);
        deepEqual(toArray(vec), [1, 2]);
    });

    QUnit.test("init", () => {
        var vec = vec2.create(0, 0);
        var exist = vec2.init(2, 3, vec);
        deepEqual(toArray(exist), [2, 3]);
    });

    QUnit.test("reverse", () => {
        var v = vec2.reverse(vec2.create(3, 6));
        deepEqual(toArray(v), [-3, -6]);

        v = vec2.reverse(vec2.create(-3, -5));
        deepEqual(toArray(v), [3, 5]);
    });

    QUnit.test("orthogonal", () => {
        var v = vec2.orthogonal(vec2.create(1, 1));
        deepEqual(toArray(v), [-1, 1]);

        v = vec2.orthogonal(vec2.create(-1, 1));
        deepEqual(toArray(v), [-1, -1]);

        v = vec2.orthogonal(vec2.create(-1, -1));
        deepEqual(toArray(v), [1, -1]);

        v = vec2.orthogonal(vec2.create(1, -1));
        deepEqual(toArray(v), [1, 1]);
    });

    QUnit.test("normalize", () => {
        var n = vec2.normalize(vec2.create(2, 2));
        ok(close(n[0], Math.SQRT2 / 2));
        ok(close(n[1], Math.SQRT2 / 2));

        n = vec2.normalize(vec2.create(0, 5));
        ok(close(n[0], 0.0));
        ok(close(n[1], 1.0));
    });

    QUnit.test("rotate", () => {
        var v = vec2.rotate(vec2.create(3, 6), Math.PI / 2);
        deepEqual(toArray(v), [-6, 3]);

        var v = vec2.rotate(vec2.create(3, 6), Math.PI);
        deepEqual(toArray(v), [-3, -6]);
    });

    QUnit.test("midpoint", () => {
        var v = vec2.midpoint(vec2.create(1, 5), vec2.create(10, -1));
        deepEqual(toArray(v), [5.5, 2]);

        var dest = vec2.midpoint(v, vec2.create(1.5, 1));
        strictEqual(v, dest);
        deepEqual(toArray(v), [3.5, 1.5]);
    });

    QUnit.test("angleBetween", () => {
        var theta = vec2.angleBetween(vec2.create(1, 0), vec2.create(Math.SQRT2 / 2, Math.SQRT2 / 2));
        ok(close(theta, Math.PI / 4));

        theta = vec2.angleBetween(vec2.create(1, 0), vec2.create(-Math.SQRT2 / 2, Math.SQRT2 / 2));
        ok(close(theta, 3 * Math.PI / 4));

        theta = vec2.angleBetween(vec2.create(1, 0), vec2.create(-Math.SQRT2 / 2, -Math.SQRT2 / 2));
        ok(close(theta, 3 * Math.PI / 4));
    });

    QUnit.test("isClockwiseTo", () => {
        ok(vec2.isClockwiseTo(vec2.create(1, 0), vec2.create(0, 1)));
        ok(!vec2.isClockwiseTo(vec2.create(1, 0), vec2.create(0, -1)));
    });

    QUnit.test("intersection", () => {
        var int = vec2.intersection(vec2.create(0, 0), vec2.create(1, 1), vec2.create(0, 10), vec2.create(1, -1));
        deepEqual(toArray(int), [5, 5]);
    });
}