namespace la.mat3 {
    /// NOTE:
    ///     Row-major order
    ///     [m11, m12, m21, m22, x0, y0]
    export function create(src?: number[]|Float32Array): Float32Array {
        var dest = new Float32Array(6);

        if (src) {
            dest[0] = src[0];
            dest[1] = src[1];
            dest[2] = src[2];
            dest[3] = src[3];
            dest[4] = src[4];
            dest[5] = src[5];
        } else {
            dest[0] = dest[1] = dest[2] = dest[3] = dest[4] = dest[5] = 0;
        }

        return dest;
    }

    export function copyTo(src: Float32Array, dest: Float32Array): Float32Array {
        dest[0] = src[0];
        dest[1] = src[1];
        dest[2] = src[2];
        dest[3] = src[3];
        dest[4] = src[4];
        dest[5] = src[5];
        return dest;
    }

    export function init(dest: Float32Array, m11: number, m12: number, m21: number, m22: number, x0: number, y0: number): Float32Array {
        dest[0] = m11;
        dest[1] = m12;
        dest[2] = m21;
        dest[3] = m22;
        dest[4] = x0;
        dest[5] = y0;
        return dest;
    }

    export function identity(dest?: Float32Array): Float32Array {
        if (!dest) dest = create();
        dest[0] = 1;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 1;
        dest[4] = 0;
        dest[5] = 0;
        return dest;
    }

    export function equal(a: Float32Array, b: Float32Array): boolean {
        return a === b || (
                Math.abs(a[0] - b[0]) < EPSILON &&
                Math.abs(a[1] - b[1]) < EPSILON &&
                Math.abs(a[2] - b[2]) < EPSILON &&
                Math.abs(a[3] - b[3]) < EPSILON &&
                Math.abs(a[4] - b[4]) < EPSILON &&
                Math.abs(a[5] - b[5]) < EPSILON
            );
    }

    // dest = a * b
    export function multiply(a: Float32Array, b: Float32Array, dest?: Float32Array): Float32Array {
        if (!dest) dest = a;
        var a11 = a[0], a12 = a[1],
            a21 = a[2], a22 = a[3],
            ax0 = a[4], ay0 = a[5],
            b11 = b[0], b12 = b[1],
            b21 = b[2], b22 = b[3],
            bx0 = b[4], by0 = b[5];

        dest[0] = a11 * b11 + a12 * b21;
        dest[1] = a11 * b12 + a12 * b22;

        dest[2] = a21 * b11 + a22 * b21;
        dest[3] = a21 * b12 + a22 * b22;

        dest[4] = a11 * bx0 + a12 * by0 + ax0;
        dest[5] = a21 * bx0 + a22 * by0 + ay0;

        return dest;
    }

    export function inverse(mat: Float32Array, dest?: Float32Array): Float32Array {
        if (Math.abs(mat[1]) < EPSILON && Math.abs(mat[2]) < EPSILON) //Simple scaling/translation matrix
            return simple_inverse(mat, dest);
        else
            return complex_inverse(mat, dest);
    }

    export function transformVec2(mat: Float32Array, vec: Float32Array, dest?: Float32Array): Float32Array {
        if (!dest) dest = vec;
        var x = vec[0],
            y = vec[1];
        dest[0] = (mat[0] * x) + (mat[1] * y) + mat[4];
        dest[1] = (mat[2] * x) + (mat[3] * y) + mat[5];
        return dest;
    }

    export function transformVec2s(mat: Float32Array, ...vecs: Float32Array[]) {
        for (var i = vecs.length - 1; i >= 0; i--) {
            transformVec2(mat, vecs[i]);
        }
    }

    export function createTranslate(x: number, y: number, dest?: Float32Array): Float32Array {
        if (!dest) dest = create();
        dest[0] = 1;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 1;
        dest[4] = x;
        dest[5] = y;
        return dest;
    }

    export function translate(mat: Float32Array, x: number, y: number): Float32Array {
        mat[4] += x;
        mat[5] += y;
        return mat;
    }

    export function createScale(sx: number, sy: number, dest?: Float32Array): Float32Array {
        if (!dest) dest = create();
        dest[0] = sx;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = sy;
        dest[4] = 0;
        dest[5] = 0;
        return dest;
    }

    export function scale(mat: Float32Array, sx: number, sy: number): Float32Array {
        mat[0] *= sx;
        mat[2] *= sx;
        mat[4] *= sx;

        mat[1] *= sy;
        mat[3] *= sy;
        mat[5] *= sy;
        return mat;
    }

    export function createRotate(angleRad: number, dest?: Float32Array): Float32Array {
        if (!dest) dest = create();
        var c = Math.cos(angleRad);
        var s = Math.sin(angleRad);
        dest[0] = c;
        dest[1] = -s;
        dest[2] = s;
        dest[3] = c;
        dest[4] = 0;
        dest[5] = 0;
        return dest;
    }

    export function createSkew(angleRadX: number, angleRadY: number, dest?: Float32Array): Float32Array {
        if (!dest) dest = create();
        dest[0] = 1;
        dest[1] = Math.tan(angleRadX);
        dest[2] = Math.tan(angleRadY);
        dest[3] = 1;
        dest[4] = 0;
        dest[5] = 0;
        return dest;
    }

    export function preapply(dest: Float32Array, mat: Float32Array): Float32Array {
        return multiply(dest, mat, dest);
    }

    export function apply(dest: Float32Array, mat: Float32Array): Float32Array {
        return multiply(mat, dest, dest);
    }

    function simple_inverse(mat: Float32Array, dest?: Float32Array): Float32Array {
        var m11 = mat[0];
        if (Math.abs(m11) < EPSILON)
            return null;

        var m22 = mat[3];
        if (Math.abs(m22) < EPSILON)
            return null;

        if (!dest) {
            dest = mat;
        } else {
            dest[1] = mat[1];
            dest[2] = mat[2];
        }

        var x0 = -mat[4];
        var y0 = -mat[5];
        if (Math.abs(m11 - 1) > EPSILON) {
            m11 = 1 / m11;
            x0 *= m11;
        }
        if (Math.abs(m22 - 1) > EPSILON) {
            m22 = 1 / m22;
            y0 *= m22;
        }

        dest[0] = m11;
        dest[3] = m22;
        dest[4] = x0;
        dest[5] = y0;
        return dest;
    }

    function complex_inverse(mat: Float32Array, dest?: Float32Array): Float32Array {
        if (!dest) dest = mat;

        var m11 = mat[0], m12 = mat[1],
            m21 = mat[2], m22 = mat[3];

        //inv(A) = 1/det(A) * adj(A)
        var det = m11 * m22 - m12 * m21;
        if (det === 0 || !isFinite(det))
            return null;
        var id = 1 / det;

        var x0 = mat[4], y0 = mat[5];

        dest[0] = m22 * id;
        dest[1] = -m12 * id;
        dest[2] = -m21 * id;
        dest[3] = m11 * id;
        dest[4] = (m21 * y0 - m22 * x0) * id;
        dest[5] = (m12 * x0 - m11 * y0) * id;
        return dest;
    }
}