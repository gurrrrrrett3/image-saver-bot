"use strict";
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
var discord_js_1 = __importDefault(require("discord.js"));
var fs_1 = __importDefault(require("fs"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var config_json_1 = require("./config.json");
var Client = new discord_js_1.default.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
});
Client.login(config_json_1.token);
Client.once("ready", function () { return __awaiter(void 0, void 0, void 0, function () {
    var guild, _a, _b, _c, channelCount, messageCount, fileCount, member;
    var _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                console.log("Logged in as " + ((_d = Client.user) === null || _d === void 0 ? void 0 : _d.tag));
                guild = Client.guilds.cache.get(config_json_1.serverID);
                if (!guild) {
                    console.log("Could not find guild. Am I added to the guild?");
                    process.exit();
                }
                _b = (_a = console).log;
                _c = "Found guild:\nName: " + guild.name + "\nChannels: ";
                return [4 /*yield*/, guild.channels.fetch()];
            case 1:
                _b.apply(_a, [_c + (_g.sent()).size + "\nMembers: " + guild.memberCount]);
                channelCount = 0;
                messageCount = 0;
                fileCount = 0;
                member = guild.members.cache.get((_f = (_e = Client.user) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : "");
                if (!member)
                    return [2 /*return*/];
                guild.channels.cache.forEach(function (channel) { return __awaiter(void 0, void 0, void 0, function () {
                    var c, messageFetchLoop_1, lastMessage_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!channel.permissionsFor(member).has("VIEW_CHANNEL")) {
                                    console.log("Missing permissions for " + channel.name + ", Skipping");
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, channel.fetch()];
                            case 1:
                                c = _a.sent();
                                if (!c.isText()) return [3 /*break*/, 4];
                                messageFetchLoop_1 = true;
                                lastMessage_1 = undefined;
                                channelCount++;
                                _a.label = 2;
                            case 2:
                                if (!messageFetchLoop_1) return [3 /*break*/, 4];
                                return [4 /*yield*/, c.messages
                                        .fetch({
                                        limit: 100,
                                        before: lastMessage_1 ? lastMessage_1 : undefined,
                                    })
                                        .then(function (collection) { return __awaiter(void 0, void 0, void 0, function () {
                                        var f;
                                        var _a, _b;
                                        return __generator(this, function (_c) {
                                            console.log(channelCount + " Channels Processed | " + messageCount + " Messages processed | " + fileCount + " files processed | Batch Size: " + collection.size);
                                            messageCount += collection.size;
                                            lastMessage_1 =
                                                (_b = (_a = collection.at(collection.size - 1)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
                                            if (collection.size < 100) {
                                                messageFetchLoop_1 = false;
                                            }
                                            f = collection.filter(function (m) { return m.attachments.size > 0; });
                                            f.forEach(function (message) { return __awaiter(void 0, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    message.attachments.forEach(function (attatchment) { return __awaiter(void 0, void 0, void 0, function () {
                                                        return __generator(this, function (_a) {
                                                            (0, node_fetch_1.default)(attatchment.url).then(function (res) { return __awaiter(void 0, void 0, void 0, function () {
                                                                var b;
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0: return [4 /*yield*/, res.buffer()];
                                                                        case 1:
                                                                            b = _a.sent();
                                                                            directoryCheck("./data/" + channel.name + "/");
                                                                            fs_1.default.writeFileSync("./data/" + channel.name + "/" + attatchment.name, b);
                                                                            fileCount++;
                                                                            return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); }).catch(function (err) {
                                                                console.log("Failed Fetch, skipping");
                                                            });
                                                            return [2 /*return*/];
                                                        });
                                                    }); });
                                                    return [2 /*return*/];
                                                });
                                            }); });
                                            if (!messageFetchLoop_1)
                                                return [2 /*return*/];
                                            return [2 /*return*/];
                                        });
                                    }); })];
                            case 3:
                                _a.sent();
                                return [3 /*break*/, 2];
                            case 4:
                                channelCount++;
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
function directoryCheck(dir) {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    return;
}
