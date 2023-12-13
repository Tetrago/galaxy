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
    const indices = [];

    const faces = [
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1)
    ];

    let i = 0;
    for(const up of faces) {
        const a = new THREE.Vector3(up.z, up.x, up.y);
        const b = up.clone().cross(a).normalize();

        for(let x = 0; x < resolution + 1; ++x) {
            for(let y = 0; y < resolution + 1; ++y) {
                const p = up.clone().add(a.clone().negate().add(a.clone().multiplyScalar(x / resolution * 2))).add(b.clone().negate().add(b.clone().multiplyScalar(y / resolution * 2))).normalize();
                const n = p.clone().multiplyScalar(evaluateNoise(noise3D, p, noise));

                p.multiplyScalar(radius).add(n);
                vertices.push(p.x, p.y, p.z);

                if(x < resolution && y < resolution) {
                    indices.push(i);
                    indices.push(i + resolution + 1);
                    indices.push(i + 1);

                    indices.push(i + 1);
                    indices.push(i + resolution + 1);
                    indices.push(i + resolution + 2);
                }

                ++i;
            }
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const material = new THREE.MeshLambertMaterial();
        
    return new THREE.Mesh(geometry, material);
};