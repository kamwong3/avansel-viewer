import { MathUtils } from 'three';
const config = require('../config.json');
const pano = config.pano;
export const sides = ['f', 'b', 'l', 'r', 'u', 'd'];
export const latLngToPos = (lat, lng) => {
    const phi = MathUtils.degToRad(90 - lat);
    const theta = MathUtils.degToRad(lng);
    const radius = 50;
    let pos = { x: 0, y: 0, z: 0 };
    pos.x = radius * Math.sin(phi) * Math.cos(theta);
    pos.y = radius * Math.cos(phi);
    pos.z = radius * Math.sin(phi) * Math.sin(theta);
    return pos;
};
const minFor = (value, count, extend) => {
    value = Math.round(value * count) - extend;
    if (value < 0)
        value = 0;
    return value;
};
const maxFor = (value, count, extend) => {
    value = Math.round(value * count) + extend;
    if (value > (count - 1))
        value = count - 1;
    return value;
};
export const tilesFor = (level, levelData, bounds) => {
    var _a, _b;
    if (!((_a = bounds === null || bounds === void 0 ? void 0 : bounds.x) === null || _a === void 0 ? void 0 : _a.min) && !((_b = bounds === null || bounds === void 0 ? void 0 : bounds.x) === null || _b === void 0 ? void 0 : _b.max))
        return [];
    const { tileSize, size } = levelData;
    const tileBaseSize = pano.tileBase + pano.maxLevels - level;
    const tileSizePart = tileSize / (size / tileBaseSize);
    const tiles = [];
    const max = Math.ceil(tileBaseSize / tileSizePart);
    let xMin = minFor(bounds.x.min, max, 2);
    let xMax = maxFor(bounds.x.max, max, 2);
    let yMin = minFor(bounds.y.min, max, 2);
    let yMax = maxFor(bounds.y.max, max, 2);
    for (var x = xMin; x <= xMax; x++) {
        for (var y = yMin; y <= yMax; y++) {
            if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
                const offsetX = x * tileSizePart;
                const offsetY = y * tileSizePart;
                const width = ((x + 1) * tileSizePart) > tileBaseSize ? (tileBaseSize - x * tileSizePart) : tileSizePart;
                const height = ((y + 1) * tileSizePart) > tileBaseSize ? (tileBaseSize - y * tileSizePart) : tileSizePart;
                tiles.push({ x, y, offsetX, offsetY, width, height });
            }
        }
    }
    return tiles;
};
export const normLng = (lng) => {
    while (lng > 360)
        lng -= 360;
    while (lng < 0)
        lng += 360;
    return lng;
};
export const normLat = (lat) => {
    if (lat > 90)
        lat = lat - (90 - lat);
    if (lat < -90)
        lat = lat + (lat - 90);
    return lat;
};
//# sourceMappingURL=utils.js.map