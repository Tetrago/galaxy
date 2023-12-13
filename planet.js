import * as THREE from "three";

export default class Planet {
    constructor(radius, resolution) {
        this.radius = radius;
        this.resolution = resolution;
    }

    build() {
        const vertices = [];
        const colors = [];

        const a = new THREE.Vector3(0, 1, 0);
        const b = new THREE.Vector3(a.z, a.x, a.y);
        const c = a.clone().cross(b).normalize();

        const faces = [
            [a, c, b.clone().negate()],
            [a, b, c],
            [c, a, b],
            [c, b, a.clone().negate()],
            [b, c, a],
            [b, a, c.clone().negate()]
        ];

        const add = (vec) => {
            vec = vec.normalize().multiplyScalar(this.radius);
            vertices.push(vec.x, vec.y, vec.z);
        }

        for(const [xv, yv, zv] of faces) {
            const point = (x, y) => add(zv.clone().add(x).add(y));

            for(let x = -this.resolution; x < this.resolution; ++x) {
                for(let y = -this.resolution; y < this.resolution; ++y) {
                    const x1 = xv.clone().multiplyScalar(x / this.resolution);
                    const y1 = yv.clone().multiplyScalar(y / this.resolution);
                    const x2 = xv.clone().multiplyScalar((x + 1) / this.resolution);
                    const y2 = yv.clone().multiplyScalar((y + 1) / this.resolution);

                    point(x1, y1);
                    point(x1, y2);
                    point(x2, y2);

                    point(x1, y1);
                    point(x2, y2);
                    point(x2, y1);

                    colors.push(Math.random(1), Math.random(1), Math.random(1));
                    colors.push(Math.random(1), Math.random(1), Math.random(1));
                    colors.push(Math.random(1), Math.random(1), Math.random(1));

                    colors.push(Math.random(1), Math.random(1), Math.random(1));
                    colors.push(Math.random(1), Math.random(1), Math.random(1));
                    colors.push(Math.random(1), Math.random(1), Math.random(1));
                }
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));
        const material = new THREE.MeshStandardMaterial({ vertexColors: true });
        
        return new THREE.Mesh(geometry, material);
    }
};