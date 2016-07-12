namespace la.padding.tests {
    QUnit.module("padding");

    QUnit.test("init", () => {
        var r1 = padding.init(1, 2, 3, 4);
        deepEqual(r1, {left: 1, top: 2, right: 3, bottom: 4});

        padding.init(10, 20, 30, 40, r1);
        deepEqual(r1, {left: 10, top: 20, right: 30, bottom: 40});
    });

    QUnit.test("copyTo", () => {
        var p1 = padding.init(1, 2, 3, 4);
        var p2 = padding.copyTo(p1);
        deepEqual(p2, {left: 1, top: 2, right: 3, bottom: 4});

        padding.init(10, 20, 30, 40, p1);
        padding.copyTo(p1, p2);
        deepEqual(p1, p2);
        ok(p1 !== p2);
    });

    QUnit.test("equal", () => {
        var p1 = padding.init(1, 2, 3, 4);
        var p2 = padding.init(1, 2, 3, 4);
        ok(padding.equal(p1, p2));

        padding.init(1, 2, 3, 5, p2);
        ok(!padding.equal(p1, p2));

        padding.init(1, 2, 4, 4, p2);
        ok(!padding.equal(p1, p2));

        padding.init(1, 3, 3, 4, p2);
        ok(!padding.equal(p1, p2));

        padding.init(2, 2, 3, 4, p2);
        ok(!padding.equal(p1, p2));
    });

    QUnit.test("isEmpty", (assert) => {
        var p1 = padding.init(0, 0, 0, 0);
        ok(padding.isEmpty(p1));

        padding.init(1, 1, 1, 0, p1);
        ok(!padding.isEmpty(p1));

        padding.init(1, 1, 0, 1, p1);
        ok(!padding.isEmpty(p1));

        padding.init(1, 1, 1, 1, p1);
        ok(!padding.isEmpty(p1));
    });
}