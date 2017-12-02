class M4 {

    static projection(width, height, depth) {
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ];
    }

    static multiply(a, b) {
        let a00 = a[0 * 4 + 0];
        let a01 = a[0 * 4 + 1];
        let a02 = a[0 * 4 + 2];
        let a03 = a[0 * 4 + 3];
        let a10 = a[1 * 4 + 0];
        let a11 = a[1 * 4 + 1];
        let a12 = a[1 * 4 + 2];
        let a13 = a[1 * 4 + 3];
        let a20 = a[2 * 4 + 0];
        let a21 = a[2 * 4 + 1];
        let a22 = a[2 * 4 + 2];
        let a23 = a[2 * 4 + 3];
        let a30 = a[3 * 4 + 0];
        let a31 = a[3 * 4 + 1];
        let a32 = a[3 * 4 + 2];
        let a33 = a[3 * 4 + 3];
        let b00 = b[0 * 4 + 0];
        let b01 = b[0 * 4 + 1];
        let b02 = b[0 * 4 + 2];
        let b03 = b[0 * 4 + 3];
        let b10 = b[1 * 4 + 0];
        let b11 = b[1 * 4 + 1];
        let b12 = b[1 * 4 + 2];
        let b13 = b[1 * 4 + 3];
        let b20 = b[2 * 4 + 0];
        let b21 = b[2 * 4 + 1];
        let b22 = b[2 * 4 + 2];
        let b23 = b[2 * 4 + 3];
        let b30 = b[3 * 4 + 0];
        let b31 = b[3 * 4 + 1];
        let b32 = b[3 * 4 + 2];
        let b33 = b[3 * 4 + 3];
        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
        ];
    }

    static inverse(m) {

        const s0 = m[0] * m[5] - m[4] * m[1];
        const s1 = m[0] * m[6] - m[4] * m[2];
        const s2 = m[0] * m[7] - m[4] * m[3];
        const s3 = m[1] * m[6] - m[5] * m[2];
        const s4 = m[1] * m[7] - m[5] * m[3];
        const s5 = m[2] * m[7] - m[6] * m[3];
    
        const c5 = m[10] * m[15] - m[14] * m[11];
        const c4 = m[9] * m[15] - m[13] * m[11];
        const c3 = m[9] * m[14] - m[13] * m[10];
        const c2 = m[8] * m[15] - m[12] * m[11];
        const c1 = m[8] * m[14] - m[12] * m[10];
        const c0 = m[8] * m[13] - m[12] * m[9];
    
        const determinant = 1 / (s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0);
    
        return [
            (m[5] * c5 - m[6] * c4 + m[7] * c3) * determinant,
            (-m[1] * c5 + m[2] * c4 - m[3] * c3) * determinant,
            (m[13] * s5 - m[14] * s4 + m[15] * s3) * determinant,
            (-m[9] * s5 + m[10] * s4 - m[11] * s3) * determinant,
    
            (-m[4] * c5 + m[6] * c2 - m[7] * c1) * determinant,
            (m[0] * c5 - m[2] * c2 + m[3] * c1) * determinant,
            (-m[12] * s5 + m[14] * s2 - m[15] * s1) * determinant,
            (m[8] * s5 - m[10] * s2 + m[11] * s1) * determinant,
    
            (m[4] * c4 - m[5] * c2 + m[7] * c0) * determinant,
            (-m[0] * c4 + m[1] * c2 - m[3] * c0) * determinant,
            (m[12] * s4 - m[13] * s2 + m[15] * s0) * determinant,
            (-m[8] * s4 + m[9] * s2 - m[11] * s0) * determinant,
    
            (-m[4] * c3 + m[5] * c1 - m[6] * c0) * determinant,
            (m[0] * c3 - m[1] * c1 + m[2] * c0) * determinant,
            (-m[12] * s3 + m[13] * s1 - m[14] * s0) * determinant,
            (m[8] * s3 - m[9] * s1 + m[10] * s0) * determinant,
        ];
    }
    
    static translation(tx, ty, tz) {
        return [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            tx, ty, tz, 1,
        ];
    }
    
    static xRotation(angleInRadians) {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);
        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ];
    }
    
    static yRotation(angleInRadians) {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ];
    }
    
    static zRotation(angleInRadians) {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);
        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }
    
    static scaling(sx, sy, sz) {
        return [
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        ];
    }

    static transformVector(m, v, dst) {
        dst = dst || new Float32Array(4);
        for (let i = 0; i < 4; ++i) {
            dst[i] = 0.0;
            for (let j = 0; j < 4; ++j) {
                dst[i] += v[j] * m[j * 4 + i];
            }
        }
        return dst;
    }
    
    static translate(m, tx, ty, tz) {
        return this.multiply(m, this.translation(tx, ty, tz));
    }
    
    static xRotate(m, angleInRadians) {
        return this.multiply(m, this.xRotation(angleInRadians));
    }
    
    static yRotate(m, angleInRadians) {
        return this.multiply(m, this.yRotation(angleInRadians));
    }
    
    static zRotate(m, angleInRadians) {
        return this.multiply(m, this.zRotation(angleInRadians));
    }
    
    static scale(m, sx, sy, sz) {
        return this.multiply(m, this.scaling(sx, sy, sz));
    }
}

export default M4;