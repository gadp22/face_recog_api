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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIn = exports.findAllAttendances = exports.findAllDocumentsByName = exports.findAllDocuments = exports.insertDocuments = exports.initDB = void 0;
require("mongodb");
require("dotenv/config");
require("./Face");
var Face_1 = require("./Face");
var log = __importStar(require("./Logger"));
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
var dbName = 'face';
var url = 'mongodb://0.0.0.0:27017';
var client = new MongoClient(url);
var db;
exports.initDB = function (callback) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        client.connect(function () {
            db = client.db(dbName);
            callback(console.log('Connected successfully to the database server'));
        });
        return [2 /*return*/];
    });
}); };
exports.insertDocuments = function (data) {
    log.print("inserting documents ...");
    db.collection('descriptors').insertOne(data, function (err, result) {
        console.log(err);
        Face_1.populateRegisteredMembersDescriptors;
    });
};
exports.findAllDocuments = function () {
    var id = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        id[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (id.length > 0) {
                        db.collection('descriptors').findOne({ '_id': new ObjectID(id[0]) }, function (err, docs) {
                            if (err) {
                                log.printErr(err);
                                return reject(err);
                            }
                            return resolve(docs);
                        });
                    }
                    else {
                        db.collection('descriptors').find().toArray(function (err, docs) {
                            if (err) {
                                log.printErr(err);
                                return reject(err);
                            }
                            return resolve(docs);
                        });
                    }
                })];
        });
    });
};
exports.findAllDocumentsByName = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                db.collection('descriptors').findOne({ 'name': name }, function (err, docs) {
                    if (err) {
                        log.printErr(err);
                        return reject(err);
                    }
                    return resolve(docs);
                });
            })];
    });
}); };
exports.findAllAttendances = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                db.collection('attendances').find().sort({ _id: -1 }).toArray(function (err, docs) {
                    if (err) {
                        log.printErr(err);
                        return reject(err);
                    }
                    return resolve(docs);
                });
            })];
    });
}); };
var updateAttendance = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                db.collection('attendances').insertOne(data, function (err, result) {
                    if (err) {
                        log.printErr(err);
                        return reject(err);
                    }
                    return resolve(result);
                });
            })];
    });
}); };
exports.checkIn = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        log.print("checking in ...");
        return [2 /*return*/, new Promise(function (resolve, reject) {
                exports.findAllDocumentsByName(name).then(function (object) {
                    updateCheckIn(object);
                }, function (error) {
                    log.printErr(error);
                });
            })];
    });
}); };
function updateCheckIn(object) {
    var date = new Date(Date.now()).toUTCString();
    var member = object;
    var data = {};
    data['member_id'] = object['_id'];
    data['date'] = date;
    data['name'] = member['name'];
    var query = { date: { $regex: "^" + date.substring(0, 15) }, member_id: data['member_id'] };
    db.collection('attendances').find(query).toArray(function (err, result) {
        if (err) {
            log.printErr(err);
        }
        if (result.length == 0) {
            log.print("checking in: " + data['name']);
            data['status'] = 0;
            updateAttendance(data);
        }
        else if (result.length == 1) {
            log.print("checking out: " + data['name']);
            data['status'] = 1;
            updateAttendance(data);
        }
        else {
            log.print("updating check out: " + data['name']);
            var attendant = result.find(function (x) { return x.status === 1; });
            db.collection('attendances').updateOne({ '_id': attendant['_id'] }, { $set: { 'date': date } }, function (err, result) {
                if (err) {
                    log.printErr(err);
                }
            });
        }
    });
}
