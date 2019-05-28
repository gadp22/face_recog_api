"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var faceapi = __importStar(require("face-api.js"));
exports.faceDetectionNet = faceapi.nets.ssdMobilenetv1;
// export const faceDetectionNet = tinyFaceDetector
// export const faceDetectionNet = mtcnn
// SsdMobilenetv1Options
var minConfidence = 0.5;
// TinyFaceDetectorOptions
var inputSize = 408;
var scoreThreshold = 0.5;
// MtcnnOptions
var minFaceSize = 50;
var scaleFactor = 0.8;
function getFaceDetectorOptions(net) {
    return net === faceapi.nets.ssdMobilenetv1
        ? new faceapi.SsdMobilenetv1Options({ minConfidence: minConfidence })
        : (net === faceapi.nets.tinyFaceDetector
            ? new faceapi.TinyFaceDetectorOptions({ inputSize: inputSize, scoreThreshold: scoreThreshold })
            : new faceapi.MtcnnOptions({ minFaceSize: minFaceSize, scaleFactor: scaleFactor }));
}
exports.faceDetectionOptions = getFaceDetectorOptions(exports.faceDetectionNet);
