import { Clock } from 'three';
const clock = new Clock();
export default class Loop {
    constructor(camera, scene, renderer) {
        this.camera = camera.get();
        this.scene = scene.get();
        this.renderer = renderer.get();
        this.updatable = [];
    }
    start() {
        this.renderer.setAnimationLoop((t) => {
            this.tick();
            this.renderer.render(this.scene, this.camera);
        });
    }
    stop() {
        this.renderer.setAnimationLoop(null);
    }
    tick() {
        const delta = clock.getDelta();
        for (const object of this.updatable) {
            object.tick(delta);
        }
    }
}
//# sourceMappingURL=Loop.js.map