// setup
let container;
let camera;
let renderer;
let scene;
let model;
let timeline = 0;
let loggedIn = false;

let raycaster, mouse = { x: 0, y: 0 };

let textureLoader = new THREE.TextureLoader();

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

        line.material.depthTest = false;
        line.material.opacity = opacity;
        line.material.transparent = true;

        return line;
    }
}


function init() {
    container = document.querySelector('.scene');

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
    const ambient = new THREE.AmbientLight(0xFFFFFF, 2);
    scene.add(ambient);

    // const light = new THREE.DirectionalLight(0xFFFFFF, 2);
    // light.position.set(-20, 60, 5)
    // scene.add(light);

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);


    // renderer.domElement.addEventListener('click', raycast, false);
    // renderer.domElement.addEventListener( 'move', raycast, false );


    // const standardMaterial = new THREE.MeshStandardMaterial( {
    //     color: 0xffffff,
    //     metalness: 0.9,
    //     roughness: 0.5,
    // } );

    // Generate texture

    let textureLoader = new THREE.TextureLoader();

    let map = textureLoader.load("../static/content/textures/compiled.png");
    map.encoding = THREE.sRGBEncoding;
    map.flipY = false;


    // load model
    let loader = new THREE.GLTFLoader(manager);
    loader.load("../static/content/models/landWireframe.gltf", function (gltf) {
        // scene.add(gltf.scene);
        model = gltf.scene.children[0];
        // model.material = new THREE.MeshPhongMaterial({
        //     map: map,
        //     color: 0xaaaaaa,
        // });
        // console.log(model.geometry)
        wireframe = new ObjectBuilder().wireframe(model.geometry, 0.5);
        wireframe.material.opacity = 0; 
        scene.add(wireframe);
        // model.rotation.y = 45;
        animate();
    });
}

let y = 10;
let delta_y = 0;
let change = 0;
let rot = 0;

function animate() {
    requestAnimationFrame(animate);
    // model.rotation.y -= 0.00005 * (10 * Math.sin(rot));
    // rot += 0.01;
    model.rotation.y = model.rotation.y + Math.sin(timeline * Math.PI / 180) / (75)

    // if (timeline > 0) { timeline = timeline - 0.1 } else { timeline = 0 }

    if ( wireframe.material.opacity < 0.5) wireframe.material.opacity += 0.01 

    if ( camera.position.z > 5 && loggedIn == false ) { 

        camera.position.z -= ( ( camera.position.z - 5 ) / 100 ) 

    } else if ( camera.position.z > 0 && loggedIn == true ) {

        camera.position.z -= ( camera.position.z / 100 ) 

    }

    wireframe.rotation.y = (mouse.x - (window.innerWidth / 2)) / 50000
    wireframe.rotation.z = (mouse.y - (window.innerHeight / 2)) / 50000

    renderer.render(scene, camera);

    // console.log(mouse.x, mouse.y)
}

init();

// other functions

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);

window.addEventListener("mousemove", (event) => {
    mouse.x = event.x
    mouse.y = event.y
})

function raycast(e) {

    //1. sets the mouse position with a coordinate system where the center
    //   of the screen is the origin
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

    //2. set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera(mouse, camera);

    //3. compute intersections
    var intersects = raycaster.intersectObjects(scene.children, true);

    // for (var i = 0; i < intersects.length; i++) {
    //     console.log(intersects.length);
    //     timeline = 45;
    // }
}

