namespace la {
    var PI2 = 2 * Math.PI;
    var PI1_2 = Math.PI / 2;

    export interface IEllipse {
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
        /// Find ellipse extrema within arc defined by [start angle, end angle] sweeping anti-clockwise/clockwise
        /// [0] and [1] will be vertical tangents
        /// [2] and [3] will be horizontal tangents
        /// If not contained within arc, points will be null
        extrema(sa: number, ea: number, ac: boolean): Float32Array[];
    }
    export function ellipse(cx: number, cy: number, rx: number, ry: number, phi: number): IEllipse {
        var sphi = Math.sin(phi);
        var cphi = Math.cos(phi);

        var da = rx * cphi;
        var db = -ry * sphi;
        var dc = rx * sphi;
        var dd = ry * cphi;

        function flatTangentAngles(): number[] {
            // vertical tangent [tan(theta) = b/a]
            // 2 angles on opposite side of ellipse
            var va1 = Math.atan2(db, da);
            if (va1 < 0)
                va1 += PI2;
            var va2 = va1 >= Math.PI ? va1 - Math.PI : va1 + Math.PI;

            // horizontal tangent [tan(theta) = d/c]
            // 2 angles on opposite side of ellipse
            var ha1 = Math.atan2(dd, dc);
            if (ha1 < 0)
                ha1 += PI2;
            var ha2 = ha1 >= Math.PI ? ha1 - Math.PI : ha1 + Math.PI;

            return [va1, va2, ha1, ha2];
        }

        function normalizeAngle(angle: number): number {
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
            x(theta: number): number {
                var stheta = Math.sin(theta);
                var ctheta = Math.cos(theta);
                return (cphi * rx * ctheta) + (-sphi * ry * stheta) + cx;
            },
            y(theta: number): number {
                var stheta = Math.sin(theta);
                var ctheta = Math.cos(theta);
                return (sphi * rx * ctheta) + (cphi * ry * stheta) + cy;
            },
            point(theta: number): Float32Array {
                return vec2.create(e.x(theta), e.y(theta));
            },
            normal(theta: number): Float32Array {
                return vec2.rotate(e.tangent(theta), -PI1_2);
            },
            tangent(theta: number): Float32Array {
                var stheta = Math.sin(theta);
                var ctheta = Math.cos(theta);
                return vec2.create(
                    (-da * stheta) + (db * ctheta),
                    (-dc * stheta) + (dd * ctheta)
                );
            },
            extrema(sa: number, ea: number, ac: boolean): Float32Array[] {
                var da = ea - sa;
                var sa = normalizeAngle(sa);
                var ea = normalizeAngle(ea);

                var isContained: (theta: number) => boolean;
                if (sa < ea) {
                    if (ac === true) {
                        isContained = (theta) => (0 <= theta && theta <= sa) || (ea <= theta && theta <= PI2);
                    } else {
                        isContained = (theta) => sa <= theta && theta <= ea;
                    }
                } else if (sa > ea) {
                    if (ac === true) {
                        isContained = (theta) => ea <= theta && theta <= sa;
                    } else {
                        isContained = (theta) => (0 <= theta && theta <= ea) || (sa <= theta && theta <= PI2);
                    }
                } else {
                    if (da > 0) {
                        isContained = (theta) => true;
                    } else {
                        isContained = (theta) => false;
                    }
                }

                var [va1, va2, ha1, ha2] = flatTangentAngles();
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
}
