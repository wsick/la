var la;
(function (la) {
    la.version = '0.2.5';
})(la || (la = {}));
var la;
(function (la) {
    var PI2 = 2 * Math.PI;
    var PI1_2 = Math.PI / 2;
    function ellipse(cx, cy, rx, ry, phi) {
        var sphi = Math.sin(phi);
        var cphi = Math.cos(phi);
        var da = rx * cphi;
        var db = -ry * sphi;
        var dc = rx * sphi;
        var dd = ry * cphi;
        function flatTangentAngles() {
            var va1 = Math.atan2(db, da);
            if (va1 < 0)
                va1 += PI2;
            var va2 = va1 >= Math.PI ? va1 - Math.PI : va1 + Math.PI;
            var ha1 = Math.atan2(dd, dc);
            if (ha1 < 0)
                ha1 += PI2;
            var ha2 = ha1 >= Math.PI ? ha1 - Math.PI : ha1 + Math.PI;
            return [va1, va2, ha1, ha2];
        }
        function normalizeAngle(angle) {
            angle = angle % PI2;
            if (angle < 0)
                angle += PI2;
            return angle;
        }
        var e = {
            cx: cx,
            cy: cy,
            rx: rx,
            ry: ry,
            phi: phi,
            x: function (theta) {
                var stheta = Math.sin(theta);
                var ctheta = Math.cos(theta);
                return (cphi * rx * ctheta) + (-sphi * ry * stheta) + cx;
            },
            y: function (theta) {
                var stheta = Math.sin(theta);
                var ctheta = Math.cos(theta);
                return (sphi * rx * ctheta) + (cphi * ry * stheta) + cy;
            },
            point: function (theta) {
                return la.vec2.create(e.x(theta), e.y(theta));
            },
            normal: function (theta) {
                return la.vec2.rotate(e.tangent(theta), -PI1_2);
            },
            tangent: function (theta) {
                var stheta = Math.sin(theta);
                var ctheta = Math.cos(theta);
                return la.vec2.create((-da * stheta) + (db * ctheta), (-dc * stheta) + (dd * ctheta));
            },
            extrema: function (sa, ea, ac) {
                var da = ea - sa;
                var sa = normalizeAngle(sa);
                var ea = normalizeAngle(ea);
                var isContained;
                if (sa < ea) {
                    if (ac === true) {
                        isContained = function (theta) { return (0 <= theta && theta <= sa) || (ea <= theta && theta <= PI2); };
                    }
                    else {
                        isContained = function (theta) { return sa <= theta && theta <= ea; };
                    }
                }
                else if (sa > ea) {
                    if (ac === true) {
                        isContained = function (theta) { return ea <= theta && theta <= sa; };
                    }
                    else {
                        isContained = function (theta) { return (0 <= theta && theta <= ea) || (sa <= theta && theta <= PI2); };
                    }
                }
                else {
                    if (da > 0) {
                        isContained = function (theta) { return true; };
                    }
                    else {
                        isContained = function (theta) { return false; };
                    }
                }
                var _a = flatTangentAngles(), va1 = _a[0], va2 = _a[1], ha1 = _a[2], ha2 = _a[3];
                return [
                    (isContained(va1)) ? e.point(va1) : null,
                    (isContained(va2)) ? e.point(va2) : null,
                    (isContained(ha1)) ? e.point(ha1) : null,
                    (isContained(ha2)) ? e.point(ha2) : null,
                ];
            }
        };
        return e;
    }
    la.ellipse = ellipse;
})(la || (la = {}));
var la;
(function (la) {
    la.EPSILON = 1E-6;
})(la || (la = {}));
var la;
(function (la) {
    var mat3;
    (function (mat3) {
        function create(src) {
            var dest = new Float32Array(6);
            if (src) {
                dest[0] = src[0];
                dest[1] = src[1];
                dest[2] = src[2];
                dest[3] = src[3];
                dest[4] = src[4];
                dest[5] = src[5];
            }
            else {
                dest[0] = dest[1] = dest[2] = dest[3] = dest[4] = dest[5] = 0;
            }
            return dest;
        }
        mat3.create = create;
        function copyTo(src, dest) {
            dest[0] = src[0];
            dest[1] = src[1];
            dest[2] = src[2];
            dest[3] = src[3];
            dest[4] = src[4];
            dest[5] = src[5];
            return dest;
        }
        mat3.copyTo = copyTo;
        function init(dest, m11, m12, m21, m22, x0, y0) {
            dest[0] = m11;
            dest[1] = m12;
            dest[2] = m21;
            dest[3] = m22;
            dest[4] = x0;
            dest[5] = y0;
            return dest;
        }
        mat3.init = init;
        function identity(dest) {
            if (!dest)
                dest = create();
            dest[0] = 1;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 1;
            dest[4] = 0;
            dest[5] = 0;
            return dest;
        }
        mat3.identity = identity;
        function equal(a, b) {
            return a === b || (Math.abs(a[0] - b[0]) < la.EPSILON &&
                Math.abs(a[1] - b[1]) < la.EPSILON &&
                Math.abs(a[2] - b[2]) < la.EPSILON &&
                Math.abs(a[3] - b[3]) < la.EPSILON &&
                Math.abs(a[4] - b[4]) < la.EPSILON &&
                Math.abs(a[5] - b[5]) < la.EPSILON);
        }
        mat3.equal = equal;
        function multiply(a, b, dest) {
            if (!dest)
                dest = a;
            var a11 = a[0], a12 = a[1], a21 = a[2], a22 = a[3], ax0 = a[4], ay0 = a[5], b11 = b[0], b12 = b[1], b21 = b[2], b22 = b[3], bx0 = b[4], by0 = b[5];
            dest[0] = a11 * b11 + a12 * b21;
            dest[1] = a11 * b12 + a12 * b22;
            dest[2] = a21 * b11 + a22 * b21;
            dest[3] = a21 * b12 + a22 * b22;
            dest[4] = a11 * bx0 + a12 * by0 + ax0;
            dest[5] = a21 * bx0 + a22 * by0 + ay0;
            return dest;
        }
        mat3.multiply = multiply;
        function inverse(mat, dest) {
            if (Math.abs(mat[1]) < la.EPSILON && Math.abs(mat[2]) < la.EPSILON)
                return simple_inverse(mat, dest);
            else
                return complex_inverse(mat, dest);
        }
        mat3.inverse = inverse;
        function transformVec2(mat, vec, dest) {
            if (!dest)
                dest = vec;
            var x = vec[0], y = vec[1];
            dest[0] = (mat[0] * x) + (mat[1] * y) + mat[4];
            dest[1] = (mat[2] * x) + (mat[3] * y) + mat[5];
            return dest;
        }
        mat3.transformVec2 = transformVec2;
        function transformVec2s(mat) {
            var vecs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                vecs[_i - 1] = arguments[_i];
            }
            for (var i = vecs.length - 1; i >= 0; i--) {
                transformVec2(mat, vecs[i]);
            }
        }
        mat3.transformVec2s = transformVec2s;
        function createTranslate(x, y, dest) {
            if (!dest)
                dest = create();
            dest[0] = 1;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 1;
            dest[4] = x;
            dest[5] = y;
            return dest;
        }
        mat3.createTranslate = createTranslate;
        function translate(mat, x, y) {
            mat[4] += x;
            mat[5] += y;
            return mat;
        }
        mat3.translate = translate;
        function createScale(sx, sy, dest) {
            if (!dest)
                dest = create();
            dest[0] = sx;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = sy;
            dest[4] = 0;
            dest[5] = 0;
            return dest;
        }
        mat3.createScale = createScale;
        function scale(mat, sx, sy) {
            mat[0] *= sx;
            mat[2] *= sx;
            mat[4] *= sx;
            mat[1] *= sy;
            mat[3] *= sy;
            mat[5] *= sy;
            return mat;
        }
        mat3.scale = scale;
        function createRotate(angleRad, dest) {
            if (!dest)
                dest = create();
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
        mat3.createRotate = createRotate;
        function createSkew(angleRadX, angleRadY, dest) {
            if (!dest)
                dest = create();
            dest[0] = 1;
            dest[1] = Math.tan(angleRadX);
            dest[2] = Math.tan(angleRadY);
            dest[3] = 1;
            dest[4] = 0;
            dest[5] = 0;
            return dest;
        }
        mat3.createSkew = createSkew;
        function preapply(dest, mat) {
            return multiply(dest, mat, dest);
        }
        mat3.preapply = preapply;
        function apply(dest, mat) {
            return multiply(mat, dest, dest);
        }
        mat3.apply = apply;
        function simple_inverse(mat, dest) {
            var m11 = mat[0];
            if (Math.abs(m11) < la.EPSILON)
                return null;
            var m22 = mat[3];
            if (Math.abs(m22) < la.EPSILON)
                return null;
            if (!dest) {
                dest = mat;
            }
            else {
                dest[1] = mat[1];
                dest[2] = mat[2];
            }
            var x0 = -mat[4];
            var y0 = -mat[5];
            if (Math.abs(m11 - 1) > la.EPSILON) {
                m11 = 1 / m11;
                x0 *= m11;
            }
            if (Math.abs(m22 - 1) > la.EPSILON) {
                m22 = 1 / m22;
                y0 *= m22;
            }
            dest[0] = m11;
            dest[3] = m22;
            dest[4] = x0;
            dest[5] = y0;
            return dest;
        }
        function complex_inverse(mat, dest) {
            if (!dest)
                dest = mat;
            var m11 = mat[0], m12 = mat[1], m21 = mat[2], m22 = mat[3];
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
    })(mat3 = la.mat3 || (la.mat3 = {}));
})(la || (la = {}));
var la;
(function (la) {
    var padding;
    (function (padding) {
        function init(l, t, r, b, dest) {
            if (!dest)
                return { left: l, top: t, right: r, bottom: b };
            dest.left = l;
            dest.top = t;
            dest.right = r;
            dest.bottom = b;
            return dest;
        }
        padding.init = init;
        function copyTo(src, dest) {
            if (!dest) {
                return {
                    left: src.left,
                    top: src.top,
                    right: src.right,
                    bottom: src.bottom
                };
            }
            else {
                dest.left = src.left;
                dest.top = src.top;
                dest.right = src.right;
                dest.bottom = src.bottom;
                return dest;
            }
        }
        padding.copyTo = copyTo;
        function equal(r1, r2) {
            return r1.left === r2.left
                && r1.top === r2.top
                && r1.right === r2.right
                && r1.bottom === r2.bottom;
        }
        padding.equal = equal;
        function isEmpty(src) {
            return src.left === 0
                && src.top === 0
                && src.right === 0
                && src.bottom === 0;
        }
        padding.isEmpty = isEmpty;
    })(padding = la.padding || (la.padding = {}));
})(la || (la = {}));
var la;
(function (la) {
    var vec2;
    (function (vec2) {
        function create(x, y) {
            var dest = new Float32Array(2);
            dest[0] = x;
            dest[1] = y;
            return dest;
        }
        vec2.create = create;
        function init(x, y, dest) {
            if (!dest)
                dest = new Float32Array(2);
            dest[0] = x;
            dest[1] = y;
            return dest;
        }
        vec2.init = init;
        function clone(src, dest) {
            return init(src[0], src[1], dest);
        }
        vec2.clone = clone;
        function reverse(src, dest) {
            if (!dest)
                dest = src;
            dest[0] = -src[0];
            dest[1] = -src[1];
            return dest;
        }
        vec2.reverse = reverse;
        function orthogonal(src, dest) {
            if (!dest)
                dest = src;
            var x = src[0], y = src[1];
            dest[0] = -y;
            dest[1] = x;
            return dest;
        }
        vec2.orthogonal = orthogonal;
        function normalize(src, dest) {
            if (!dest)
                dest = src;
            var x = src[0], y = src[1];
            var len = Math.sqrt(x * x + y * y);
            dest[0] = x / len;
            dest[1] = y / len;
            return dest;
        }
        vec2.normalize = normalize;
        function rotate(src, theta, dest) {
            if (!dest)
                dest = src;
            var c = Math.cos(theta);
            var s = Math.sin(theta);
            var x = src[0];
            var y = src[1];
            dest[0] = x * c - y * s;
            dest[1] = x * s + y * c;
            return dest;
        }
        vec2.rotate = rotate;
        function midpoint(p1, p2, dest) {
            if (!dest)
                dest = p1;
            var x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1];
            dest[0] = (x1 + x2) / 2.0;
            dest[1] = (y1 + y2) / 2.0;
            return dest;
        }
        vec2.midpoint = midpoint;
        function angleBetween(u, v) {
            var ux = u[0], uy = u[1], vx = v[0], vy = v[1];
            var num = ux * vx + uy * vy;
            var den = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);
            return Math.acos(num / den);
        }
        vec2.angleBetween = angleBetween;
        function isClockwiseTo(v1, v2) {
            var theta = angleBetween(v1, v2);
            var nv1 = normalize(clone(v1));
            var nv2 = normalize(clone(v2));
            rotate(nv1, theta);
            var nx = Math.abs(nv1[0] - nv2[0]);
            var ny = Math.abs(nv1[1] - nv2[1]);
            return nx < la.EPSILON
                && ny < la.EPSILON;
        }
        vec2.isClockwiseTo = isClockwiseTo;
        function intersection(s1, d1, s2, d2) {
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
        vec2.intersection = intersection;
    })(vec2 = la.vec2 || (la.vec2 = {}));
})(la || (la = {}));
var la;
(function (la) {
    var rect;
    (function (rect) {
        function init(x, y, width, height, dest) {
            if (!dest)
                return { x: x, y: y, width: width, height: height };
            dest.x = x;
            dest.y = y;
            dest.width = width;
            dest.height = height;
            return dest;
        }
        rect.init = init;
        function copyTo(src, dest) {
            if (!dest) {
                return {
                    x: src.x,
                    y: src.y,
                    width: src.width,
                    height: src.height
                };
            }
            else {
                dest.x = src.x;
                dest.y = src.y;
                dest.width = src.width;
                dest.height = src.height;
                return dest;
            }
        }
        rect.copyTo = copyTo;
        var p1 = la.vec2.create(0, 0);
        var p2 = la.vec2.create(0, 0);
        var p3 = la.vec2.create(0, 0);
        var p4 = la.vec2.create(0, 0);
        function transform(src, transform, dest) {
            if (!transform)
                return dest;
            if (!dest)
                dest = { x: 0, y: 0, width: 0, height: 0 };
            var x = src.x;
            var y = src.y;
            var w = src.width;
            var h = src.height;
            la.vec2.init(x, y, p1);
            la.vec2.init(x + w, y, p2);
            la.vec2.init(x + w, y + h, p3);
            la.vec2.init(x, y + h, p4);
            la.mat3.transformVec2(transform, p1);
            la.mat3.transformVec2(transform, p2);
            la.mat3.transformVec2(transform, p3);
            la.mat3.transformVec2(transform, p4);
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
        rect.transform = transform;
        function equal(r1, r2) {
            return r1.x === r2.x
                && r1.y === r2.y
                && r1.width === r2.width
                && r1.height === r2.height;
        }
        rect.equal = equal;
        function isEmpty(src) {
            return src.width === 0
                || src.height === 0;
        }
        rect.isEmpty = isEmpty;
        function union(r1, r2, dest) {
            if (!dest)
                dest = r1;
            if (r2.width <= 0 || r2.height <= 0)
                return dest;
            if (dest.width <= 0 || dest.height <= 0)
                return rect.copyTo(r2, dest);
            var x1 = r1.x, x2 = r2.x, y1 = r1.y, y2 = r2.y, w1 = r1.width, w2 = r2.width, h1 = r1.height, h2 = r2.height;
            dest.x = Math.min(x1, x2);
            dest.y = Math.min(y1, y2);
            dest.width = Math.max(x1 + w1, x2 + w2) - dest.x;
            dest.height = Math.max(y1 + h1, y2 + h2) - dest.y;
            return dest;
        }
        rect.union = union;
        function intersection(r1, r2, dest) {
            if (!dest)
                dest = r1;
            var x = Math.max(r1.x, r2.x);
            var y = Math.max(r1.y, r2.y);
            dest.width = Math.max(0, Math.min(r1.x + r1.width, r2.x + r2.width) - x);
            dest.height = Math.max(0, Math.min(r1.y + r1.height, r2.y + r2.height) - y);
            dest.x = x;
            dest.y = y;
            return dest;
        }
        rect.intersection = intersection;
        function isContainedIn(src, test) {
            var sl = src.x;
            var st = src.y;
            var sr = src.x + src.width;
            var sb = src.y + src.height;
            var tl = test.x;
            var tt = test.y;
            var tr = test.x + test.width;
            var tb = test.y + test.height;
            if (sl < tl || st < tt || sl > tr || st > tb)
                return false;
            if (sr < tl || sb < tt || sr > tr || sb > tb)
                return false;
            return true;
        }
        rect.isContainedIn = isContainedIn;
        function containsPoint(rect1, p) {
            return rect1.x <= p.x
                && rect1.y <= p.y
                && (rect1.x + rect1.width) >= p.x
                && (rect1.y + rect1.height) >= p.y;
        }
        rect.containsPoint = containsPoint;
        function containsVec2(rect1, v) {
            var vx = v[0], vy = v[1];
            return rect1.x <= vx
                && rect1.y <= vy
                && (rect1.x + rect1.width) >= vx
                && (rect1.y + rect1.height) >= vy;
        }
        rect.containsVec2 = containsVec2;
        function roundOut(dest) {
            var x = Math.floor(dest.x);
            var y = Math.floor(dest.y);
            dest.width = Math.ceil(dest.x + dest.width) - x;
            dest.height = Math.ceil(dest.y + dest.height) - y;
            dest.x = x;
            dest.y = y;
        }
        rect.roundOut = roundOut;
        function roundIn(dest) {
            var x = Math.ceil(dest.x);
            var y = Math.ceil(dest.y);
            dest.width = Math.floor(dest.x + dest.width) - x;
            dest.height = Math.floor(dest.y + dest.height) - y;
            dest.x = x;
            dest.y = y;
            return dest;
        }
        rect.roundIn = roundIn;
        function grow(src, padding, dest) {
            if (!dest)
                dest = src;
            dest.x -= padding.left;
            dest.y -= padding.top;
            dest.width += padding.left + padding.right;
            dest.height += padding.top + padding.bottom;
        }
        rect.grow = grow;
        function shrink(src, padding, dest) {
            if (!dest)
                dest = src;
            dest.x += padding.left;
            dest.y += padding.top;
            dest.width -= padding.left + padding.right;
            dest.height -= padding.top + padding.bottom;
        }
        rect.shrink = shrink;
    })(rect = la.rect || (la.rect = {}));
})(la || (la = {}));

//# sourceMappingURL=la.js.map
