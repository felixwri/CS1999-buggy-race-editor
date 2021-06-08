// setup
let container;
let camera;
let renderer;
let scene;
let model;
let timeline = 0;

let raycaster,
    mouse = { x: 0, y: 0 };

let textureLoader = new THREE.TextureLoader();

const toRadians = (angle) => angle * (Math.PI / 180);

class ObjectBuilder {
    constructor(size_x, size_y) {
        this.x = size_x;
        this.y = size_y;
    }

    texturedPlane(texture) {
        let backgroundTexture = textureLoader.load(`../static/content/textures/${texture}.png`);
        backgroundTexture.encoding = THREE.sRGBEncoding;

        const backgroundMaterial = new THREE.MeshLambertMaterial({ map: backgroundTexture });
        return new THREE.Mesh(new THREE.PlaneGeometry(this.x, this.y), backgroundMaterial);
    }

    wireframe(geometry, opacity) {
        const wireframe = new THREE.WireframeGeometry(geometry);

        const line = new THREE.LineSegments(wireframe);

        line.material.depthTest = true;
        line.material.opacity = opacity;
        line.material.transparent = true;

        return line;
    }
    solid(model) {
        return model;
    }
}

function init() {
    container = document.querySelector('#viewport');

    const manager = new THREE.LoadingManager();
    manager.onStart = (url, itemsLoaded, itemsTotal) => {
        // console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        console.log('Started loading file: ' + url + '.');
    };

    manager.onLoad = () => {
        console.log('Loading complete!');
        // let loadingScreen = document.getElementById("loading");
        // loadingScreen.className += "loaded";
    };

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        console.log('Loaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };

    manager.onError = (url) => {
        console.log('There was an error loading ' + url);
    };

    raycaster = new THREE.Raycaster();

    // create scene
    scene = new THREE.Scene();

    const fov = 70;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 500;

    // camera
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 1.5, 10);
    // camera.rotation.x = -0.2

    // lights
    const ambient = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(-20, 60, 5);
    scene.add(light);

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // controls.update();

    // renderer.domElement.addEventListener('click', raycast, false);
    // renderer.domElement.addEventListener( 'move', raycast, false );

    // const standardMaterial = new THREE.MeshStandardMaterial( {
    //     color: 0xffffff,
    //     metalness: 0.9,
    //     roughness: 0.5,
    // } );

    // Generate texture

    let textureLoader = new THREE.TextureLoader();

    let map = textureLoader.load('../static/content/textures/compiled.png');
    map.encoding = THREE.sRGBEncoding;
    map.flipY = false;

    // load model
    let loader = new THREE.GLTFLoader(manager);
    loader.load('../static/content/models/plane.gltf', function (gltf) {
        // scene.add(gltf.scene);
        model = gltf.scene.children[0];
        // model.material = new THREE.MeshPhongMaterial({
        //     map: map,
        //     color: 0xaaaaaa,
        // });
        // console.log(model.geometry)
        wireframe = new ObjectBuilder().wireframe(model.geometry, 0.5);
        // wireframe.material.opacity = 0;
        wireframe.material.color.setHex(hexThemeColor);
        scene.add(wireframe);
        // model.rotation.y = 45;
        // animate();
    });

    buildBody(loader, numberOfWheels);
    buildWheels(loader, numberOfWheels);
}

let y = 10;
let delta_y = 0;
let change = 0;
let rot = 0;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();

//build

function buildBody(loader, wheels) {
    function bodyLoader(wheels) {
        let index = wheels / 2 - 1;
        loader.load('../static/content/models/parts.gltf', function (gltf) {
            console.log('h ' + index);
            for (let i = 0; i < index; i++) {
                console.log('i ' + i);
                model = gltf.scene.children[0];
                // wireframe = new ObjectBuilder().wireframe(model.geometry, 0.5);
                wireframe = new ObjectBuilder().solid(model);
                wireframe.position.z = placement['body'][i].z;
                wireframe.position.y = 2;
                wireframe.rotation.y = placement['body'][i].ry;
                scene.add(wireframe);
            }
        });
    }

    let yAngle = toRadians(90);

    const placement = {
        tail: {
            z: -2,
            x: 0,
            ry: -yAngle
        },
        body: [
            {
                z: 0,
                x: 0,
                ry: yAngle
            },
            {
                z: 2,
                x: 0,
                ry: yAngle
            },
            {
                z: 4,
                x: 0,
                ry: yAngle
            },
            {
                z: 6,
                x: 0,
                ry: yAngle
            },
            {
                z: 8,
                x: 0,
                ry: yAngle
            },
            {
                z: 10,
                x: 0,
                ry: yAngle
            }
        ],
        head: {
            z: wheels - 2,
            x: 0,
            ry: -yAngle
        }
    };

    loader.load('../static/content/models/parts.gltf', function (gltf) {
        for (let i = 0; i < gltf.scene.children.length; i++) {
            model = gltf.scene.children[i];
            if (model.name == 'body') {
                bodyLoader(wheels);
                continue;
            }

            let mesh = new ObjectBuilder().wireframe(model.geometry, 1);
            // mesh = new ObjectBuilder().solid(model);
            mesh.position.z = placement[model.name].z;
            mesh.position.y = 2;
            mesh.rotation.y = placement[model.name].ry;
            scene.add(mesh);
        }
    });
}

function buildWheels(loader, wheels) {
    let zAngle = toRadians(90);
    let xOffset = 1.5;

    const placement = {
        left: {
            x: -xOffset,
            rz: zAngle
        },
        right: {
            x: xOffset,
            rz: -zAngle
        }
    };

    for (let i = 0; i < wheels; i++) {
        loader.load('../static/content/models/wheel.gltf', function (gltf) {
            model = gltf.scene.children[0];
            let wireframe = new ObjectBuilder().solid(model);
            // wireframe = new ObjectBuilder().wireframe(model.geometry, 0.2);

            wireframe.position.y = 1;

            let dex;
            let zPlacement;

            if (i % 2 === 0) {
                side = 'right';
                dex = i;
            } else {
                side = 'left';
                dex = i - 1;
            }
            console.log(dex);
            if (dex === 0) {
                zPlacement = -2;
            } else {
                zPlacement = dex;
            }

            wireframe.position.x = placement[side].x;
            wireframe.position.z = zPlacement;
            wireframe.rotation.z = placement[side].rz;
            scene.add(wireframe);
            animate();
        });
    }
}

// other functions

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onWindowResize);

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

function raycast(e) {
    //1. sets the mouse position with a coordinate system where the center
    //   of the screen is the origin
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    //2. set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera(mouse, camera);

    //3. compute intersections
    var intersects = raycaster.intersectObjects(scene.children, true);

    // for (var i = 0; i < intersects.length; i++) {
    //     console.log(intersects.length);
    //     timeline = 45;
    // }
}
