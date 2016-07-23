declare namespace la {
    var version: string;
}
declare namespace la {
    interface IEllipse {
        cx: number;
        cy: number;
        rx: number;
        ry: number;
        phi: number;
        x(theta: number): number;
        y(theta: number): number;
        point(theta: number): Float32Array;
        normal(theta: number): Float32Array;
        tangent(theta: number): Float32Array;
        extrema(sa: number, ea: number, ac: boolean): Float32Array[];
    }
    function ellipse(cx: number, cy: number, rx: number, ry: number, phi: number): IEllipse;
}
declare namespace la {
    var EPSILON: number;
}
declare namespace la {
    interface IPadding {
        left: number;
        top: number;
        right: number;
        bottom: number;
    }
}
declare namespace la {
    interface IPoint {
        x: number;
        y: number;
    }
}
declare namespace la {
    interface IRect extends IPoint, ISize {
    }
}
declare namespace la {
    interface ISize {
        width: number;
        height: number;
    }
}
declare namespace la.mat3 {
    function create(src?: number[] | Float32Array): Float32Array;
    function copyTo(src: Float32Array, dest: Float32Array): Float32Array;
    function init(dest: Float32Array, m11: number, m12: number, m21: number, m22: number, x0: number, y0: number): Float32Array;
    function identity(dest?: Float32Array): Float32Array;
    function equal(a: Float32Array, b: Float32Array): boolean;
    function multiply(a: Float32Array, b: Float32Array, dest?: Float32Array): Float32Array;
    function inverse(mat: Float32Array, dest?: Float32Array): Float32Array;
    function transformVec2(mat: Float32Array, vec: Float32Array, dest?: Float32Array): Float32Array;
    function transformVec2s(mat: Float32Array, ...vecs: Float32Array[]): void;
    function createTranslate(x: number, y: number, dest?: Float32Array): Float32Array;
    function translate(mat: Float32Array, x: number, y: number): Float32Array;
    function createScale(sx: number, sy: number, dest?: Float32Array): Float32Array;
    function scale(mat: Float32Array, sx: number, sy: number): Float32Array;
    function createRotate(angleRad: number, dest?: Float32Array): Float32Array;
    function createSkew(angleRadX: number, angleRadY: number, dest?: Float32Array): Float32Array;
    function preapply(dest: Float32Array, mat: Float32Array): Float32Array;
    function apply(dest: Float32Array, mat: Float32Array): Float32Array;
}
declare namespace la.padding {
    function init(l: number, t: number, r: number, b: number, dest?: IPadding): IPadding;
    function copyTo(src: IPadding, dest?: IPadding): IPadding;
    function equal(r1: IPadding, r2: IPadding): boolean;
    function isEmpty(src: IPadding): boolean;
}
declare namespace la.vec2 {
    function create(x: number, y: number): Float32Array;
    function init(x: number, y: number, dest?: Float32Array): Float32Array;
    function clone(src: Float32Array, dest?: Float32Array): Float32Array;
    function reverse(src: Float32Array, dest?: Float32Array): Float32Array;
    function orthogonal(src: Float32Array, dest?: Float32Array): Float32Array;
    function normalize(src: Float32Array, dest?: Float32Array): Float32Array;
    function rotate(src: Float32Array, theta: number, dest?: Float32Array): Float32Array;
    function midpoint(p1: Float32Array, p2: Float32Array, dest?: Float32Array): Float32Array;
    function angleBetween(u: Float32Array, v: Float32Array): number;
    function isClockwiseTo(v1: Float32Array, v2: Float32Array): boolean;
    function intersection(s1: Float32Array, d1: Float32Array, s2: Float32Array, d2: Float32Array): Float32Array;
}
declare namespace la.rect {
    function init(x: number, y: number, width: number, height: number, dest?: IRect): IRect;
    function copyTo(src: IRect, dest?: IRect): IRect;
    function transform(src: IRect, transform: Float32Array, dest?: IRect): IRect;
    function equal(r1: IRect, r2: IRect): boolean;
    function isEmpty(src: IRect): boolean;
    function union(r1: IRect, r2: IRect, dest?: IRect): IRect;
    function intersection(r1: IRect, r2: IRect, dest?: IRect): IRect;
    function isContainedIn(src: IRect, test: IRect): boolean;
    function containsPoint(rect1: IRect, p: IPoint): boolean;
    function containsVec2(rect1: IRect, v: Float32Array): boolean;
    function roundOut(dest: IRect): void;
    function roundIn(dest: IRect): IRect;
    function grow(src: IRect, padding: IPadding, dest?: IRect): void;
    function shrink(src: IRect, padding: IPadding, dest?: IRect): void;
}
