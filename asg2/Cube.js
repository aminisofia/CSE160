class Cube {

    constructor() {
        this.rgba = [1,1,1,1];
        this.matrix = new Matrix4();
        this.scale = [1,1,1];
        this.translate = [0,0,0];
        this.rotAxis = [0,0,1];
        this.rot = 0;
    }

    setScale(x, y, z) {
        this.scale = [x,y,z];
    }

    setTranslate(x, y, z) {
        this.translate = [x,y,z];
    }

    setRotation(degrees, x, y, z) {
        this.rot = degrees;
        this.rotAxis = [x,y,z];
    }

    getTranslatedMatrix() {
        const transMat = new Matrix4(this.matrix);
        transMat.translate(this.scale[0]*-.5 + this.translate[0], this.scale[1]*-.5 + this.translate[1], this.scale[2]*-.5 + this.translate[2]); // center based on scale
        transMat.rotate(this.rot, this.rotAxis[0], this.rotAxis[1], this.rotAxis[2]);
        return transMat;
    }

    render() {

        const transMat = new Matrix4(this.matrix);

        transMat.translate(this.scale[0]*-.5 + this.translate[0], this.scale[1]*-.5 + this.translate[1], this.scale[2]*-.5 + this.translate[2]); // center based on scale
        transMat.rotate(this.rot, this.rotAxis[0], this.rotAxis[1], this.rotAxis[2]);
        transMat.scale(this.scale[0], this.scale[1], this.scale[2]);

        this.drawCube(transMat);
    }

    drawCube(transMat){
        // var rgba = this.color;
        gl.uniform4f(u_FragColor, this.rgba[0], this.rgba[1], this.rgba[2], this.rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, transMat.elements);

        // Front
        drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);

        gl.uniform4f(u_FragColor, this.rgba[0]*.9, this.rgba[1]*.9, this.rgba[2]*.9, this.rgba[3]);

        // Top
        drawTriangle3D([0,1,0, 0,1,1, 1,1,1]);
        drawTriangle3D([0,1,0, 1,1,1, 1,1,0]);

        // Bottom
        drawTriangle3D( [0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,0.0 ]);
        drawTriangle3D( [1.0,0.0,1.0, 0.0,0.0,1.0, 1.0,0.0,0.0 ]);

        // Left
        drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,0.0,1.0 ]);
        drawTriangle3D( [0.0,1.0,1.0, 0.0,1.0,0.0, 0.0,0.0,1.0 ]);

        // Right
        drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,1.0 ]);
        drawTriangle3D( [1.0,1.0,1.0, 1.0,1.0,0.0, 1.0,0.0,1.0 ]);

        // Back
        drawTriangle3D( [0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0 ]);
        drawTriangle3D( [0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0 ]);


    }
}

function drawTriangle3D(vertices) {
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
