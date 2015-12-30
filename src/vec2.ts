namespace la.vec2 {
    export function create(x: number, y: number): Float32Array {
        var dest = new Float32Array(2);
        dest[0] = x;
        dest[1] = y;
        return dest;
    }

    export function init(x: number, y: number, dest?: Float32Array): Float32Array {
        if (!dest) dest = new Float32Array(2);
        dest[0] = x;
        dest[1] = y;
        return dest;
    }

    export function clone(src: Float32Array, dest?: Float32Array): Float32Array {
        return init(src[0], src[1], dest);
    }

    export function reverse(src: Float32Array, dest?: Float32Array): Float32Array {
        if (!dest) dest = src;
        dest[0] = -src[0];
        dest[1] = -src[1];
        return dest;
    }

    /// Equivalent of rotating 90 degrees clockwise (screen space)
    export function orthogonal(src: Float32Array, dest?: Float32Array): Float32Array {
        if (!dest) dest = src;
        var x = src[0],
            y = src[1];
        dest[0] = -y;
        dest[1] = x;
        return dest;
    }

    export function normalize(src: Float32Array, dest?: Float32Array): Float32Array {
        if (!dest) dest = src;
        var x = src[0],
            y = src[1];
        var len = Math.sqrt(x * x + y * y);
        dest[0] = x / len;
        dest[1] = y / len;
        return dest;
    }

    /// Rotates a vector(v) by angle(theta) clockwise(screen space) ...which is counter-clockwise in coordinate space
    export function rotate(src: Float32Array, theta: number, dest?: Float32Array): Float32Array {
        if (!dest) dest = src;
        var c = Math.cos(theta);
        var s = Math.sin(theta);
        var x = src[0];
        var y = src[1];
        dest[0] = x * c - y * s;
        dest[1] = x * s + y * c;
        return dest;
    }

    /// Returns smallest angle (in radians) between 2 vectors
    export function angleBetween(u: Float32Array, v: Float32Array): number {
        var ux = u[0],
            uy = u[1],
            vx = v[0],
            vy = v[1];
        var num = ux * vx + uy * vy;
        var den = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);
        return Math.acos(num / den);
    }

    /// By rotating from vector(v1) to vector(v2), tests whether that angle is clockwise (screen space)
    export function isClockwiseTo(v1: Float32Array, v2: Float32Array): boolean {
        var theta = angleBetween(v1, v2);
        var nv1 = normalize(clone(v1));
        var nv2 = normalize(clone(v2));
        rotate(nv1, theta);
        var nx = Math.abs(nv1[0] - nv2[0]);
        var ny = Math.abs(nv1[1] - nv2[1]);
        return nx < EPSILON
            && ny < EPSILON;
    }

    /// Finds intersection of v1(s1 + t(d1)) and v2(s2 + t(d2))
    export function intersection(s1: Float32Array, d1: Float32Array, s2: Float32Array, d2: Float32Array): Float32Array {
        var x1 = s1[0];
        var y1 = s1[1];
        var x2 = x1 + d1[0];
        var y2 = y1 + d1[1];

        var x3 = s2[0];
        var y3 = s2[1];
        var x4 = x3 + d2[0];
        var y4 = y3 + d2[1];

        var det = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (det === 0)
            return null;

        var xn = ((x1 * y2 - y1 * x2) * (x3 - x4)) - ((x1 - x2) * (x3 * y4 - y3 * x4));
        var yn = ((x1 * y2 - y1 * x2) * (y3 - y4)) - ((y1 - y2) * (x3 * y4 - y3 * x4));
        return vec2.create(xn / det, yn / det);
    }
}