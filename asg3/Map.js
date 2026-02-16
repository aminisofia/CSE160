function map() {
    createCube([-5,0,-5], [10,0.1,10], [.64, .29, .64, 1], 0);
    createCube([-10,-10, -10], [40,40,40], [0, 0, 0, 1], 0);

    loadTexture(g_brick);
    for (var x = 0; x < 10; x+=2) {
        for (var y = 0; y < 7; y+=2) {
            createCube([x-5,y,5], [2,2,2]);
            createCube([5,y,x-5], [2,2,2], [0,0,0,1], 0.8);
        }
    }
    loadTexture(g_toby);
    createCube([0,0,0], [3,3,0.01]);
}
