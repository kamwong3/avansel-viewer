import { MathUtils, PerspectiveCamera } from 'three';
const config = require('../config.json');
const camera = config.camera;
const { near, far, fov } = camera;
export default class Camera {
    constructor(container) {
        const aspect = container.clientWidth / container.clientHeight;
        this.instance = new PerspectiveCamera(fov, aspect, near, far);
        this.instance.position.set(0, 0, 0);
        this.tick = (delta) => {
            console.log('camera tick');
        };
    }
    setCamera(givenCamera) {
        this.instance = givenCamera;
    }
    setAspect(aspect) {
        this.instance.aspect = aspect;
        this.instance.updateProjectionMatrix();
    }
    get() {
        return this.instance;
    }
    lookAt(lat, lng) {
        lat = Math.max(-90, Math.min(89.9999999999, lat));
        var phi = MathUtils.degToRad(90 - lat);
        var theta = MathUtils.degToRad(lng);
        const x = 500 * Math.sin(phi) * Math.cos(theta);
        const y = 500 * Math.cos(phi);
        const z = 500 * Math.sin(phi) * Math.sin(theta);
        this.instance.lookAt(x, y, z);
    }
    setFov(fov) {
        this.instance.fov = fov;
        this.instance.updateProjectionMatrix();
    }
}
//# sourceMappingURL=Camera.js.map