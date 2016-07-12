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

    QUnit.test("isEmpty", (assert) => {
        var r1 = rect.init(0, 0, 0, 0);
        ok(rect.isEmpty(r1));

        rect.init(1, 1, 1, 0, r1);
        ok(rect.isEmpty(r1));

        rect.init(1, 1, 0, 1, r1);
        ok(rect.isEmpty(r1));

        rect.init(1, 1, 1, 1, r1);
        ok(!rect.isEmpty(r1));
    });

    QUnit.test("intersection", () => {
        var r1 = rect.init(0, 0, 100, 100);
        var r2 = rect.init(50, 50, 100, 100);
        var dest = rect.intersection(r1, r2);
        deepEqual(r1, rect.init(50, 50, 50, 50), "r1 should be the intersection");
        deepEqual(r2, rect.init(50, 50, 100, 100), "r2 should remain unchanged");
        strictEqual(r1, dest);

        rect.init(0, 0, 100, 100, r1);
        rect.init(50, 50, 25, 25, r2);
        dest = rect.intersection(r1, r2);
        deepEqual(r1, rect.init(50, 50, 25, 25), "r1 should be the intersection");
        deepEqual(r2, rect.init(50, 50, 25, 25), "r2 should remain unchanged");
        strictEqual(r1, dest);

        rect.init(50, 50, 25, 25, r1);
        rect.init(0, 0, 100, 100, r2);
        dest = rect.intersection(r1, r2);
        deepEqual(r1, rect.init(50, 50, 25, 25), "r1 should be the intersection");
        deepEqual(r2, rect.init(0, 0, 100, 100), "r2 should remain unchanged");
        strictEqual(r1, dest);

        rect.init(50, 50, 25, 25, r1);
        rect.init(0, 0, 100, 100, r2);
        dest = rect.init(0, 0, 0, 0);
        var dest2 = rect.intersection(r1, r2, dest);
        strictEqual(dest, dest2, "input dest should be the same ref as output");
        notStrictEqual(r1, dest, "first input rect should not be used as output");
    });

    QUnit.test("union", () => {
        var r1 = rect.init(0, 0, 0, 0);
        var r2 = rect.init(0, 0, 100, 100);
        rect.union(r1, r2);
        deepEqual(r1, rect.init(0, 0, 100, 100));

        rect.init(50, 50, 100, 100, r1);
        rect.init(0, 0, 0, 0, r2);
        rect.union(r1, r2);
        deepEqual(r1, rect.init(50, 50, 100, 100));

        rect.init(50, 50, 100, 100, r1);
        rect.init(75, 75, 100, 100, r2);
        rect.union(r1, r2);
        deepEqual(r1, rect.init(50, 50, 125, 125));

        rect.init(50, 50, 100, 100, r1);
        rect.init(0, 0, 200, 100, r2);
        rect.union(r1, r2);
        deepEqual(r1, rect.init(0, 0, 200, 150));
    });

    QUnit.test("isContainedIn", () => {
        var r1 = rect.init(0, 0, 100, 100);
        var r2 = rect.init(50, 50, 25, 25);
        ok(!rect.isContainedIn(r1, r2));

        rect.init(50, 50, 25, 25, r1);
        rect.init(0, 0, 100, 100, r2);
        ok(rect.isContainedIn(r1, r2));
    });

    QUnit.test("roundOut", () => {
        var r = rect.init(0.25, 0.75, 100.4, 199.8);
        rect.roundOut(r);
        deepEqual(r, rect.init(0, 0, 101, 201));
    });

    QUnit.test("roundIn", () => {
        var r = rect.init(0.25, 0.75, 100.4, 199.8);
        rect.roundIn(r);
        deepEqual(r, rect.init(1, 1, 99, 199));
    });

    QUnit.test("containsPoint", () => {
        var r = rect.init(0, 0, 100, 100);
        ok(rect.containsPoint(r, {x: 0, y: 0}));
        ok(rect.containsPoint(r, {x: 100, y: 0}));
        ok(rect.containsPoint(r, {x: 0, y: 100}));
        ok(rect.containsPoint(r, {x: 100, y: 100}));
        ok(rect.containsPoint(r, {x: 25, y: 75}));
        ok(!rect.containsPoint(r, {x: -25, y: 75}));
        ok(!rect.containsPoint(r, {x: 25, y: -75}));
        ok(!rect.containsPoint(r, {x: 125, y: 75}));
        ok(!rect.containsPoint(r, {x: 25, y: 125}));
    });

    QUnit.test("grow", () => {
        var r = rect.init(0, 0, 100, 100);
        rect.grow(r, {left: 5, top: 10, right: 15, bottom: 20});
        deepEqual(r, {x: -5, y: -10, width: 120, height: 130});
    });

    QUnit.test("shrink", () => {
        var r = rect.init(0, 0, 100, 100);
        rect.shrink(r, {left: 5, top: 10, right: 15, bottom: 20});
        deepEqual(r, {x: 5, y: 10, width: 80, height: 70});
    });
}