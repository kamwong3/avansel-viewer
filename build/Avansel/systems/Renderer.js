import { WebGLRenderer } from 'three';
import { renderer } from '../config.json';
export default class Renderer {
    constructor(container) {
        this.instance = new WebGLRenderer({ antialias: renderer.antialias });
        this.container = container;
        this.container.append(this.instance.domElement);
    }
    setSize() {
        this.instance.setSize(this.container.clientWidth, this.container.clientHeight);
        this.instance.setPixelRatio(window.devicePixelRatio);
    }
    get() {
        return this.instance;
    }
}
//# sourceMappingURL=Renderer.js.map