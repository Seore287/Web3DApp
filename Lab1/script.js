var scene, camera, renderer, clock, mixer, actions = [], mode;

init();

function init(){

  const assetPath = './';

  clock = new THREE.Clock();
  
  scene = new THREE.Scene();
  
  scene.background = new THREE.Color(0x00aaff);
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );

  camera.position.set(-5, 25, 20);

//Set up renderer for scene
const canvas = document.getElementById('threeContainer');
renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setPixelRatio( window.devicePixelRatio );
resize();

//Add Lighting
const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xFFFFFF, 2);
light.position.set(0, 10, 2);
scene.add(light);

//Add orbit controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(1, 2, 0);
controls.update();

//Controls animations to the object
mode = 'open';
const btn = document.getElementById("btn");
btn.addEventListener('click', function(){
  if (actions.length === 2) {
    if (mode === "open") {
      actions.forEach(action => {
        action.timeScale = 1;
        action.reset();
        action.play();
      });
    }
  }
});

//Loads the giTF model
const loader = new THREE.GLTFLoader();
loader.load(assetPath + 'assets/canModel.glb', function(gltf){
  const model = gltf.scene;
  scene.add(model);

  mixer = new THREE.AnimationMixer(model);
  const animations = gltf.animations;

  animations.forEach(clip =>{
    const action = mixer.clipAction(clip);
    actions.push(action)
  });
});

//Resizing Screen
window.addEventListener('resize', resize, false);

//Begin animation loop
animate();
}

function animate() {
  requestAnimationFrame(animate);

  if (mixer) {
    mixer.update(clock.getDelta());
  }

renderer.render(scene, camera);
}

function resize(){
  const canvas = document.getElementById('threeContainer');
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
