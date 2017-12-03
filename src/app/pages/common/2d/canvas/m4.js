class M4 {

    static orthographic(left, right, bottom, top, near, far, dst) {
        dst = dst || new Float32Array(16);
    
        dst[ 0] = 2 / (right - left);
        dst[ 1] = 0;
        dst[ 2] = 0;
        dst[ 3] = 0;
        dst[ 4] = 0;
        dst[ 5] = 2 / (top - bottom);
        dst[ 6] = 0;
        dst[ 7] = 0;
        dst[ 8] = 0;
        dst[ 9] = 0;
        dst[10] = 2 / (near - far);
        dst[11] = 0;
        dst[12] = (left + right) / (left - right);
        dst[13] = (bottom + top) / (bottom - top);
        dst[14] = (near + far) / (near - far);
        dst[15] = 1;
    
        return dst;
    }

    static multiply(a, b, dst) {
        dst = dst || new Float32Array(16);
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
        dst[ 0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        dst[ 1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        dst[ 2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        dst[ 3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        dst[ 4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        dst[ 5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        dst[ 6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        dst[ 7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        dst[ 8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        dst[ 9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        dst[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        dst[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        dst[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        dst[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        dst[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        dst[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
        return dst;
    }

    static transpose(m, dst) {
        dst = dst || new Float32Array(16);
    
        dst[ 0] = m[0];
        dst[ 1] = m[4];
        dst[ 2] = m[8];
        dst[ 3] = m[12];
        dst[ 4] = m[1];
        dst[ 5] = m[5];
        dst[ 6] = m[9];
        dst[ 7] = m[13];
        dst[ 8] = m[2];
        dst[ 9] = m[6];
        dst[10] = m[10];
        dst[11] = m[14];
        dst[12] = m[3];
        dst[13] = m[7];
        dst[14] = m[11];
        dst[15] = m[15];
    
        return dst;
    }

    static inverse(m, dst) {

        dst = dst || new Float32Array(16);

        let m00 = m[0 * 4 + 0];
        let m01 = m[0 * 4 + 1];
        let m02 = m[0 * 4 + 2];
        let m03 = m[0 * 4 + 3];
        let m10 = m[1 * 4 + 0];
        let m11 = m[1 * 4 + 1];
        let m12 = m[1 * 4 + 2];
        let m13 = m[1 * 4 + 3];
        let m20 = m[2 * 4 + 0];
        let m21 = m[2 * 4 + 1];
        let m22 = m[2 * 4 + 2];
        let m23 = m[2 * 4 + 3];
        let m30 = m[3 * 4 + 0];
        let m31 = m[3 * 4 + 1];
        let m32 = m[3 * 4 + 2];
        let m33 = m[3 * 4 + 3];
        let tmp_0  = m22 * m33;
        let tmp_1  = m32 * m23;
        let tmp_2  = m12 * m33;
        let tmp_3  = m32 * m13;
        let tmp_4  = m12 * m23;
        let tmp_5  = m22 * m13;
        let tmp_6  = m02 * m33;
        let tmp_7  = m32 * m03;
        let tmp_8  = m02 * m23;
        let tmp_9  = m22 * m03;
        let tmp_10 = m02 * m13;
        let tmp_11 = m12 * m03;
        let tmp_12 = m20 * m31;
        let tmp_13 = m30 * m21;
        let tmp_14 = m10 * m31;
        let tmp_15 = m30 * m11;
        let tmp_16 = m10 * m21;
        let tmp_17 = m20 * m11;
        let tmp_18 = m00 * m31;
        let tmp_19 = m30 * m01;
        let tmp_20 = m00 * m21;
        let tmp_21 = m20 * m01;
        let tmp_22 = m00 * m11;
        let tmp_23 = m10 * m01;
    
        let t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        let t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        let t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        let t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
    
        let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
    
        dst[0] = d * t0;
        dst[1] = d * t1;
        dst[2] = d * t2;
        dst[3] = d * t3;
        dst[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
        dst[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
        dst[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
        dst[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
        dst[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
        dst[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
        dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
        dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
        dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
        dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
        dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
        dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
    
        return dst;
    }
    
    static translation(tx, ty, tz, dst) {
        dst = dst || new Float32Array(16);
        
        dst[ 0] = 1;
        dst[ 1] = 0;
        dst[ 2] = 0;
        dst[ 3] = 0;
        dst[ 4] = 0;
        dst[ 5] = 1;
        dst[ 6] = 0;
        dst[ 7] = 0;
        dst[ 8] = 0;
        dst[ 9] = 0;
        dst[10] = 1;
        dst[11] = 0;
        dst[12] = tx;
        dst[13] = ty;
        dst[14] = tz;
        dst[15] = 1;
        
        return dst;
    }
    
    static xRotation(angleInRadians, dst) {
        dst = dst || new Float32Array(16);
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);
    
        dst[ 0] = 1;
        dst[ 1] = 0;
        dst[ 2] = 0;
        dst[ 3] = 0;
        dst[ 4] = 0;
        dst[ 5] = c;
        dst[ 6] = s;
        dst[ 7] = 0;
        dst[ 8] = 0;
        dst[ 9] = -s;
        dst[10] = c;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;
    
        return dst;
    }

    static xRotate(m, angleInRadians, dst) {
        dst = dst || new Float32Array(16);
        
        let m10 = m[4];
        let m11 = m[5];
        let m12 = m[6];
        let m13 = m[7];
        let m20 = m[8];
        let m21 = m[9];
        let m22 = m[10];
        let m23 = m[11];
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);
        
        dst[4]  = c * m10 + s * m20;
        dst[5]  = c * m11 + s * m21;
        dst[6]  = c * m12 + s * m22;
        dst[7]  = c * m13 + s * m23;
        dst[8]  = c * m20 - s * m10;
        dst[9]  = c * m21 - s * m11;
        dst[10] = c * m22 - s * m12;
        dst[11] = c * m23 - s * m13;
        
        if (m !== dst) {
            dst[ 0] = m[ 0];
            dst[ 1] = m[ 1];
            dst[ 2] = m[ 2];
            dst[ 3] = m[ 3];
            dst[12] = m[12];
            dst[13] = m[13];
            dst[14] = m[14];
            dst[15] = m[15];
        }
        
        return dst;
    }
    
    static yRotation(angleInRadians, dst) {
        dst = dst || new Float32Array(16);
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);
    
        dst[ 0] = c;
        dst[ 1] = 0;
        dst[ 2] = -s;
        dst[ 3] = 0;
        dst[ 4] = 0;
        dst[ 5] = 1;
        dst[ 6] = 0;
        dst[ 7] = 0;
        dst[ 8] = s;
        dst[ 9] = 0;
        dst[10] = c;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;
    
        return dst;
    }

    static yRotate(m, angleInRadians, dst) {
        dst = dst || new Float32Array(16);
        
        let m00 = m[0 * 4 + 0];
        let m01 = m[0 * 4 + 1];
        let m02 = m[0 * 4 + 2];
        let m03 = m[0 * 4 + 3];
        let m20 = m[2 * 4 + 0];
        let m21 = m[2 * 4 + 1];
        let m22 = m[2 * 4 + 2];
        let m23 = m[2 * 4 + 3];
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);
        
        dst[ 0] = c * m00 - s * m20;
        dst[ 1] = c * m01 - s * m21;
        dst[ 2] = c * m02 - s * m22;
        dst[ 3] = c * m03 - s * m23;
        dst[ 8] = c * m20 + s * m00;
        dst[ 9] = c * m21 + s * m01;
        dst[10] = c * m22 + s * m02;
        dst[11] = c * m23 + s * m03;
        
        if (m !== dst) {
            dst[ 4] = m[ 4];
            dst[ 5] = m[ 5];
            dst[ 6] = m[ 6];
            dst[ 7] = m[ 7];
            dst[12] = m[12];
            dst[13] = m[13];
            dst[14] = m[14];
            dst[15] = m[15];
        }
        
        return dst;
    }
    
    static zRotation(angleInRadians, dst) {
        dst = dst || new Float32Array(16);
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);
    
        dst[ 0] = c;
        dst[ 1] = s;
        dst[ 2] = 0;
        dst[ 3] = 0;
        dst[ 4] = -s;
        dst[ 5] = c;
        dst[ 6] = 0;
        dst[ 7] = 0;
        dst[ 8] = 0;
        dst[ 9] = 0;
        dst[10] = 1;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;
    
        return dst;
    }

    static zRotate(m, angleInRadians, dst) {
        dst = dst || new Float32Array(16);
        
        let m00 = m[0 * 4 + 0];
        let m01 = m[0 * 4 + 1];
        let m02 = m[0 * 4 + 2];
        let m03 = m[0 * 4 + 3];
        let m10 = m[1 * 4 + 0];
        let m11 = m[1 * 4 + 1];
        let m12 = m[1 * 4 + 2];
        let m13 = m[1 * 4 + 3];
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);
        
        dst[ 0] = c * m00 + s * m10;
        dst[ 1] = c * m01 + s * m11;
        dst[ 2] = c * m02 + s * m12;
        dst[ 3] = c * m03 + s * m13;
        dst[ 4] = c * m10 - s * m00;
        dst[ 5] = c * m11 - s * m01;
        dst[ 6] = c * m12 - s * m02;
        dst[ 7] = c * m13 - s * m03;
        
        if (m !== dst) {
            dst[ 8] = m[ 8];
            dst[ 9] = m[ 9];
            dst[10] = m[10];
            dst[11] = m[11];
            dst[12] = m[12];
            dst[13] = m[13];
            dst[14] = m[14];
            dst[15] = m[15];
        }
        
        return dst;
    }
    
    static scaling(sx, sy, sz, dst) {
        dst = dst || new Float32Array(16);
        
        dst[ 0] = sx;
        dst[ 1] = 0;
        dst[ 2] = 0;
        dst[ 3] = 0;
        dst[ 4] = 0;
        dst[ 5] = sy;
        dst[ 6] = 0;
        dst[ 7] = 0;
        dst[ 8] = 0;
        dst[ 9] = 0;
        dst[10] = sz;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;
        
        return dst;
    }

    static scale(m, sx, sy, sz, dst) {
        dst = dst || new Float32Array(16);
        
        dst[ 0] = sx * m[0 * 4 + 0];
        dst[ 1] = sx * m[0 * 4 + 1];
        dst[ 2] = sx * m[0 * 4 + 2];
        dst[ 3] = sx * m[0 * 4 + 3];
        dst[ 4] = sy * m[1 * 4 + 0];
        dst[ 5] = sy * m[1 * 4 + 1];
        dst[ 6] = sy * m[1 * 4 + 2];
        dst[ 7] = sy * m[1 * 4 + 3];
        dst[ 8] = sz * m[2 * 4 + 0];
        dst[ 9] = sz * m[2 * 4 + 1];
        dst[10] = sz * m[2 * 4 + 2];
        dst[11] = sz * m[2 * 4 + 3];
        
        if (m !== dst) {
            dst[12] = m[12];
            dst[13] = m[13];
            dst[14] = m[14];
            dst[15] = m[15];
        }
        
        return dst;
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
    
    static translate(m, tx, ty, tz, dst) {
        dst = dst || new Float32Array(16);
        
        let m00 = m[0];
        let m01 = m[1];
        let m02 = m[2];
        let m03 = m[3];
        let m10 = m[1 * 4 + 0];
        let m11 = m[1 * 4 + 1];
        let m12 = m[1 * 4 + 2];
        let m13 = m[1 * 4 + 3];
        let m20 = m[2 * 4 + 0];
        let m21 = m[2 * 4 + 1];
        let m22 = m[2 * 4 + 2];
        let m23 = m[2 * 4 + 3];
        let m30 = m[3 * 4 + 0];
        let m31 = m[3 * 4 + 1];
        let m32 = m[3 * 4 + 2];
        let m33 = m[3 * 4 + 3];
        
        if (m !== dst) {
            dst[ 0] = m00;
            dst[ 1] = m01;
            dst[ 2] = m02;
            dst[ 3] = m03;
            dst[ 4] = m10;
            dst[ 5] = m11;
            dst[ 6] = m12;
            dst[ 7] = m13;
            dst[ 8] = m20;
            dst[ 9] = m21;
            dst[10] = m22;
            dst[11] = m23;
        }
        
        dst[12] = m00 * tx + m10 * ty + m20 * tz + m30;
        dst[13] = m01 * tx + m11 * ty + m21 * tz + m31;
        dst[14] = m02 * tx + m12 * ty + m22 * tz + m32;
        dst[15] = m03 * tx + m13 * ty + m23 * tz + m33;
        
        return dst;
    }
}

export default M4;