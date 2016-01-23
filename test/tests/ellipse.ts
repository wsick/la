namespace la.ellipse.tests {
    QUnit.module("ellipse");

    var ell1 = la.ellipse(0, 0, 100, 100, 0);

    var digits = 10;

    function close(actual: number, expected: number, msg: string) {
        var factor = Math.pow(10, digits);
        equal(Math.round(actual * factor) / factor, Math.round(expected * factor) / factor, msg);
    }

    function closePoint(actual: Float32Array, expected: Float32Array, msg: string) {
        close(actual[0], expected[0], `${msg}.x`);
        close(actual[1], expected[1], `${msg}.y`);
    }

    QUnit.test("point", () => {
        closePoint(ell1.point(0), vec2.create(100, 0), "#1 (0)");
        closePoint(ell1.point(Math.PI / 2), vec2.create(0, 100), "#1 (pi/2)");
        closePoint(ell1.point(Math.PI), vec2.create(-100, 0), "#1 (pi)");
        closePoint(ell1.point(3 * Math.PI / 2), vec2.create(0, -100), "#1 (3*pi/2)");
    });

    QUnit.test("normal", () => {
        closePoint(ell1.normal(0), vec2.create(100, 0), "#1 (0)");
        closePoint(ell1.normal(Math.PI / 2), vec2.create(0, 100), "#1 (pi/2)");
        closePoint(ell1.normal(Math.PI), vec2.create(-100, 0), "#1 (pi)");
        closePoint(ell1.normal(3 * Math.PI / 2), vec2.create(0, -100), "#1 (3*pi/2)");
    });

    QUnit.test("tangent", () => {
        closePoint(ell1.tangent(0), vec2.create(0, 100), "#1 (0)");
        closePoint(ell1.tangent(Math.PI / 2), vec2.create(-100, 0), "#1 (pi/2)");
        closePoint(ell1.tangent(Math.PI), vec2.create(0, -100), "#1 (pi)");
        closePoint(ell1.tangent(3 * Math.PI / 2), vec2.create(100, 0), "#1 (3*pi/2)");
    });

    QUnit.test("extrema", () => {
        var ext = ell1.extrema(0, 2 * Math.PI, false);
        equal(ext.length, 4, "#1 count");
        closePoint(ext[0], vec2.create(100, 0), "#1 (vert 1)");
        closePoint(ext[1], vec2.create(-100, 0), "#1 (vert 2)");
        closePoint(ext[2], vec2.create(0, 100), "#1 (hori 1)");
        closePoint(ext[3], vec2.create(0, -100), "#1 (hori 2)");
    });

    QUnit.test("extrema (constrained cw)", () => {
        var ext = ell1.extrema(0, 3 * Math.PI / 4, false);
        equal(ext.length, 4, "#1 count");
        closePoint(ext[0], vec2.create(100, 0), "#1 (vert 1)");
        equal(ext[1], null, "#1 (vert 2)");
        closePoint(ext[2], vec2.create(0, 100), "#1 (hori 1)");
        equal(ext[3], null, "#1 (hori 2)");
    });

    QUnit.test("extrema (constrained ccw - neg ea)", () => {
        var ext = ell1.extrema(-Math.PI / 4, -Math.PI, true);
        equal(ext.length, 4, "#1 count");
        equal(ext[0], null, "#1 (vert 1)");
        closePoint(ext[1], vec2.create(-100, 0), "#1 (vert 2)");
        equal(ext[2], null, "#1 (hori 1)");
        closePoint(ext[3], vec2.create(0, -100), "#1 (hori 2)");
    });

    QUnit.test("extrema (constrained ccw - pos ea)", () => {
        var ext = ell1.extrema(7 * Math.PI / 4, Math.PI, true);
        equal(ext.length, 4, "#1 count");
        equal(ext[0], null, "#1 (vert 1)");
        closePoint(ext[1], vec2.create(-100, 0), "#1 (vert 2)");
        equal(ext[2], null, "#1 (hori 1)");
        closePoint(ext[3], vec2.create(0, -100), "#1 (hori 2)");
    });
}