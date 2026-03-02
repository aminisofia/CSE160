function map() {

    setLightActive(g_lightActive);
    setLightCol();

    g_shape.loadCube();
    createShape([-5,0,-5], [10,0.1,10], [.64, .29, .64, 1], 0);
    createShape([-10,-10, -10], [40,40,40], [0, 0, 0, 1], 0);

    loadTexture(g_brick);
    for (var x = 0; x < 10; x+=2) {
        for (var y = 0; y < 7; y+=2) {
            createShape([x-5,y,5], [2,2,2]);
            createShape([5,y,x-5], [2,2,2], [0,0,0,1], 0.75);
        }
    }

    // draw sphere
    g_shape.loadSphere();
    createShape([3,2,3], [1,1,1], [1,1,1,1], 0);

    setLightActive(false);

    const lightPosition = getLightPosition();
    createShape(lightPosition, [.2,.2,.2], [1,1,1,1], 0);
    gl.uniform3f(u_LightPos, ...lightPosition);


    // drawing toby hehe...
    g_shape.loadQuad();
    const time = performance.now()/(500 - g_speed);
    decideTobyTex(time*3);
    const turn = Math.sin(time) > 0 ? 3: -3;
    const tobyDir = turn > 0 ? 1 : -1;
    const tobyTrans = [tobyDir * -1.5+Math.sin(time), 0, 1+Math.sin(time + Math.PI/2)];
    const tobyScale = [turn, 3, 0];
    createShape(tobyTrans, tobyScale, [1,1,1,1], 1, 45, [0,1,0]);
    g_shape.render();
}

function decideTobyTex(time) {
    if (Math.sin(time) > 0) {
        loadTexture(g_toby);
    } else {
        loadTexture(g_jump);
    }
}

function getLightPosition() {
    let t = g_lightPositionSet ? -g_lightPosition : Math.sin( performance.now()/1000.0);
    return [t*2 + 2, 5, -t*2 + 2];
}

function setLightActive(active) {
    gl.uniform1f(u_LightActive, active ? 1.0 : 0.0);
}

function setLightCol() {
    if (g_party) {
        let time = performance.now() / 1000;
        let r = Math.sin(time * 5) *.5 + .6;
        let g = Math.sin((time + .5) * 7) * .5 + .6;
        let b = Math.sin((time + 1) * 9) * .5 + .6;
        gl.uniform3f(u_LightCol, r,g,b);
    } else {
        gl.uniform3f(u_LightCol, ...g_lightCol);
    }
}

