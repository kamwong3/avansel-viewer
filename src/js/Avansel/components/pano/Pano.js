import Sphere from './Sphere';
import { Multires } from './Multires';
export default class Pano {
    constructor() { }
    sphere(source, controls) {
        this.instance = new Sphere(source, controls);
        return this;
    }
    multires(levels, source, controls) {
        this.instance = new Multires(levels, source, controls);
        this.instance.createPano();
        this.instance.updatePosition();
        return this;
    }
    get() {
        return this.instance.get();
    }
    onCameraMove(e) {
        /* do nothing */
    }
    onFovChanged(e) {
        /* do nothing */
    }
}
//# sourceMappingURL=Pano.js.map