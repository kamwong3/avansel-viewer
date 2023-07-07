export default class Resizer {
    constructor(container, camera, renderer) {
        this.container = container;
        this.camera = camera;
        this.renderer = renderer;
        this.setSize();
        window.addEventListener('resize', () => this.setSize());
    }
    setSize() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.setAspect(aspect);
        this.renderer.setSize();
    }
}
//# sourceMappingURL=Resizer.js.map