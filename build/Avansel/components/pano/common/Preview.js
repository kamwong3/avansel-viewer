var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BoxGeometry, CanvasTexture, Mesh, MeshBasicMaterial, BackSide, ImageLoader } from 'three';
import { pano } from '../../../config.json';
var ImageType;
(function (ImageType) {
    ImageType[ImageType["Sphere"] = 0] = "Sphere";
    ImageType[ImageType["Cylinder"] = 1] = "Cylinder";
    ImageType[ImageType["Cubestrip"] = 2] = "Cubestrip";
})(ImageType || (ImageType = {}));
var StripType;
(function (StripType) {
    StripType[StripType["Type1x6"] = 0] = "Type1x6";
    StripType[StripType["Type2x3"] = 1] = "Type2x3";
    StripType[StripType["Type3x2"] = 2] = "Type3x2";
    StripType[StripType["Type6x1"] = 3] = "Type6x1";
})(StripType || (StripType = {}));
const striporderDefault = 'rludfb';
let preview;
let settings;
let contexts = [];
let materials = [];
/*
let size, sides = {}
let positions
const format = 'udlrfb'
*/
const colorSide = (side) => {
    return {
        u: '#8888aa',
        d: '#88aa88',
        l: '#aa8888',
        r: '#88aaaa',
        f: '#aaaa88',
        b: '#aaaaaa',
    }[side];
};
const getSides = () => {
    var _a;
    const striporder = (_a = settings.striporder) !== null && _a !== void 0 ? _a : striporderDefault;
    return Array.from(striporder);
};
const getCanvas = (side) => {
    var _a;
    const canvas = document.createElement('canvas');
    const size = (_a = settings.size) !== null && _a !== void 0 ? _a : 1024;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    context.fillStyle = colorSide(side);
    context.fillRect(0, 0, size, size);
    context.rect(20, 20, size - 40, size - 40);
    context.strokeStyle = "#ffffff";
    context.stroke();
    context.fillStyle = "#ffffff";
    context.font = "48px Arial";
    context.textAlign = "center";
    context.fillText('side: ' + side, size / 2, size / 2);
    return canvas;
};
const getMaterial = (canvas) => {
    const texture = new CanvasTexture(canvas);
    const material = new MeshBasicMaterial({ map: texture, depthWrite: true });
    material.side = BackSide;
    material.opacity = 1;
    material.transparent = true;
    return material;
};
const materialsEmpty = () => {
    const materials = [];
    const sides = getSides();
    for (var i = 0; i < sides.length; i++) {
        const side = sides[i];
        const canvas = getCanvas(side);
        contexts.push(canvas.getContext('2d'));
        materials.push(getMaterial(canvas));
    }
    return materials;
};
const settingsBy = (img) => {
    const width = img.width;
    const height = img.height;
    if (height / width == 6) {
        if (!settings.type)
            settings.type = ImageType.Cubestrip;
        if (!settings.stripType)
            settings.stripType = StripType.Type1x6;
        if (!settings.size)
            settings.size = width;
    }
    else if (height / width == 1.5) {
        if (!settings.type)
            settings.type = ImageType.Cubestrip;
        if (!settings.stripType)
            settings.stripType = StripType.Type2x3;
        if (!settings.size)
            settings.size = width / 2;
    }
    else if (width / height == 1.5) {
        if (!settings.type)
            settings.type = ImageType.Cubestrip;
        if (!settings.stripType)
            settings.stripType = StripType.Type3x2;
        if (!settings.size)
            settings.size = height / 2;
    }
    else if (width / height == 6) {
        if (!settings.type)
            settings.type = ImageType.Cubestrip;
        if (!settings.stripType)
            settings.stripType = StripType.Type6x1;
        if (!settings.size)
            settings.size = height;
    }
    else if (width / height == 2) {
        if (!settings.type)
            settings.type = ImageType.Sphere;
    }
    if (!settings.type)
        settings.type = ImageType.Cylinder;
    if (!settings.size)
        settings.size = pano.tileBase;
    return settings;
};
const onImageLoad = (img) => {
    const sides = Array.from(striporderDefault);
    const materials = [];
    const size = settings.size;
    settings = settingsBy(img);
    for (var i = 0; i < sides.length; i++) {
        const side = sides[i];
        const index = settings.striporder.indexOf(sides[i]);
        const canvas = getCanvas(side);
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, size * index, size, size, 0, 0, size, size);
        materials.push(getMaterial(canvas));
    }
    return materials;
};
const onError = (e) => {
    console.log(e);
};
const load = (src) => __awaiter(void 0, void 0, void 0, function* () {
    const loader = new ImageLoader();
    return new Promise((resolve, reject) => {
        loader.load(src, img => resolve(img), undefined, e => reject(e));
    });
});
function createPreview(data) {
    return __awaiter(this, void 0, void 0, function* () {
        settings = data;
        return new Promise((resolve, reject) => {
            const boxSize = pano.tileBase + pano.maxLevels + 1;
            const geometry = new BoxGeometry(boxSize, boxSize, boxSize);
            if (settings.url || settings.type) {
                if (!settings.type) {
                    load('/tiles/preview.jpg').then(img => {
                        materials = onImageLoad(img);
                        preview = new Mesh(geometry, materials);
                        preview.scale.x = -1;
                        preview.renderOrder = 1;
                        resolve(preview);
                    });
                }
            }
            else {
                materials = materialsEmpty();
                preview = new Mesh(geometry, materials);
                preview.scale.x = -1;
                preview.renderOrder = 1;
                resolve(preview);
            }
        });
    });
}
export { createPreview };
//# sourceMappingURL=Preview.js.map