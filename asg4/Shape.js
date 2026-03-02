class Shape {

    constructor() {
        this.rgba = [1,1,1,1];
        this.scale = [1,1,1];
        this.translate = [0,0,0];
        this.texColorWeight = 0.5;
        this.rotation = 0;
        this.rotationAxis = [0,0,0];
        this.n = 0;
    }

    render() {

        const transMat = new Matrix4();
        if (this.rotation != 0) transMat.setRotate(this.rotation, ...this.rotationAxis)
        transMat.translate(...this.translate);
        transMat.scale(...this.scale);
        gl.uniformMatrix4fv(u_ModelMatrix, false, transMat.elements);

        // color
        gl.uniform4f(u_FragColor, ...this.rgba);
        gl.uniform1f(u_TexColorWeight, this.texColorWeight);
        gl.drawArrays(gl.TRIANGLES, 0, this.n);
    }

    //#region load shapes

    bindBuffer(vertices) {
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        const fSize = 4;

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, fSize * 8, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, fSize * 8, fSize * 3);
        gl.enableVertexAttribArray(a_UV);

        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, fSize * 8, fSize * 5);
        gl.enableVertexAttribArray(a_Normal);
    }

    loadCube() {

        const vertices = [];

        // front of cube
        vertices.push(  0,0,0, 0,0, 0,0,-1, // xyz, uv, normal
                        1,1,0, 1,1, 0,0,-1,
                        1,0,0, 1,0, 0,0,-1);
        vertices.push(  0,0,0, 0,0, 0,0,-1,
                        0,1,0, 0,1, 0,0,-1,
                        1,1,0, 1,1, 0,0,-1);

        // top of cube
        vertices.push(  0,1,0, 0,0, 0,1,0,
                        1,1,0, 1,0, 0,1,0,
                        0,1,1, 0,1, 0,1,0 );
        vertices.push(  1,1,0, 1,0, 0,1,0,
                        0,1,1, 0,1, 0,1,0,
                        1,1,1, 1,1, 0,1,0 );

        // left side of cube
        vertices.push(  0,0,0, 1,0, -1,0,0,
                        0,1,0, 1,1, -1,0,0,
                        0,0,1, 0,0, -1,0,0 );
        vertices.push(  0,1,1, 0,1, -1,0,0,
                        0,1,0, 1,1, -1,0,0,
                        0,0,1, 0,0, -1,0,0 );

        // right side of cube
        vertices.push(  1,0,0, 0,0, 1,0,0,
                        1,1,0, 0,1, 1,0,0,
                        1,0,1, 1,0, 1,0,0 );
        vertices.push(  1,1,1, 1,1, 1,0,0,
                        1,1,0, 0,1, 1,0,0,
                        1,0,1, 1,0, 1,0,0 );

        // back of cube
        vertices.push(  0,0,1, 1,0, 0,0,1,
                        1,1,1, 0,1, 0,0,1,
                        1,0,1, 0,0, 0,0,1 );
        vertices.push(  0,0,1, 1,0, 0,0,1,
                        0,1,1, 1,1, 0,0,1,
                        1,1,1, 0,1, 0,0,1 );

        //  bottom of cube
        vertices.push(  0,0,0, 0,1, 0,-1,0,
                        0,0,1, 0,0, 0,-1,0,
                        1,0,0, 1,1, 0,-1,0 );
        vertices.push(  1,0,1, 1,0, 0,-1,0,
                        0,0,1, 0,0, 0,-1,0,
                        1,0,0, 1,1, 0,-1,0 );

        this.n = 36;
        this.bindBuffer(vertices);
    }

    loadQuad() {
        const vertices = [];
        vertices.push(  0,0,0, 0,0, 0,0,-1,// xyz, uv, normal
                        1,1,0, 1,1, 0,0,-1,
                        1,0,0, 1,0, 0,0,-1);
        vertices.push(  0,0,0, 0,0, 0,0,-1,
                        0,1,0, 0,1, 0,0,-1,
                        1,1,0, 1,1, 0,0,-1);

        this.n = 6;
        this.bindBuffer(vertices);
    }

    loadSphere() {
        const vertices = [];
        const pi = Math.PI;
        const twoPi = 2*pi;

        let d = pi/10;

        for (let t=0; t < pi; t+=d) {
            for (let r=0; r < (twoPi); r+=d) {

                // vertices
                let v1 = [Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t)];
                let v2 = [Math.sin(t+d)*Math.cos(r), Math.sin(t+d)*Math.sin(r), Math.cos(t+d)];
                let v3 = [Math.sin(t)*Math.cos(r+d), Math.sin(t)*Math.sin(r+d), Math.cos(t)];
                let v4 = [Math.sin(t+d)*Math.cos(r+d), Math.sin(t+d)*Math.sin(r+d), Math.cos(t+d)];

                // uv
                let uv1 = [t/pi, r/twoPi];
                let uv2 = [(t+d)/pi, r/twoPi];
                let uv3 = [t/pi, (r+d)/twoPi];
                let uv4 = [(t+d)/pi, (r+d)/twoPi];

                // triangle 1
                vertices.push(...v1, ...uv1, ...v1);
                vertices.push(...v2, ...uv2, ...v2);
                vertices.push(...v4, ...uv4, ...v4);

                // triangle 2
                vertices.push(...v1, ...uv1, ...v1);
                vertices.push(...v4, ...uv4, ...v4);
                vertices.push(...v3, ...uv3, ...v3);
            }
        }

        this.n = 1200;
        this.bindBuffer(vertices);
    }
    //#endregion
}

function createShape(translate, scale = [1,1,1], rgba = [1,1,1,1], texColorWeight = 1, rotation = 0, rotationAxis = [0,0,0]) {
    g_shape.translate = translate;
    g_shape.scale = scale;
    g_shape.rgba = rgba;
    g_shape.texColorWeight = texColorWeight;
    g_shape.rotation = rotation;
    g_shape.rotationAxis = rotationAxis;

    g_shape.render();
}
