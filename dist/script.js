console.clear();

//===================================================== canvas
const renderer = new THREE.WebGLRenderer({alpha: true, antialiase: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//===================================================== scene
const scene = new THREE.Scene();

//===================================================== camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;
camera.position.y = 1.5;

//===================================================== lights
let light = new THREE.DirectionalLight(0xefefff, 3);
light.position.set(1, 1, 1).normalize();
scene.add(light);


//===================================================== resize
window.addEventListener("resize", function () {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

//===================================================== model
let loader = new THREE.GLTFLoader();
let mixer;
let model;
let model2;
loader.load(
  "../src/untitled.glb",
  function (gltf) {
    gltf.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.material.side = THREE.DoubleSide;
      }
    });

    model = gltf.scene;
    model.scale.set(0.35, 0.35, 0.35);
    model.position.set(-1.5,0)
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    // mixer.clipAction(gltf.animations[1]).play();
    let action = mixer.clipAction(gltf.animations[1]);
    action.play();

    createAnimation(mixer, action, gltf.animations[1]);
  }
);

loader.load("../src/Fox.glb",
    function (fox2){
      fox2.scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.material.side = THREE.DoubleSide;
        }
      });

      model2 = fox2.scene;
      model2.scale.set(0.025,0.025,0.025);
      model2.position.set(1.5,0)
      model2.rotation.y = 1
      scene.add(model2);

      mixer = new THREE.AnimationMixer(model2);
      // mixer.clipAction(gltf.animations[1]).play();
      let action = mixer.clipAction(fox2.animations[1]);
      action.play();

      createAnimation(mixer, action, fox2.animations[1]);
    }
    );


let clock = new THREE.Clock();

function render() {
  requestAnimationFrame(render);
  const delta = clock.getDelta();
  if (mixer != null) mixer.update(delta);
  if (model) model.rotation.y += 0.0025;


  renderer.render(scene, camera);
}

render();
gsap.registerPlugin(ScrollTrigger);

function createAnimation(mixer, action, clip) {
  let proxy = {
    get time() {
      return mixer.time;
    },
    set time(value) {
      action.paused = false;
      mixer.setTime(value);
      action.paused = true;
    }
  };

  let scrollingTL = gsap.timeline({
    scrollTrigger: {
      trigger: renderer.domElement,
      start: "top top",
      end: "+=1000%",
      pin: true,
      scrub: true,
      onUpdate: function () {
        camera.updateProjectionMatrix();
      }
    }
  });

  scrollingTL.to(proxy, {
    time: clip.duration,
    repeat: 3
  });
}