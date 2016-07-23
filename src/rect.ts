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

    export function isEmpty(src: IRect): boolean {
        return src.width === 0
            || src.height === 0;
    }

    // NOTE: If dest is not specified, r1 will be used dest
    export function union(r1: IRect, r2: IRect, dest?: IRect): IRect {
        if (!dest) dest = r1;
        if (r2.width <= 0 || r2.height <= 0)
            return dest;
        if (dest.width <= 0 || dest.height <= 0)
            return rect.copyTo(r2, dest);

        var x1 = r1.x, x2 = r2.x,
            y1 = r1.y, y2 = r2.y,
            w1 = r1.width, w2 = r2.width,
            h1 = r1.height, h2 = r2.height;

        dest.x = Math.min(x1, x2);
        dest.y = Math.min(y1, y2);
        dest.width = Math.max(x1 + w1, x2 + w2) - dest.x;
        dest.height = Math.max(y1 + h1, y2 + h2) - dest.y;
        return dest;
    }

    // NOTE: If dest is not specified, r1 will be used dest
    export function intersection(r1: IRect, r2: IRect, dest?: IRect): IRect {
        if (!dest) dest = r1;
        var x = Math.max(r1.x, r2.x);
        var y = Math.max(r1.y, r2.y);
        dest.width = Math.max(0, Math.min(r1.x + r1.width, r2.x + r2.width) - x);
        dest.height = Math.max(0, Math.min(r1.y + r1.height, r2.y + r2.height) - y);
        dest.x = x;
        dest.y = y;
        return dest;
    }

    export function isContainedIn(src: IRect, test: IRect): boolean {
        var sl = src.x;
        var st = src.y;
        var sr = src.x + src.width;
        var sb = src.y + src.height;

        var tl = test.x;
        var tt = test.y;
        var tr = test.x + test.width;
        var tb = test.y + test.height;

        if (sl < tl || st < tt || sl > tr || st > tb) //src top-left is outside test
            return false;
        if (sr < tl || sb < tt || sr > tr || sb > tb) //src bottom-right is outside test
            return false;
        return true;
    }

    export function containsPoint(rect1: IRect, p: IPoint): boolean {
        return rect1.x <= p.x
            && rect1.y <= p.y
            && (rect1.x + rect1.width) >= p.x
            && (rect1.y + rect1.height) >= p.y;
    }

    export function containsVec2(rect1: IRect, v: Float32Array): boolean {
        var vx = v[0],
            vy = v[1];
        return rect1.x <= vx
            && rect1.y <= vy
            && (rect1.x + rect1.width) >= vx
            && (rect1.y + rect1.height) >= vy;
    }

    export function roundOut(dest: IRect) {
        var x = Math.floor(dest.x);
        var y = Math.floor(dest.y);
        dest.width = Math.ceil(dest.x + dest.width) - x;
        dest.height = Math.ceil(dest.y + dest.height) - y;
        dest.x = x;
        dest.y = y;
    }

    export function roundIn(dest: IRect) {
        var x = Math.ceil(dest.x);
        var y = Math.ceil(dest.y);
        dest.width = Math.floor(dest.x + dest.width) - x;
        dest.height = Math.floor(dest.y + dest.height) - y;
        dest.x = x;
        dest.y = y;
        return dest;
    }

    // NOTE: If dest is not specified, src will be used for dest
    export function grow(src: IRect, padding: IPadding, dest?: IRect) {
        if (!dest) dest = src;
        dest.x -= padding.left;
        dest.y -= padding.top;
        dest.width += padding.left + padding.right;
        dest.height += padding.top + padding.bottom;
    }

    // NOTE: If dest is not specified, src will be used for dest
    export function shrink(src: IRect, padding: IPadding, dest?: IRect) {
        if (!dest) dest = src;
        dest.x += padding.left;
        dest.y += padding.top;
        dest.width -= padding.left + padding.right;
        dest.height -= padding.top + padding.bottom;
    }
}