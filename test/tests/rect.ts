namespace la.rect.tests {
    QUnit.module("rect");

    QUnit.test("init", () => {
        var r1 = rect.init(1, 2, 3, 4);
        deepEqual(r1, {x: 1, y: 2, width: 3, height: 4});

        rect.init(10, 20, 30, 40, r1);
        deepEqual(r1, {x: 10, y: 20, width: 30, height: 40});
    });

    QUnit.test("copyTo", () => {
        var r1 = rect.init(1, 2, 3, 4);
        var r2 = rect.copyTo(r1);
        deepEqual(r2, {x: 1, y: 2, width: 3, height: 4});

        rect.init(10, 20, 30, 40, r1);
        rect.copyTo(r1, r2);
        deepEqual(r1, {x: 10, y: 20, width: 30, height: 40});
    });

    QUnit.test("transform", () => {
        var r1 = rect.init(10, 20, 50, 100);
        var xform = mat3.createTranslate(100, 100);
        var r2 = rect.transform(r1, xform);
        deepEqual(r2, {x: 110, y: 120, width: 50, height: 100});

        rect.init(10, 20, 50, 100, r1);
        xform = mat3.createScale(2, 4);
        mat3.apply(xform, mat3.createRotate(Math.PI / 2));
        rect.transform(r1, xform, r2);
        deepEqual(r2, {x: -480, y: 20, width: 400, height: 100});
    });

    QUnit.test("equal", () => {
        var r1 = rect.init(1, 2, 3, 4);
        var r2 = rect.init(1, 2, 3, 4);
        ok(rect.equal(r1, r2));

        rect.init(1, 2, 3, 5, r2);
        ok(!rect.equal(r1, r2));

        rect.init(1, 2, 4, 4, r2);
        ok(!rect.equal(r1, r2));

        rect.init(1, 3, 3, 4, r2);
        ok(!rect.equal(r1, r2));

        rect.init(2, 2, 3, 4, r2);
        ok(!rect.equal(r1, r2));
    });
}