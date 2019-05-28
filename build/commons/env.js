"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
require("@tensorflow/tfjs-node");
// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
var canvas = require('canvas');
exports.canvas = canvas;
var faceapi = __importStar(require("face-api.js"));
// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN
var Canvas = canvas.Canvas, Image = canvas.Image, ImageData = canvas.ImageData;
faceapi.env.monkeyPatch({ Canvas: Canvas, Image: Image, ImageData: ImageData });
