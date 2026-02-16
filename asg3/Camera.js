class Camera {

    constructor() {
        this.eye = new Vector3([-5,3,-5]);
        this.at = new Vector3([100,0,100]);
        this.up = new Vector3([0,1,0]);
        this.viewMat = new Matrix4();

        this.prevMouseX = 0;
        this.prevMouseY = 0;

        canvas.onmousedown = dragCamera;
        canvas.onmousemove = dragCamera;

        addCameraControls();
    }

    moveForwardBackward(direction) {
        const forward = this.forward();
        forward.mul(direction);

        this.eye.add(forward);
        this.at.add(forward);
    }

    moveUpDownward(direction) {
        const upwards = new Vector3();
        upwards.set(this.up);
        upwards.normalize();
        upwards.mul(direction);

        this.eye.add(upwards);
        this.at.add(upwards);
    }

    moveSide(direction) {
        const side = Vector3.cross(this.up, this.forward());
        side.normalize();
        side.mul(direction);

        this.eye.add(side);
        this.at.add(side);
    }

    panHorizontal(pan) {
        const rotMat = new Matrix4();
        rotMat.setRotate(pan, ...this.up.elements);

        const fPrime = rotMat.multiplyVector3(this.forward());
        this.at.set(fPrime);
        this.at.add(this.eye);
    }

    panVertical(pan) {
        const forward = this.forward();
        const rotMat = new Matrix4();
        const rotAxis = Vector3.cross(this.up, forward);
        rotMat.setRotate(pan, ...rotAxis.elements);

        const fPrime = rotMat.multiplyVector3(forward);
        this.at.set(fPrime);
        this.at.add(this.eye);
    }

    forward() {
        const forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye);
        forward.normalize();
        return forward;
    }

    getViewMat() {
        this.viewMat.setLookAt(
            ...this.eye.elements,
            ...this.at.elements,
            ...this.up.elements
        );
        return this.viewMat;
    }
}

function dragCamera(event) {
    if(event.buttons === 1){
        console.log("click");
        const deltaX = event.clientX - g_camera.prevMouseX;
        const deltaY = event.clientY - g_camera.prevMouseY;

        g_camera.panHorizontal(-.5 * deltaX);
        g_camera.panVertical(.5 * deltaY);
    }
    g_camera.prevMouseX = event.clientX;
    g_camera.prevMouseY = event.clientY;
}

function addCameraControls() {
    document.addEventListener("keydown", (event) => {
        switch(event.key) {
            case 'w':
                g_camera.moveForwardBackward(.2);
                break;
            case 'a':
                g_camera.moveSide(.2);
                break;
            case 's':
                g_camera.moveForwardBackward(-.2);
                break;
            case 'd':
                g_camera.moveSide(-.2);
                break;
            case 'q':
                g_camera.panHorizontal(2);
                break;
            case 'e':
                g_camera.panHorizontal(-2);
                break;
            case ' ':
                g_camera.moveUpDownward(.2);
                break;
            case 'Control':
                g_camera.moveUpDownward(-.2);
                break;
        }
    });
}
