import { SphereGeometry, MeshBasicMaterial, Mesh } from 'three';
import { latLngToPos } from '../utils';
function createHotspot(lat, lng) {
    const geometry = new SphereGeometry(2, 32, 32);
    const material = new MeshBasicMaterial({ color: 0xffffff });
    const hotspot = new Mesh(geometry, material);
    const pos = latLngToPos(lat, lng);
    hotspot.position.set(pos.x, pos.y, pos.z);
    return hotspot;
}
function createHotspotXYZ(x, y, z) {
    const geometry = new SphereGeometry(2, 32, 32);
    const material = new MeshBasicMaterial({ color: 0xffffff });
    const hotspot = new Mesh(geometry, material);
    hotspot.position.set(x, y, z);
    return hotspot;
}
export { createHotspot, createHotspotXYZ };
//# sourceMappingURL=hotspot.js.map