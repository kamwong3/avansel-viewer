import { SphereGeometry, Mesh, MeshBasicMaterial, TextureLoader } from 'three';
const config = require('../../config.json');
const pano = config.pano;
export default class Sphere {
    constructor(source, controls) {
        const geometry = new SphereGeometry(pano.tileBase, 64, 64);
        geometry.scale(-1, 1, 1);
        const texture = new TextureLoader().load(source, (texture) => {
            const pd = texture.source.data.width / 360;
            const fovMin = controls.canvas.clientWidth / pd;
            controls.fovMin = fovMin / pano.pixelZoom;
        });
        const material = new MeshBasicMaterial({ map: texture });
        this.instance = new Mesh(geometry, material);
    }
    get() {
        return this.instance;
    }
}
//# sourceMappingURL=Sphere.js.map