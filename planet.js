import { createNoise3D } from "simplex-noise";
import alea from "alea";
import * as THREE from "three";

function evaluateNoise(noise, point, {
    strength,
    roughness,
    persistence,
    lacunarity,
    octaves
}) {
    let value = 0;
    let frequency = lacunarity;
    let ampltude = 1;

    for(let i = 0; i < octaves; ++i) {
        const p = point.clone().multiplyScalar(frequency);
        value += (noise(p.x, p.y, p.z) + 1) * 0.5 * ampltude;

        frequency *= roughness;
        ampltude *= persistence;
    }

    return value * strength;
}

export default function planet(mesh, noise) {
    const { seed = 'seed' } = noise;
    const noise3D = createNoise3D(alea(seed));

    const { radius = 8, resolution = 64 } = mesh;

    const vertices = [];

    const faces = [
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1)
    ];

    for(const up of faces) {
        const a = new THREE.Vector3(up.z, up.x, up.y);
        const b = up.clone().cross(a).normalize();

        const point = (x, y) => {
            const p = up.clone().add(x).add(y).normalize();
            const n = p.clone().multiplyScalar(evaluateNoise(noise3D, p, noise));

            p.multiplyScalar(radius).add(n);
            vertices.push(p.x, p.y, p.z);
        }

        for(let x = -resolution; x < resolution; ++x) {
            for(let y = -resolution; y < resolution; ++y) {
                const x1 = a.clone().multiplyScalar(x / resolution);
                const y1 = b.clone().multiplyScalar(y / resolution);
                const x2 = a.clone().multiplyScalar((x + 1) / resolution);
                const y2 = b.clone().multiplyScalar((y + 1) / resolution);

                point(x1, y1);
                point(x2, y2);
                point(x1, y2);

                point(x1, y1);
                point(x2, y1);
                point(x2, y2);
            }
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.computeVertexNormals();
    const material = new THREE.MeshLambertMaterial();
        
    return new THREE.Mesh(geometry, material);
};