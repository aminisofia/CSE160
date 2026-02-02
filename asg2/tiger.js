function tiger() {

    animation();

    const body = makeCube([1.0, 0.78, 0.58, 1], [.6, .3, .3], [-.1, g_bodyHeight, 0], [g_bodyRot, 0, 0, 1]);


    // back right leg
    const brThigh1 = makeCube([1.0, 0.78, 0.58, 1], [.2, -.23, .15], [.06, .05, .05], [g_legUpperRot - 5, 0, 0, 1], body);
    const brCalf  = makeCube([1.0, 0.78, 0.58, 1], [.12, -.22, .1], [.06, -.32, .08], [g_legLowerRot+ 10, 0, 0, 1], brThigh1);
    const brPaw   = makeCube([0.98, 0.90, 0.85, 1], [.15, -.1, .13], [0.06, -.25, .05], [-3, 0, 0, 1], brCalf);

    // back left leg
    const blThigh1 = makeCube([1.0, 0.78, 0.58, 1], [.2, -.23, .15], [.06, .05, .25], [g_blThighRot - 5, 0, 0, 1], body);
    const blCalf  = makeCube([1.0, 0.78, 0.58, 1], [.12, -.22, .1], [.06, -.32, .08], [g_blCalfRot + 10, 0, 0, 1], blThigh1);
    const blPaw   = makeCube([0.98, 0.90, 0.85, 1], [.15, -.1, .13], [0.06, -.25, .05], [-5, 0, 0, 1], blCalf);

    // front right leg
    const frThigh1 = makeCube([1.0, 0.78, 0.58, 1], [.15, -.22, .15], [.55, 0, .05], [g_frThighRot - 10, 0, 0, 1], body);
    const frCalf  = makeCube([1.0, 0.78, 0.58, 1], [.1, -.23, .1], [.1, -.3, .08], [g_frCalfRot + 5, 0, 0, 1], frThigh1);
    const frPaw   = makeCube([0.98, 0.90, 0.85, 1], [.13, -.1, .13], [0.05, -.21, .05], [5, 0, 0, 1], frCalf);

    // front left leg
    const flThigh1 = makeCube([1.0, 0.78, 0.58, 1], [.15, -.22, .15], [.55, 0, .25], [g_flThighRot - 10, 0, 0, 1], body);
    const flCalf  = makeCube([1.0, 0.78, 0.58, 1], [.1, -.23, .1], [.1, -.3, .08], [g_flCalfRot + 5, 0, 0, 1], flThigh1);
    const flPaw   = makeCube([0.98, 0.90, 0.85, 1], [.13, -.1, .13], [0.05, -.21, .05], [5, 0, 0, 1], flCalf);

    const tail1 = makeCube([1.0, 0.78, 0.58, 1], [.1, -.1, .13], [.05, .25, .15], [g_tail1Rot - 40, 0, 0, 1], body);
    const tail2 = makeCube([1.0, 0.78, 0.58, 1], [.1, -.2, .13], [.05, -.17, .065], [g_tail2Rot + 10, 0, 0, 1], tail1);
    const tail3 = makeCube([0.70, 0.55, 0.55, 1], [.14, -.22, .15], [.042, -.3, .065], [g_tail3Rot + 20, 0, 0, 1], tail2);

    const neck = makeCube([1.0, 0.78, 0.58, 1], [.15, .23, .17], [.55, .3, 0.16], [g_neckRot - 25, 0, 0, 1], body);

    const head = makeCube([1.0, 0.78, 0.58, 1], [.25,.25,.25], [.15,.25,.07], [25,0,0,1], neck);

    const rEye = makeCube([0.98, 0.96, 0.65, 1], [.05, .05, .05], [.25, .15, .07], [0, 0, 0, 1], head);
    const lEye = makeCube([0.98, 0.96, 0.65, 1], [.05, .05, .05], [.25, .15, .2], [0, 0, 0, 1], head);

    const nose = makeCube( [0.85, 0.55, 0.65, 1],[.08, .06, .08], [.25, .092, .13], [0, 0, 0, 1], head);

    const rEar = makeCube([1.0, 0.78, 0.58, 1], [.1, .1, .1], [.02, .25, 0], [0, 1, 0, 0], head);
    // const rInnerEar = makeCube([0.98, 0.86, 0.88, 1], [.09, .05, - .2], [.05, 0, - .09], [0, 1, 0, 0], rEar);

    const lEar = makeCube([1.0, 0.78, 0.58, 1], [.1, .1, .1], [.02, .25, .27], [0, 1, 0, 0], head);
    // const lInnerEar = makeCube([0.98, 0.86, 0.88, 1], [.09, .05, .2], [.05, 0, .09], [0, 1, 0, 0], lEar);

    //#region STRIPES
    let stripeColor = [0.55, 0.45, 0.55, 1];

    const stripe1 = makeCube(
        stripeColor,
        [.03, .2, .33],
        [.3, .15, .15],
        [0, 0, 0, 1],
        body,
    );

    const stripe2 = makeCube(
        stripeColor,
        [.03, .3, .33],
        [.4, .15, .15],
        [0, 0, 0, 1],
        body,
    );

    const stripe3 = makeCube(
        stripeColor,
        [.03, .3, .33],
        [.2, .15, .15],
        [0, 0, 0, 1],
        body,
    );

    //#endregion
}

function makeCube(rgba, scale, translate, rotation, parent) {

    var cube = new Cube();
    cube.rgba = rgba;

    if (parent) cube.matrix = new Matrix4(parent.getTranslatedMatrix());

    cube.setScale(scale[0], scale[1], scale[2]);
    cube.setTranslate(translate[0], translate[1], translate[2]);
    cube.setRotation(rotation[0], rotation[1], rotation[2], rotation[3]);
    cube.render();

    return cube;
}

var g_bodyRot = 0;
var g_bodyHeight = 0;

var g_legUpperRot = 0;
var g_legLowerRot= 0;

var g_blThighRot = 0;
var g_blCalfRot = 0;

var g_frThighRot = 0;
var g_frCalfRot = 0;

var g_flThighRot = 0;
var g_flCalfRot = 0;

var g_tail1Rot = 0;
var g_tail2Rot = 0;
var g_tail3Rot = 0;

var g_neckRot = 0;
var g_headRot = 0;

function animation() {
    if (!g_animationPlaying) return;

    const animTime = g_seconds * 5;

    g_bodyRot = Math.sin(animTime) * 12;
    g_bodyHeight = Math.sin(animTime) * .08;

    g_legUpperRot = Math.sin(animTime + 2.5) * 20;
    g_legLowerRot= Math.sin(animTime + 3.5) * 30;

    g_blThighRot = Math.sin(animTime + 2.8) * 20;
    g_blCalfRot = Math.sin(animTime + 3.8) * 30;

    g_frThighRot = Math.sin(animTime + .5) * 20 + 20;
    g_frCalfRot = Math.sin(animTime + 1.2) * 30 + 10;

    g_flThighRot = Math.sin(animTime + 1) * 20 + 20;
    g_flCalfRot = Math.sin(animTime + 1.7) * 30 + 10;

    g_tail1Rot = Math.sin(animTime + 1.2) * -10;
    g_tail2Rot = Math.sin(animTime + 2.2) * -20 - 20;
    g_tail3Rot = Math.sin(animTime + 3.2) * -30 - 20;

    g_neckRot = Math.sin(animTime + .5) * 20 - 10;
    g_headRot = Math.sin(animTime + 1) * 10;

}
