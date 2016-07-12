namespace la.padding {
    export function init(l: number, t: number, r: number, b: number, dest?: IPadding): IPadding {
        if (!dest)
            return {left: l, top: t, right: r, bottom: b};
        dest.left = l;
        dest.top = t;
        dest.right = r;
        dest.bottom = b;
        return dest;
    }

    export function copyTo(src: IPadding, dest?: IPadding): IPadding {
        if (!dest) {
            return {
                left: src.left,
                top: src.top,
                right: src.right,
                bottom: src.bottom
            };
        } else {
            dest.left = src.left;
            dest.top = src.top;
            dest.right = src.right;
            dest.bottom = src.bottom;
            return dest;
        }
    }

    export function equal(r1: IPadding, r2: IPadding): boolean {
        return r1.left === r2.left
            && r1.top === r2.top
            && r1.right === r2.right
            && r1.bottom === r2.bottom;
    }

    export function isEmpty(src: IPadding): boolean {
        return src.left === 0
            && src.top === 0
            && src.right === 0
            && src.bottom === 0;
    }
}