class Cube {

    constructor() {
        this.rgba = [1,1,1,1];
        this.scale = [1,1,1];
        this.translate = [0,0,0];
        this.loadCube();
    }

    loadCube() {

        const vertices = [];
        vertices.push(  0,0,0, 0,0,
                        0,1,0, 0,1,
                        1,1,0, 1,1);
        vertices.push(  0,0,0, 0,0,
                        1,1,0, 1,1,
                        1,0,0, 1,0);



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

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // drawCube(transMat){
    //
    //     // Front
    //     drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
    //     drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);
    //
    //     // Top
    //     drawTriangle3D([0,1,0, 0,1,1, 1,1,1]);
    //     drawTriangle3D([0,1,0, 1,1,1, 1,1,0]);
    //
    //     // Bottom
    //     drawTriangle3D( [0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,0.0 ]);
    //     drawTriangle3D( [1.0,0.0,1.0, 0.0,0.0,1.0, 1.0,0.0,0.0 ]);
    //
    //     // Left
    //     drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,0.0,1.0 ]);
    //     drawTriangle3D( [0.0,1.0,1.0, 0.0,1.0,0.0, 0.0,0.0,1.0 ]);
    //
    //     // Right
    //     drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,1.0 ]);
    //     drawTriangle3D( [1.0,1.0,1.0, 1.0,1.0,0.0, 1.0,0.0,1.0 ]);
    //
    //     // Back
    //     drawTriangle3D( [0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0 ]);
    //     drawTriangle3D( [0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0 ]);
    // }
}
