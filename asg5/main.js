import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// model from: https://skfb.ly/ptZCv
// skybox from: https://skfb.ly/oKtPY
// https://threejs.org/manual/#en/backgrounds [Three.js - Background Cubemap] as reference

function main() {

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    const fov = 60;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(1.2, -1.5, 5);
    camera.lookAt(0, -2.8, 1);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, -2.8, 1);
    controls.update();

    const scene = new THREE.Scene();

    //LIGHTS
    {
        const color = 0x00FBFF;
        const intensity = 2.5;
        const pink = 0xFF009D;
        const pinkIntensity = 80;
        const purple = 0x9900ff;
        // Light one
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, -13, 0);
        scene.add(light);
        // Light two
        const lightTwo = new THREE.AmbientLight(purple, intensity);
        lightTwo.position.set(-1, 2, -2);
        scene.add(lightTwo);
        // Light three
        const lightThree = new THREE.SpotLight(pink, pinkIntensity);
        lightThree.position.set(0, 3, 0);
        scene.add(lightThree);
    }

//#region Sphere
    function makeSphere(color, xOffset) {
        const geoSphere = new THREE.SphereGeometry(0.4, 16, 8);
        const materialSphere = new THREE.MeshStandardMaterial({ color });
        const sphere = new THREE.Mesh(geoSphere, materialSphere);
        scene.add(sphere);
        sphere.position.set(xOffset, -2.15, 1);
        return sphere;
    }

    const spheres = [
        makeSphere(0x9F27F5, 0),
        makeSphere(0xff67c2, -.8),
        makeSphere(0x67e2ff, .8),
    ];
//#endregion

    // Large cylinder under spheres
    const geoCylinder = new THREE.CylinderGeometry(2.5, 1, 3, 6);
    const materialCylinder = new THREE.MeshStandardMaterial({
        color: 0xF4E7FE,
    });
    const cylinder = new THREE.Mesh(geoCylinder, materialCylinder);
    scene.add(cylinder);
    cylinder.position.set(0, -4, 1);


//#region Cube
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeInstance(geometry, color, position) {
        const material = new THREE.MeshPhongMaterial({ color });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.copy(position);  // Use Vector3 position
        cube.scale.set(.5, .5, .5);
        return cube;
    }

    const cylinderRadius = 3;
    const cubeHeight = -2.5;

    const cubes = [
        makeInstance(geometry, 0x44aa88, new THREE.Vector3(0, cubeHeight, 1 + cylinderRadius)),
        makeInstance(geometry, 0xff67c2, new THREE.Vector3(-cylinderRadius, cubeHeight, 1)),
        makeInstance(geometry, 0x67e2ff, new THREE.Vector3(cylinderRadius, cubeHeight, 1)),
    ];

    // Textured middle cube
    {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('chiikawa.jpg', (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            const texturedMat = new THREE.MeshBasicMaterial({ map: texture });
            cubes[0].material = texturedMat;
        });
    }
//#endregion


    let chiikawaFriends = null;
    {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
            'chiikawa_and_friends.glb',
            (gltf) => {
                chiikawaFriends = gltf.scene;
                chiikawaFriends.position.set(0, -2.2, 1);
                chiikawaFriends.scale.set(1.5, 1.5, 1.5);
                scene.add(chiikawaFriends);
            },
            undefined,
            (error) => {
                console.error('Error loading chiikawa_and_friends.glb:', error);
            }
        );
    }

    // Background sky box!
    {
        const loader = new THREE.TextureLoader();
        loader.load(
            'jelly.jpg',
            (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                texture.colorSpace = THREE.SRGBColorSpace;
                scene.background = texture;
            }
        );
    }

    //#region Click!
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onClick(event) {
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        mouse.set(x, y);

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cubes, false);

        if (intersects.length > 0) {
            const clickedCube = intersects[0].object;
            scene.remove(clickedCube);
            const index = cubes.indexOf(clickedCube);
            if (index !== -1) {
                cubes.splice(index, 1);
            }
        }
    }
    //#endregion

    canvas.addEventListener('mousedown', onClick);

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // Rotate cubes
        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * 0.1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        // Rotate spheres
        // spheres.forEach((sphere, ndx) => {
        //     const speed = 1 + ndx * 0.1;
        //     const rot = time * speed;
        //     sphere.rotation.x = rot;
        //     sphere.rotation.y = rot;
        // });

        const cylinderSpeed = 1.5;
        cylinder.rotation.y = time * cylinderSpeed;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();
