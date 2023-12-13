import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import cryptoRandomString from "crypto-random-string";
import planet from "./planet.js";

let scene, camera, renderer, controls, body;

let params = {
    planet: {
        period: 10
    },
    mesh: {
        radius: 8,
        resolution: 64
    },
    noise: {
        seed: cryptoRandomString({ length: 20 }),
        strength: 0.6,
        roughness: 2,
        persistence: 0.3,
        lacunarity: 2,
        octaves: 5
    }
};

function generateBody() {
    scene.remove(body);
    body = planet(params.mesh, params.noise);
    scene.add(body);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

function init() {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.append(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(10, 8, 10);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    controls.enablePan = false;

    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(10, 10, 10);
    scene.add(light);

    generateBody();

    const gui = new GUI();

    const pl = gui.addFolder("Planet");
    pl.add(params.planet, "period").name("Period (s/rot)");
    pl.open();

    const mesh = gui.addFolder("Mesh");
    mesh.add(params.mesh, "radius").name("Radius").onChange(generateBody);
    mesh.add(params.mesh, "resolution").name("Resolution").onChange(generateBody);
    mesh.open();

    const noise = gui.addFolder("Noise");
    noise.add(params.noise, "seed").name("Seed").onChange(generateBody);
    noise.add(params.noise, "strength").name("Strength").onChange(generateBody);
    noise.add(params.noise, "roughness").name("Roughness").onChange(generateBody);
    noise.add(params.noise, "persistence").name("Persistence").onChange(generateBody);
    noise.add(params.noise, "lacunarity").name("Lacunarity").onChange(generateBody);
    noise.add(params.noise, "octaves").name("Octaves").onChange(generateBody);
    noise.open();

    window.addEventListener("resize", onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);

    if(params.planet.period !== 0) {
        body.rotateY(1 / params.planet.period / 60);
    }

    renderer.render(scene, camera);
}

init();
animate();
