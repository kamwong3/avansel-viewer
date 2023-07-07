import { Scene as ThreeScene } from 'three';
export default class Scene {
    constructor() {
        this.instance = new ThreeScene();
    }
    add(object) {
        this.instance.add(object);
    }
    get() {
        return this.instance;
    }
}
//# sourceMappingURL=Scene.js.map