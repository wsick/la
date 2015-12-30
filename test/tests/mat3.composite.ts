module la.mat3.composite.tests {
    QUnit.module("mat3.composite");

    function toArray(f32arr: Float32Array): number[] {
        return Array.prototype.slice.call(f32arr, 0);
    }

    function close(num1: number, num2: number): boolean {
        return Math.abs(num1 - num2) < EPSILON;
    }

    QUnit.test("translate+translate", () => {
        //t(2,4) * t(1,2)
        var m = mat3.apply(mat3.createTranslate(1, 2), mat3.createTranslate(2, 4));
        deepEqual(toArray(m), [1, 0, 0, 1, 3, 6]);

        //t(1, 2) * t(2, 4)
        m = mat3.apply(mat3.createTranslate(2, 4), mat3.createTranslate(1, 2));
        deepEqual(toArray(m), [1, 0, 0, 1, 3, 6]);
    });

    QUnit.test("scale+translate", () => {
        //s(2,4) * t(1,2)
        var m = mat3.apply(mat3.createTranslate(1, 2), mat3.createScale(2, 4));
        deepEqual(toArray(m), [2, 0, 0, 4, 2, 8]);
        var v = vec2.create(1, 2);
        mat3.transformVec2(m, v);
        deepEqual(toArray(v), [4, 16]);

        //t(1,2) * s(2,4)
        m = mat3.apply(mat3.createScale(2, 4), mat3.createTranslate(1, 2));
        deepEqual(toArray(m), [2, 0, 0, 4, 1, 2]);
        v = vec2.create(1, 2);
        mat3.transformVec2(m, v);
        deepEqual(toArray(v), [3, 10]);
    });

    QUnit.test("rotate+translate", () => {
        var angleRad = Math.PI / 2;

        //r(90) * t(1,2)
        var m = mat3.apply(mat3.createTranslate(1, 2), mat3.createRotate(angleRad));
        ok(close(m[0], 0));
        ok(close(m[1], -1));
        ok(close(m[2], 1));
        ok(close(m[3], 0));
        ok(close(m[4], -2));
        ok(close(m[5], 1));
        var v = vec2.create(1, 2);
        mat3.transformVec2(m, v); //(1,2)=>(2,4)=>(-4,2)
        deepEqual(toArray(v), [-4, 2]);

        //t(1,2) * r(90)
        m = mat3.apply(mat3.createRotate(angleRad), mat3.createTranslate(1, 2));
        ok(close(m[0], 0));
        ok(close(m[1], -1));
        ok(close(m[2], 1));
        ok(close(m[3], 0));
        ok(close(m[4], 1));
        ok(close(m[5], 2));
        v = vec2.create(1, 2);
        mat3.transformVec2(m, v); //(1,2)=>(-2,1)=>(-1,3)
        deepEqual(toArray(v), [-1, 3]);
    });

    QUnit.test("skew+translate", () => {
        var angleRadX = Math.PI / 4;
        var angleRadY = 0;

        //sk(45, 0) * t(1,0)
        var m = mat3.apply(mat3.createTranslate(1, 2), mat3.createSkew(angleRadX, angleRadY));
        deepEqual(toArray(m), [1, 1, 0, 1, 3, 2]);
        var box = [vec2.create(0, 0), vec2.create(4, 0), vec2.create(4, 4), vec2.create(0, 4)];
        mat3.transformVec2s(m, ...box);
        deepEqual(toArray(box[0]), [3, 2]);
        deepEqual(toArray(box[1]), [7, 2]);
        deepEqual(toArray(box[2]), [11, 6]);
        deepEqual(toArray(box[3]), [7, 6]);

        //t(1,0) * sk(45, 0)
        m = mat3.apply(mat3.createSkew(angleRadX, angleRadY), mat3.createTranslate(1, 2));
        deepEqual(toArray(m), [1, 1, 0, 1, 1, 2]);
        box = [vec2.create(0, 0), vec2.create(4, 0), vec2.create(4, 4), vec2.create(0, 4)];
        mat3.transformVec2s(m, ...box);
        deepEqual(toArray(box[0]), [1, 2]);
        deepEqual(toArray(box[1]), [5, 2]);
        deepEqual(toArray(box[2]), [9, 6]);
        deepEqual(toArray(box[3]), [5, 6]);
    });
}