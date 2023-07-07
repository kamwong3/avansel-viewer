import { BoxGeometry, Mesh, MeshBasicMaterial, BackSide } from 'three';
const config = require('../../../config.json');
const pano = config.pano;
function createCube() {
    const boxSize = pano.tileBase + pano.maxLevels + 2;
    const geometry = new BoxGeometry(boxSize, boxSize, boxSize);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    material.side = BackSide;
    material.opacity = 1;
    material.transparent = true;
    return new Mesh(geometry, material);
}
export { createCube };
//# sourceMappingURL=Cube.js.map