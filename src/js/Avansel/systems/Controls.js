import { MathUtils } from 'three';
import { normLng } from '../components/utils';
const config = require('../config.json');
const controls = config.controls;
var TouchType;
(function (TouchType) {
    TouchType[TouchType["Touch"] = 0] = "Touch";
    TouchType[TouchType["Zoom"] = 1] = "Zoom";
})(TouchType || (TouchType = {}));
export default class Controls {
    constructor(camera, canvas) {
        this.camera = camera;
        this.canvas = canvas;
        this.tween = true;
        this.fovMax = controls.fovMax;
        this.fovMin = controls.fovMin;
        this.isInteracting = false;
        this.onMouseDownMouseX = 0;
        this.onMouseDownMouseY = 0;
        this.lng = 90;
        this.lngVector = 90;
        this.onMouseDownLng = 0;
        this.lat = 0;
        this.latVector = 0;
        this.onMouseDownLat = 0;
        this.phi = 0;
        this.theta = 0;
        this.fov = 70;
        this.fovVector = 70;
        this.init();
    }
    init() {
        this.onTouchStartHandler = this.onTouchStart.bind(this);
        this.onClickHandler = this.onClick.bind(this);
        this.onMouseDownHandler = this.onMouseDown.bind(this);
        this.onMouseWheelHandler = this.onMouseWheel.bind(this);
        this.canvas.addEventListener('touchstart', this.onTouchStartHandler);
        this.canvas.addEventListener('click', this.onClickHandler);
        this.canvas.addEventListener('mousedown', this.onMouseDownHandler);
        this.canvas.addEventListener('mousewheel', this.onMouseWheelHandler);
        this.camera.lookAt(this.lat, this.lng);
    }
    setPano(p) {
        this.pano = p;
    }
    setTween(tween) {
        this.tween = tween;
    }
    position() {
        return { lat: this.lat, lng: normLng(this.lng), fov: this.fov };
    }
    tick(delta) {
        if (this.isInteracting === false) {
            //lng += 0.025;
        }
        this.lat = Math.max(-90, Math.min(89.9999999999, this.lat));
        if (this.tween) {
            if (this.fovVector != this.fov) {
                let diff = (this.fov - this.fovVector) / 10;
                if (Math.abs(this.fovVector / diff) > 500000) {
                    this.fov = this.fovVector;
                }
                else {
                    this.fov = this.fov - diff;
                }
                this.onFovChanged();
            }
            let posChanged = false;
            if (this.latVector != this.lat) {
                let diff = (this.lat - this.latVector) / 10;
                if (Math.abs(this.fov / diff) > 100000) {
                    this.lat = this.latVector;
                }
                else {
                    this.lat = this.lat - diff;
                }
                posChanged = true;
            }
            if (this.lngVector != this.lng) {
                let diff = (this.lng - this.lngVector) / 10;
                if (Math.abs(this.fov / diff) > 100000) {
                    this.lng = this.lngVector;
                }
                else {
                    this.lng = this.lng - diff;
                }
                posChanged = true;
            }
            if (posChanged)
                this.onPosChanged();
        }
    }
    // Touch events
    onTouchStart(e) {
        var touches = e.touches;
        if (touches.length == 1) {
            this.touchType = TouchType.Touch;
        }
        else if (touches.length == 2) {
            this.touchType = TouchType.Zoom;
        }
        if (this.touchType == TouchType.Touch && e.type == 'touchstart') {
            var touch = touches[0];
            this.isInteracting = true;
            this.onMouseDownMouseX = touch.pageX;
            this.onMouseDownMouseY = touch.pageY;
            this.onMouseDownLng = this.lng;
            this.onMouseDownLat = this.lat;
        }
        if (this.touchType == TouchType.Zoom) {
            this.onTouchDist = Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
            this.onTouchFov = this.fov;
        }
        this.onTouchMoveHandler = this.onTouchMove.bind(this);
        this.onTouchUpHandler = this.onTouchUp.bind(this);
        this.canvas.addEventListener('touchmove', this.onTouchMoveHandler);
        this.canvas.addEventListener('touchend', this.onTouchUpHandler);
        this.canvas.addEventListener('touchcancel', this.onTouchUpHandler);
        e.preventDefault();
    }
    onTouchMove(e) {
        var touches = e.touches;
        var newTouchType;
        if (touches.length == 1) {
            newTouchType = TouchType.Touch;
        }
        else if (touches.length == 2) {
            newTouchType = TouchType.Zoom;
        }
        if (this.touchType != newTouchType) {
            return null;
        }
        if (this.touchType == TouchType.Touch && e.type == 'touchmove') {
            var touch = touches[0];
            this.lng = (this.onMouseDownMouseX - touch.pageX) * this.camera.get().fov * controls.moveFactor / this.canvas.clientWidth + this.onMouseDownLng;
            this.lat = (touch.pageY - this.onMouseDownMouseY) * this.camera.get().fov * controls.moveFactor / this.canvas.clientWidth + this.onMouseDownLat;
            this.latVector = this.lat;
            this.lngVector = this.lng;
            this.onPosChanged();
        }
        if (this.touchType == TouchType.Zoom && e.type == 'touchmove') {
            var dist = Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
            var diff = this.onTouchDist - dist;
            this.fov = MathUtils.clamp(this.onTouchFov + diff * this.onTouchFov / 500, this.fovMin, this.fovMax);
            this.fovVector = this.fov;
            this.onFovChanged();
        }
    }
    onTouchUp(e) {
        this.isInteracting = false;
        this.canvas.removeEventListener('touchmove', this.onTouchMoveHandler);
        this.canvas.removeEventListener('touchend', this.onTouchUpHandler);
        this.canvas.removeEventListener('touchcancel', this.onTouchMoveHandler);
        this.touchType = null;
        if (e.changedTouches.length == 1) {
            const touch = e.changedTouches[0];
            if (touch.clientX == this.onMouseDownMouseX && touch.clientY == this.onMouseDownMouseY) {
                this.onTap(e);
            }
        }
    }
    onTap(e) {
        console.log('onTap');
    }
    // mouse events
    onMouseDown(e) {
        this.isInteracting = true;
        this.onMouseDownMouseX = e.clientX;
        this.onMouseDownMouseY = e.clientY;
        this.onMouseDownLng = this.lng;
        this.onMouseDownLat = this.lat;
        this.onMouseMoveHandler = this.onMouseMove.bind(this);
        this.onMouseUpHandler = this.onMouseUp.bind(this);
        this.canvas.addEventListener('mousemove', this.onMouseMoveHandler);
        this.canvas.addEventListener('mouseup', this.onMouseUpHandler);
        this.canvas.addEventListener('mouseleave', this.onMouseUpHandler);
    }
    onMouseMove(e) {
        if (this.tween) {
            this.lngVector = (this.onMouseDownMouseX - e.clientX) * this.camera.get().fov * controls.moveFactor / this.canvas.clientWidth + this.onMouseDownLng;
            this.latVector = (e.clientY - this.onMouseDownMouseY) * this.camera.get().fov * controls.moveFactor / this.canvas.clientWidth + this.onMouseDownLat;
        }
        else {
            this.lng = (this.onMouseDownMouseX - e.clientX) * this.camera.get().fov * controls.moveFactor / this.canvas.clientWidth + this.onMouseDownLng;
            this.lat = (e.clientY - this.onMouseDownMouseY) * this.camera.get().fov * controls.moveFactor / this.canvas.clientWidth + this.onMouseDownLat;
            this.onPosChanged();
        }
    }
    onMouseUp(e) {
        this.isInteracting = false;
        this.canvas.removeEventListener('mousemove', this.onMouseMoveHandler);
        this.canvas.removeEventListener('mouseup', this.onMouseUpHandler);
        this.canvas.removeEventListener('mouseleave', this.onMouseUpHandler);
    }
    onMouseWheel(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.tween) {
            this.fovVector = MathUtils.clamp(this.fovVector + e.deltaY * this.fovVector / 1000, this.fovMin, this.fovMax);
        }
        else {
            this.fov = MathUtils.clamp(this.fov + e.deltaY * this.fov / 1000, this.fovMin, this.fovMax);
            this.onFovChanged();
        }
    }
    onClick(e) {
        if (e.clientX == this.onMouseDownMouseX && e.clientY == this.onMouseDownMouseY) {
            this.canvas.dispatchEvent(new CustomEvent('panoClick', { detail: e }));
        }
    }
    onFovChanged() {
        this.camera.setFov(this.fov);
        this.pano.onFovChanged({ detail: { fov: this.fov } });
        //this.canvas.dispatchEvent( new CustomEvent('fovChanged', {detail: { fov: this.fov }}) )
    }
    onPosChanged() {
        this.camera.lookAt(this.lat, this.lng);
        this.pano.onFovChanged({ detail: { lat: this.lat, lng: this.lng } });
        //this.canvas.dispatchEvent(new CustomEvent('cameraMove', {detail: { lat: this.lat, lng: this.lng }}))
    }
    setLatLng(lat, lng) {
        this.latVector = this.lat = lat;
        this.lngVector = this.lng = lng;
        onPosChanged();
    }
}
//# sourceMappingURL=Controls.js.map