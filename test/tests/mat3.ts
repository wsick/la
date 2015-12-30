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

    QUnit.test("translate", () => {
        var m = mat3.createTranslate(1, 2);
        deepEqual(toArray(m), [1, 0, 0, 1, 1, 2]);

        mat3.translate(m, 1, 2);
        deepEqual(toArray(m), [1, 0, 0, 1, 2, 4]);

        deepEqual(toArray(mat3.multiply(mat3.createTranslate(1, 2), mat3.createTranslate(2, 4), mat3.create())), [1, 0, 0, 1, 3, 6]);
        deepEqual(toArray(mat3.multiply(mat3.createTranslate(2, 4), mat3.createTranslate(1, 2), mat3.create())), [1, 0, 0, 1, 3, 6]);

        var v = vec2.create(1, 1);
        mat3.transformVec2(mat3.createTranslate(1, 2), v);
        deepEqual(toArray(v), [2, 3]);
    });

    QUnit.test("scale", () => {
        var m = mat3.createScale(2, 4);
        deepEqual(toArray(m), [2, 0, 0, 4, 0, 0]);

        mat3.scale(m, 2, 4);
        deepEqual(toArray(m), [4, 0, 0, 16, 0, 0]);

        //s(2,4) * t(1,2)
        deepEqual(toArray(mat3.multiply(mat3.createTranslate(1, 2), mat3.createScale(2, 4), mat3.create())), [2, 0, 0, 4, 2, 8]);
        //t(1,2) * s(2,4)
        deepEqual(toArray(mat3.multiply(mat3.createScale(2, 4), mat3.createTranslate(1, 2), mat3.create())), [2, 0, 0, 4, 1, 2]);

        var v = vec2.create(1, 1);
        mat3.transformVec2(mat3.createScale(2, 4), v);
        deepEqual(toArray(v), [2, 4]);
    });

    var SQRT3_2 = Math.sqrt(3) / 2;
    QUnit.test("rotate", () => {
        var m = mat3.createRotate(-Math.PI / 6);
        ok(mat3.equal(m, mat3.create([SQRT3_2, -0.5, 0.5, SQRT3_2, 0, 0])));

        var angleRad = -Math.PI / 2;
        //t(1,2) * r(-90)
        m = mat3.multiply(mat3.createTranslate(1, 2), mat3.createRotate(angleRad), mat3.create());
        ok(mat3.equal(m, mat3.create([0, -1, 1, 0, 2, -1])));
        //r(-90) * t(1,2)
        m = mat3.multiply(mat3.createRotate(angleRad), mat3.createTranslate(1, 2), mat3.create());
        ok(mat3.equal(m, mat3.create([0, -1, 1, 0, 1, 2])));

        var v = vec2.create(1, 2);
        mat3.transformVec2(mat3.createRotate(Math.PI / 2), v);
        deepEqual(toArray(v), [-2, 1]);
    });

    QUnit.test("skew", () => {
        var m = mat3.createSkew(Math.PI / 4, 0);
        ok(mat3.equal(m, mat3.create([1, 0, 1, 1, 0, 0])));

        // | ┌──┐           |   ┌──┐
        // | |  |     -->   |  /  /
        // | └──┘           | └──┘
        // +---------       +---------
        var tl = vec2.create(1, 3);
        var tr = vec2.create(3, 3);
        var br = vec2.create(3, 1);
        var bl = vec2.create(1, 1);
        mat3.transformVec2(m, tl);
        mat3.transformVec2(m, tr);
        mat3.transformVec2(m, br);
        mat3.transformVec2(m, bl);

        deepEqual(toArray(tl), [4, 3]);
        deepEqual(toArray(tr), [6, 3]);
        deepEqual(toArray(br), [4, 1]);
        deepEqual(toArray(bl), [2, 1]);

        var angleRadX = Math.PI / 4;
        var angleRadY = 0;
        //sk(45, 0) * t(1,0)
        m = mat3.multiply(mat3.createTranslate(1, 0), mat3.createSkew(angleRadX, angleRadY), mat3.create());
        ok(mat3.equal(m, mat3.create([1, 0, 1, 1, 1, 0])));
        //t(1,0) * sk(45, 0)
        m = mat3.multiply(mat3.createSkew(angleRadX, angleRadY), mat3.createTranslate(1, 0), mat3.create());
        ok(mat3.equal(m, mat3.create([1, 0, 1, 1, 1, 0])));
    });

    QUnit.test("apply", () => {
        var cur = mat3.createTranslate(10, 20);
        mat3.apply(cur, mat3.createScale(2, 4));
        deepEqual(toArray(cur), [2, 0, 0, 4, 20, 80]);

        cur = mat3.createScale(2, 4);
        mat3.apply(cur, mat3.createTranslate(10, 20));
        deepEqual(toArray(cur), [2, 0, 0, 4, 10, 20]);
    });

    QUnit.test("preapply", () => {
        var cur = mat3.createTranslate(10, 20);
        mat3.preapply(cur, mat3.createScale(2, 4));
        deepEqual(toArray(cur), [2, 0, 0, 4, 10, 20]);

        cur = mat3.createScale(2, 4);
        mat3.preapply(cur, mat3.createTranslate(10, 20));
        deepEqual(toArray(cur), [2, 0, 0, 4, 20, 80]);
    });

    QUnit.test("inverse", () => {
        var cur = mat3.createTranslate(10, 20);
        deepEqual(toArray(mat3.inverse(cur)), [1, 0, 0, 1, -10, -20]);

        cur = mat3.createScale(2, 4);
        deepEqual(toArray(mat3.inverse(cur)), [1 / 2, 0, 0, 1 / 4, 0, 0]);

        cur = mat3.createRotate(Math.PI / 2);
        var inverse = mat3.inverse(cur);
        ok(close(inverse[0], 0));
        ok(close(inverse[1], -1));
        ok(close(inverse[2], 1));
        ok(close(inverse[3], 0));
        ok(close(inverse[4], 0));
        ok(close(inverse[5], 0));

        cur = mat3.createSkew(Math.PI / 4, 0);
        inverse = mat3.inverse(cur);
        deepEqual(toArray(inverse), [1, 0, -1, 1, 0, 0]);
    });
}