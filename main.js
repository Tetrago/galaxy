import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Planet from "./planet.js";

let scene, camera, renderer, controls, planet;

function init() {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.append(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 4, 5);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    controls.enablePan = false;

    scene.add(new THREE.AmbientLight(0x404040));

    planet = new Planet(5, 50);
    scene.add(planet.build());
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
animate();