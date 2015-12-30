namespace la.mat3.tests {
    QUnit.module("mat3");

    function toArray(f32arr: Float32Array): number[] {
        return Array.prototype.slice.call(f32arr, 0);
    }

    function close(num1: number, num2: number): boolean {
        return Math.abs(num1 - num2) < EPSILON;
    }

    QUnit.test("create", (assert) => {
        var mat = mat3.create();
        assert.ok(mat instanceof Float32Array);
        assert.deepEqual(toArray(mat), [0, 0, 0, 0, 0, 0]);

        var from = mat3.create([1, 2, 3, 4, 5, 6]);
        assert.ok(from instanceof Float32Array);
        assert.deepEqual(toArray(from), [1, 2, 3, 4, 5, 6]);
    });

    QUnit.test("identity", (assert) => {
        assert.deepEqual(toArray(mat3.identity()), [1, 0, 0, 1, 0, 0]);

        var exist = mat3.create();
        mat3.identity(exist);
        assert.deepEqual(toArray(exist), [1, 0, 0, 1, 0, 0]);
    });

    QUnit.test("equal", () => {
        var m1 = mat3.create([1, 2, 3, 4, 5, 6]);
        var m2 = mat3.create([1, 2, 3, 4, 5, 6]);
        ok(mat3.equal(m1, m2));
    });

    QUnit.test("createTranslate", () => {
        var m = mat3.createTranslate(1, 2);
        deepEqual(toArray(m), [1, 0, 0, 1, 1, 2]);
        var v = vec2.create(1, 2);
        mat3.transformVec2(mat3.createTranslate(1, 2), v);
        deepEqual(toArray(v), [2, 4]);
    });

    QUnit.test("createScale", () => {
        var m = mat3.createScale(2, 4);
        deepEqual(toArray(m), [2, 0, 0, 4, 0, 0]);
        var v = vec2.create(1, 2);
        mat3.transformVec2(m, v);
        deepEqual(toArray(v), [2, 8]);
    });

    QUnit.test("createRotate", () => {
        var m = mat3.createRotate(Math.PI / 2);
        ok(close(m[0], 0));
        ok(close(m[1], -1));
        ok(close(m[2], 1));
        ok(close(m[3], 0));
        ok(close(m[4], 0));
        ok(close(m[5], 0));
        var v = vec2.create(1, 2);
        mat3.transformVec2(m, v);
        deepEqual(toArray(v), [-2, 1]);
    });

    QUnit.test("createSkew", () => {
        var m = mat3.createSkew(Math.PI / 4, 0);
        deepEqual(toArray(m), [1, 1, 0, 1, 0, 0]);

        // | ┌──┐           |   ┌──┐
        // | |  |     -->   |  /  /
        // | └──┘           | └──┘
        // +---------       +---------
        var p0 = vec2.create(1, 3);
        var p1 = vec2.create(3, 3);
        var p2 = vec2.create(3, 1);
        var p3 = vec2.create(1, 1);
        mat3.transformVec2s(m, p0, p1, p2, p3);

        deepEqual(toArray(p0), [4, 3]);
        deepEqual(toArray(p1), [6, 3]);
        deepEqual(toArray(p2), [4, 1]);
        deepEqual(toArray(p3), [2, 1]);
    });

    QUnit.test("inverse", () => {
        var m = mat3.inverse(mat3.createTranslate(10, 20));
        deepEqual(toArray(m), [1, 0, 0, 1, -10, -20]);

        m = mat3.inverse(mat3.createScale(2, 4));
        deepEqual(toArray(m), [1 / 2, 0, 0, 1 / 4, 0, 0]);

        m = mat3.inverse(mat3.createRotate(Math.PI / 2));
        ok(close(m[0], 0));
        ok(close(m[1], 1));
        ok(close(m[2], -1));
        ok(close(m[3], 0));
        ok(close(m[4], 0));
        ok(close(m[5], 0));

        m = mat3.inverse(mat3.createSkew(Math.PI / 4, 0));
        deepEqual(toArray(m), [1, -1, 0, 1, 0, 0]);
    });
}