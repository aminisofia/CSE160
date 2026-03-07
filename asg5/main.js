import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const fov = 90;
    const aspect = 2; // default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 3;

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    const scene = new THREE.Scene();

    {
        const color = 0xFFFFFF;
        const intensity = 3;
        const pink = 0xfcd0e7;
        const pinkIntensity = 5;
        const purple = 0x9900ff;
        // Light one
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
        // Light two
        const lightTwo = new THREE.AmbientLight(purple, intensity);
        lightTwo.position.set(-1, 2, 2);
        scene.add(lightTwo);
        // Light three
        const lightThree = new THREE.HemisphereLight(pink, pinkIntensity);
        lightThree.position.set(2, 1, 5);
        scene.add(lightThree);
    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({ color });

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;

        return cube;
    }

    const cubes = [
        makeInstance(geometry, 0x44aa88, 0),   // textured cube
        makeInstance(geometry, 0xff67c2, -1.5),
        makeInstance(geometry, 0x67e2ff, 1.5),
    ];

    // Textured middle cube
    {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('chiikawa.jpg', (texture) => { //CHIIKAWA!!!!!!
            texture.colorSpace = THREE.SRGBColorSpace;

            const texturedMat = new THREE.MeshBasicMaterial({
                map: texture,
            });

            cubes[0].material = texturedMat;
        });
    }

    // Background sky box!
    {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(
            'https://threejs.org/manual/examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
            () => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                texture.colorSpace = THREE.SRGBColorSpace;
                scene.background = texture;
            }
        );
    }
//#region Click!

    // Raycaster + mouse for clicking cubes
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onClick(event) {
        // Get mouse position in normalized device coordinates (-1 to +1)
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        mouse.set(x, y);

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cubes, false); // only test cubes

        if (intersects.length > 0) {
            const clickedCube = intersects[0].object;

            // Removed!
            scene.remove(clickedCube);

            // Remove from cubes array so it stops rotating
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

        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * 0.1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();
