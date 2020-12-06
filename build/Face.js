"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recognize = exports.trainData = exports.getRegisteredData = exports.loadModel = exports.populateRegisteredMembersDescriptors = void 0;
var commons_1 = require("./commons");
var database = __importStar(require("./Database"));
var faceapi = __importStar(require("face-api.js"));
require("@tensorflow/tfjs-node");
var fs_1 = __importDefault(require("fs"));
require("dotenv/config");
var registeredMembers = [];
var populateRegisteredMembersDescriptors = function () { return __awaiter(void 0, void 0, void 0, function () {
    var findReferences;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('populating all registered members ...');
                findReferences = database.findAllDocuments();
                return [4 /*yield*/, findReferences.then(function (imageReferences) {
                        var object = imageReferences;
                        var referenceObject = object;
                        for (var i = 0, len = referenceObject.length; i < len; i++) {
                            var registeredMember = {};
                            var descriptors = [];
                            for (var j in referenceObject[i].descriptors) {
                                descriptors.push(referenceObject[i].descriptors[j]);
                            }
                            registeredMember['descriptors'] = new Float32Array(descriptors);
                            registeredMember['data'] = referenceObject[i];
                            registeredMembers.push(registeredMember);
                        }
                    })];
            case 1:
                _a.sent();
                console.log('all registered members have been successfully loaded ...');
                return [2 /*return*/];
        }
    });
}); };
exports.populateRegisteredMembersDescriptors = populateRegisteredMembersDescriptors;
var loadModel = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('loading model for face detection ...');
                return [4 /*yield*/, commons_1.faceDetectionNet.loadFromDisk(process.env.WEIGHTS)];
            case 1:
                _a.sent();
                console.log('loading model for face landmark ...');
                return [4 /*yield*/, faceapi.nets.faceLandmark68Net.loadFromDisk(process.env.WEIGHTS)];
            case 2:
                _a.sent();
                console.log('loading model for face recognition ...');
                return [4 /*yield*/, faceapi.nets.faceRecognitionNet.loadFromDisk(process.env.WEIGHTS)];
            case 3:
                _a.sent();
                console.log('all models have been successsfully loaded!');
                return [2 /*return*/];
        }
    });
}); };
exports.loadModel = loadModel;
var getRegisteredData = function (res) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var findReferences;
    if (args.length > 0) {
        findReferences = database.findAllDocuments(args[0]);
    }
    else {
        findReferences = database.findAllDocuments();
    }
    findReferences.then(function (imageReferences) {
        var referenceObject = imageReferences;
        var response = {};
        response['status'] = '1';
        response['message'] = 'success.';
        response['data'] = referenceObject;
        res.send(JSON.stringify(response));
    });
};
exports.getRegisteredData = getRegisteredData;
var saveImageFile = function (imageBuffer, name) {
    return new Promise(function (resolve, reject) {
        var base64Data = imageBuffer.replace(/^data:image\/jpeg;base64,/, "");
        var directory = 'src/assets/img/' + name;
        var fileName = directory + '/' + name + '.jpg';
        var image = {};
        image['buffer'] = base64Data;
        image['uri'] = fileName;
        fs_1.default.promises.mkdir(directory, { recursive: true }).catch(console.error);
        fs_1.default.writeFile(fileName, base64Data, 'base64', function (err) {
            if (err) {
                reject(err);
            }
            resolve(image);
        });
    });
};
var trainData = function (req, res) {
    var jsonData = {};
    var bodyImage = req.body['image'];
    var bodyName = req.body['name'];
    if (bodyImage && bodyName) {
        try {
            var imageBuffer = bodyImage;
            var imageName_1 = bodyName;
            saveImageFile(imageBuffer, imageName_1).then(function (image) {
                return __awaiter(this, void 0, void 0, function () {
                    var imageElement, imageResult, faceMatcher, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                jsonData['name'] = imageName_1;
                                jsonData['image'] = image['buffer'];
                                return [4 /*yield*/, commons_1.canvas.loadImage(image['uri'])];
                            case 1:
                                imageElement = _c.sent();
                                return [4 /*yield*/, faceapi.detectAllFaces(imageElement, commons_1.faceDetectionOptions).withFaceLandmarks().withFaceDescriptors()];
                            case 2:
                                imageResult = _c.sent();
                                return [4 /*yield*/, new faceapi.FaceMatcher(imageResult)];
                            case 3:
                                faceMatcher = _c.sent();
                                console.log(imageElement);
                                console.log(imageResult);
                                _a = jsonData;
                                _b = 'descriptors';
                                return [4 /*yield*/, faceMatcher.labeledDescriptors[0].descriptors[0]];
                            case 4:
                                _a[_b] = _c.sent();
                                database.insertDocuments(jsonData);
                                console.log('done, saved results to the database.');
                                return [2 /*return*/];
                        }
                    });
                });
            });
        }
        catch (err) {
            console.log(err);
        }
    }
};
exports.trainData = trainData;
var recognize = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var minDistance, recognition, unknown, faceDescriptor, faceDescriptorArray, response, data, imageSource, i, labeledDescriptors, faceMatcher, i, len, ref, result;
    return __generator(this, function (_a) {
        minDistance = 99;
        recognition = null;
        unknown = 'unknown';
        faceDescriptor = [];
        faceDescriptorArray = [];
        response = {};
        data = {};
        try {
            imageSource = req.body.faceDescriptor;
            for (i in imageSource) {
                faceDescriptor.push(imageSource[i]);
            }
            faceDescriptorArray.push(new Float32Array(faceDescriptor));
            labeledDescriptors = new faceapi.LabeledFaceDescriptors('person', faceDescriptorArray);
            faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.45);
            for (i = 0, len = registeredMembers.length; i < len; i++) {
                ref = registeredMembers[i].data;
                result = faceMatcher.findBestMatch(registeredMembers[i].descriptors);
                if (result._label != unknown && result.distance < minDistance) {
                    minDistance = result.distance;
                    recognition = ref;
                }
            }
            if (recognition == null) {
                response['status'] = '0';
                response['message'] = 'error, unregistered member.';
                data['name'] = unknown;
                data['distance'] = minDistance;
            }
            else {
                response['status'] = '1';
                response['message'] = 'success.';
                data['id'] = recognition._id;
                data['name'] = recognition.name;
                data['distance'] = minDistance;
            }
            response['data'] = data;
            res.send(JSON.stringify(response));
        }
        catch (err) {
            console.log(err);
        }
        return [2 /*return*/];
    });
}); };
exports.recognize = recognize;
