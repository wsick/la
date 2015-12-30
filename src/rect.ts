/// <reference path="vec2" />

namespace la.rect {
    export function init(x: number, y: number, width: number, height: number, dest?: IRect): IRect {
        if (!dest)
            return {x: x, y: y, width: width, height: height};
        dest.x = x;
        dest.y = y;
        dest.width = width;
        dest.height = height;
        return dest;
    }

    export function copyTo(src: IRect, dest?: IRect): IRect {
        if (!dest) {
            return {
                x: src.x,
                y: src.y,
                width: src.width,
                height: src.height
            };
        } else {
            dest.x = src.x;
            dest.y = src.y;
            dest.width = src.width;
            dest.height = src.height;
            return dest;
        }
    }

    var p1 = vec2.create(0, 0);
    var p2 = vec2.create(0, 0);
    var p3 = vec2.create(0, 0);
    var p4 = vec2.create(0, 0);

    export function transform(src: IRect, transform: Float32Array, dest?: IRect): IRect {
        if (!transform)
            return dest;
        if (!dest)
            dest = <IRect>{x: 0, y: 0, width: 0, height: 0};

        var x = src.x;
        var y = src.y;
        var w = src.width;
        var h = src.height;

        vec2.init(x, y, p1);
        vec2.init(x + w, y, p2);
        vec2.init(x + w, y + h, p3);
        vec2.init(x, y + h, p4);

        mat3.transformVec2(transform, p1);
        mat3.transformVec2(transform, p2);
        mat3.transformVec2(transform, p3);
        mat3.transformVec2(transform, p4);

        var l = Math.min(p1[0], p2[0], p3[0], p4[0]);
        var t = Math.min(p1[1], p2[1], p3[1], p4[1]);
        var r = Math.max(p1[0], p2[0], p3[0], p4[0]);
        var b = Math.max(p1[1], p2[1], p3[1], p4[1]);

        dest.x = l;
        dest.y = t;
        dest.width = r - l;
        dest.height = b - t;
        return dest;
    }

    export function equal(r1: IRect, r2: IRect): boolean {
        return r1.x === r2.x
            && r1.y === r2.y
            && r1.width === r2.width
            && r1.height === r2.height;
    }
}