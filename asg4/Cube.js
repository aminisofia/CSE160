class Cube {

    constructor() {
        this.rgba = [1,1,1,1];
        this.scale = [1,1,1];
        this.translate = [0,0,0];
        this.texColorWeight = 0.5;
        this.loadCube();
    }

    loadCube() {

        const vertices = [];

        // front of cube
        vertices.push(  0,0,0, 0,0, // xyz, uv
                        1,1,0, 1,1,
                        1,0,0, 1,0);
        vertices.push(  0,0,0, 0,0,
                        0,1,0, 0,1,
                        1,1,0, 1,1);

        // top of cube
        vertices.push(  0,1,0, 0,0,
                        1,1,0, 1,0,
                        0,1,1, 0,1 );
        vertices.push(  1,1,0, 1,0,
                        0,1,1, 0,1,
                        1,1,1, 1,1 );

        // left side of cube
        vertices.push(  0,0,0, 1,0,
                        0,1,0, 1,1,
                        0,0,1, 0,0 );
        vertices.push(  0,1,1, 0,1,
                        0,1,0, 1,1,
                        0,0,1, 0,0 );

        // right side of cube
        vertices.push(  1,0,0, 0,0,
                        1,1,0, 0,1,
                        1,0,1, 1,0 );
        vertices.push(  1,1,1, 1,1,
                        1,1,0, 0,1,
                        1,0,1, 1,0 );

        // back of cube
        vertices.push(  0,0,1, 1,0,
                        1,1,1, 0,1,
                        1,0,1, 0,0 );
        vertices.push(  0,0,1, 1,0,
                        0,1,1, 1,1,
                        1,1,1, 0,1 );

        //  bottom of cube
        vertices.push(  0,0,0, 0,1,
                        0,0,1, 0,0,
                        1,0,0, 1,1 );
        vertices.push(  1,0,1, 1,0,
                        0,0,1,0,0,
                        1,0,0, 1,1 );

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        const fSize = 4;

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, fSize * 5, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, fSize * 5, fSize * 3);
        gl.enableVertexAttribArray(a_UV);
    }

    render() {

        const transMat = new Matrix4();
        transMat.translate(...this.translate);
        transMat.scale(...this.scale);
        gl.uniformMatrix4fv(u_ModelMatrix, false, transMat.elements);

        // color
        gl.uniform4f(u_FragColor, ...this.rgba);
        gl.uniform1f(u_TexColorWeight, this.texColorWeight);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}

function createCube(translate, scale = [1,1,1], rgba = [1,1,1,1], texColorWeight = 1) {
    g_cube.translate = translate;
    g_cube.scale = scale;
    g_cube.rgba = rgba;
    g_cube.texColorWeight = texColorWeight;

    g_cube.render();
}
