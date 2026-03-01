class Toby {

    constructor() {
        this.loadQuad();
    }

    loadQuad() {
        const vertices = [];
        vertices.push(  0,0,0, 0,0, // xyz, uv
            1,1,0, 1,1,
            1,0,0, 1,0);
        vertices.push(  0,0,0, 0,0,
            0,1,0, 0,1,
            1,1,0, 1,1);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        const fSize = 4;

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, fSize * 5, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, fSize * 5, fSize * 3);
        gl.enableVertexAttribArray(a_UV);
    }

    getPosition(time) {
        return Math.sin(time);
    }

    decideTex(time) {
        if (Math.sin(time) > 0) {
            loadTexture(g_toby);
        } else {
            loadTexture(g_jump);
        }
    }

    render() {
        const time = performance.now()/(500 - g_speed);
        this.decideTex(time*3);
        const transMat = new Matrix4();
        transMat.setRotate(45,0,1,0);

        const turn = Math.sin(time) > 0 ? 3: -3;
        transMat.translate(-1.5+this.getPosition(time), 0, 1+this.getPosition(time + Math.PI/2));
        transMat.scale(turn,3,0);
        transMat.translate(turn > 0 ? 0 : -1, 0, 0);
        gl.uniformMatrix4fv(u_ModelMatrix, false, transMat.elements);

        // color
        gl.uniform4f(u_FragColor, 1,1,1,1);
        gl.uniform1f(u_TexColorWeight, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

