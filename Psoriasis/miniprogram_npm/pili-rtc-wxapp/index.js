module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getRoomAccessFromToken = getRoomAccessFromToken;
exports.timeout = timeout;
exports.request = request;
exports.rpcid = exports.diff = void 0;

var _jsBase = __webpack_require__(4);

var _functions = __webpack_require__(3);

/**
 * Pants module.
 * @module QNRTC/utils
 */

/**
 * get parsed RoomAceess Object
 * @param {String} token RoomToken
 * @returns {Object}
 */
function getRoomAccessFromToken(token) {
  var roomAccessString = token.split(':')[2];

  var decoedString = _jsBase.Base64.decode(roomAccessString);

  console.log(decoedString);
  return JSON.parse(decoedString);
}

function timeout(ms) {
  if (ms === void 0) {
    ms = 1000;
  }

  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, ms);
  });
}

var diff = function diff(prev, curr, identity1) {
  if (prev === void 0) {
    prev = [];
  }

  if (curr === void 0) {
    curr = [];
  }

  if (identity1 === void 0) {
    identity1 = _functions.identity;
  }

  var diff = {
    add: [],
    remove: []
  };

  if (prev.length === 0) {
    diff.add = curr;
    return diff;
  }

  if (curr.length === 0) {
    diff.remove = prev;
    return diff;
  }

  var prevIds = prev.map(identity1);
  var currIds = curr.map(identity1);
  prevIds.forEach(function (id, i) {
    if (currIds.indexOf(id) === -1) {
      diff.remove.push(prev[i]);
    }
  });
  currIds.forEach(function (id, i) {
    if (prevIds.indexOf(id) === -1) {
      diff.add.push(curr[i]);
    }
  });
  return diff;
};

exports.diff = diff;

var rpcid = function rpcid() {
  return Math.random().toString(36).substring(7);
};

exports.rpcid = rpcid;

function request(requestURL, options) {
  return new Promise(function (resolve, reject) {
    wx.request(Object.assign({
      url: requestURL
    }, options, {
      success: function success(res) {
        var code = res.statusCode;

        if (code >= 200 && code < 300) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: reject
    }));
  });
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.version = void 0;
var version = '1.1.1';
exports.version = version;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.groupBy = exports.find = exports.propNotEq = exports.prop = exports.identity = void 0;

var identity = function identity(x) {
  return x;
};

exports.identity = identity;

var prop = function prop(name) {
  return function (obj) {
    return obj[name];
  };
};

exports.prop = prop;

var propNotEq = function propNotEq(name, val) {
  return function (obj) {
    return obj[name] !== val;
  };
};

exports.propNotEq = propNotEq;

var find = function find(list, matchFn) {
  if (!list || list.length === 0) {
    return null;
  }

  return list.find(matchFn);
};

exports.find = find;

var groupBy = function groupBy(list, fn) {
  if (!list || list.length === 0) {
    return null;
  }

  var res = {};
  list.forEach(function (item) {
    var key = fn(item);

    if (res[key]) {
      res[key].push(item);
    } else {
      res[key] = [item];
    }
  });
  return res;
};

exports.groupBy = groupBy;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("js-base64");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports["default"] = exports.Qos = exports.QosEventType = void 0;

var _fingerprintjs = _interopRequireDefault(__webpack_require__(9));

var _blueimpMd = _interopRequireDefault(__webpack_require__(10));

var _gzipJs = _interopRequireDefault(__webpack_require__(11));

var _jsBase = __webpack_require__(4);

var _functions = __webpack_require__(3);

var _utils = __webpack_require__(0);

var _env = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var QNRTC_EVENTS_STORATE_KEY = 'qnrtcqosevents';
var QosEventType = {
  Init: 1,
  UnInit: 2,
  JoinRoom: 3,
  MCSAuth: 4,
  SignalAuth: 5,
  LeaveRoom: 6,
  PublisherPC: 7,
  PublishTracks: 8,
  UnPublishTracks: 9,
  SubscriberPC: 10,
  SubscribeTracks: 11,
  UnSubscribeTracks: 13,
  MuteTracks: 14,
  ICEConnectionState: 15,
  CallbackStatistics: 16,
  KickoutUser: 17,
  RoomStateChanged: 18,
  AudioDeviceInOut: 19,
  VideoDeviceInOut: 20,
  SDKError: 21,
  ApplicationState: 22,
  CreateMergeJob: 24,
  UpdateMergeTracks: 25,
  StopMerge: 26,
  DeviceChanged: 28,
  DefaultSetting: 29,
  MediaStatistics: 30,
  AbnormalDisconnect: 31,
  WechatPlayerStatus: 32,
  WechatPlayerStatistics: 33,
  WechatPusherStatus: 34,
  WechatPusherStatistics: 35
};
exports.QosEventType = QosEventType;

function noop() {}

function getDeviceId() {
  return new Promise(function (resolve) {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(function () {
        _fingerprintjs["default"].get(function (components) {
          var deviceId = (0, _blueimpMd["default"])(JSON.stringify(components));
          resolve(deviceId);
        });
      });
    } else {
      setTimeout(function () {
        _fingerprintjs["default"].get(function (components) {
          var deviceId = (0, _blueimpMd["default"])(JSON.stringify(components));
          resolve(deviceId);
        });
      }, 500);
    }
  });
}

function toUTF8Array(str) {
  var utf8 = [];

  for (var i = 0; i < str.length; i++) {
    var charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);else if (charcode < 0x800) {
      // eslint-disable-next-line
      utf8.push(0xc0 | charcode >> 6, 0x80 | charcode & 0x3f);
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      // eslint-disable-next-line
      utf8.push(0xe0 | charcode >> 12, 0x80 | charcode >> 6 & 0x3f, 0x80 | charcode & 0x3f);
    } else {
      // surrogate pair
      i++; // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      // eslint-disable-next-line

      charcode = 0x10000 + ((charcode & 0x3ff) << 10 | str.charCodeAt(i) & 0x3ff); // eslint-disable-next-line

      utf8.push(0xf0 | charcode >> 18, 0x80 | charcode >> 12 & 0x3f, 0x80 | charcode >> 6 & 0x3f, 0x80 | charcode & 0x3f);
    }
  }

  return new Uint8Array(utf8);
}

function loadStoredEvents() {
  var res;

  try {
    res = wx.getStorageSync(QNRTC_EVENTS_STORATE_KEY);
  } catch (e) {
    console.log('get storage error', e);
  }

  console.log('get item', res);

  try {
    wx.removeStorageSync(QNRTC_EVENTS_STORATE_KEY);
  } catch (e) {
    console.log('remove storage error', e);
  }

  if (!res) return;
  var events = JSON.parse(_jsBase.Base64.atob(decodeURIComponent(res))); // 没有 sessionid 或者 user_base 的数据将被丢弃

  return (events || []).filter(function (e) {
    return !!e.session_id && !!e.user_base;
  }).sort(function (a, b) {
    return a.event.timestamp - b.event.timestamp;
  });
}

var Qos = /*#__PURE__*/function () {
  function Qos() {
    var _this = this;

    getDeviceId().then(function (deviceId) {
      _this.deviceId = deviceId;
      _this.base.device_id = _this.deviceId;
      return deviceId;
    })["catch"](noop);
    this.events = [];
    this.sessionId = null;
    this.rpcId = null;
    this.userBase = null;
    var weappInfo = wx.getSystemInfoSync();
    this.base = {
      qos_version: '2',
      device_id: '',
      bundle_id: '',
      app_version: weappInfo.version,
      sdk_version: _env.version,
      device_model: weappInfo.model,
      os_platform: weappInfo.platform,
      os_version: weappInfo.system
    };
    this.deviceId = null;
    this.lastSubmitTime = Date.now();

    this._recoverStoredEvents();
  }

  var _proto = Qos.prototype;

  _proto.setSessionId = function setSessionId(sessionId) {
    for (var i = this.events.length - 1; i >= 0; --i) {
      var event = this.events[i];

      if (!event.session_id) {
        event.session_id = sessionId;
      }
    }

    this.sessionId = sessionId;
  };

  _proto.setRpcId = function setRpcId(rpcId) {
    this.rpcId = rpcId;
  };

  _proto.setUserBase = function setUserBase(userName, roomName, appId) {
    this.userBase = {
      user_id: userName,
      room_name: roomName,
      app_id: appId
    };

    for (var i = this.events.length - 1; i >= 0; --i) {
      var event = this.events[i];

      if (!event.user_base) {
        event.user_base = this.userBase;
      }
    }
  };

  _proto.addEvent = function addEvent(eventType, data, isForce) {
    var event = Object.assign({
      timestamp: Date.now(),
      event_id: QosEventType[eventType],
      event_name: eventType
    }, data);

    this._addEvent(event, isForce);
  };

  _proto._recoverStoredEvents = function _recoverStoredEvents() {
    var events = loadStoredEvents();
    if (!events) return;
    this.events = events;
  };

  _proto.saveEvents = function saveEvents() {
    var events = encodeURIComponent(_jsBase.Base64.btoa(JSON.stringify(this.events)));

    try {
      wx.setStorageSync(QNRTC_EVENTS_STORATE_KEY, events);
    } catch (e) {
      console.log('storage error', e);
    }
  };

  _proto._addEvent = function _addEvent(event, isForce) {
    this.events.push({
      user_base: this.userBase,
      event: event,
      session_id: this.sessionId,
      app_id: this.appId,
      rpc_id: this.rpcId
    });
    console.log('add event:', event, isForce);

    this._submit(isForce);
  };

  _proto._submit = function _submit(isForce) {
    var _this2 = this;

    var result = isForce ? true : this.submitCheck();

    if (!result) {
      this.saveEvents();
      return;
    }

    try {
      var submitData = this.encodeQosSubmitData();
      var qosReqs = submitData.map(function (data) {
        return (0, _utils.request)('https://pili-rtc-qos.qiniuapi.com/v1/rtcevent', {
          method: 'POST',
          header: {
            'Content-Type': 'application/x-gzip'
          },
          data: data.buffer
        }).then(function (res) {
          if (!res.ok) {
            throw new Error('error');
          }

          _this2.lastSubmitTime = Date.now();
          _this2.events = [];
          return res;
        });
      });
      Promise.all(qosReqs)["catch"](noop);
    } catch (e) {
      console.log(e);
    }
  };

  _proto.submitCheck = function submitCheck() {
    if (!this.sessionId || !this.deviceId || !this.userBase) return false;
    if (Date.now() - this.lastSubmitTime > 60000 * 5) return true;
    if (this.events.length >= 30) return true;
    return false;
  };

  _proto.encodeQosSubmitData = function encodeQosSubmitData() {
    var _this3 = this;

    var submitDataGroup = (0, _functions.groupBy)(this.events, function (e) {
      return e.session_id || '' + JSON.stringify(e.user_base);
    });
    var data = [];
    Object.values(submitDataGroup).forEach(function (events) {
      if (events.length > 0) {
        var submitData = {
          session_id: events[0].session_id,
          user_base: events[0].user_base,
          base: _this3.base,
          items: events.map(function (e) {
            return e.event;
          })
        };
        console.log('encode', submitData);
        var byteArray = new Uint8Array(_gzipJs["default"].zip(toUTF8Array(JSON.stringify(submitData))));
        data.push(byteArray);
      }
    });
    return data;
  };

  return Qos;
}();

exports.Qos = Qos;

var _default = new Qos();

exports["default"] = _default;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _RoomSession = _interopRequireDefault(__webpack_require__(7));

exports.RoomSession = _RoomSession["default"];

var _utils = _interopRequireDefault(__webpack_require__(0));

exports.util = _utils["default"];

var _env = __webpack_require__(2);

exports.version = _env.version;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/** @module QNRTC */
console.log('QNRTC_Version: ', _env.version);
/**
 * @namespace
 */

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports["default"] = void 0;

var _events = __webpack_require__(1);

var _Signaling = _interopRequireDefault(__webpack_require__(8));

var _utils = __webpack_require__(0);

var _qos = _interopRequireDefault(__webpack_require__(5));

var _functions = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * Pants module.
 * @module QNRTC/RoomSession
 */

/**
 * RoomSession.
 * @extends EventEmitter
 */
var RoomSession = /*#__PURE__*/function (_EventEmitter) {
  _inheritsLoose(RoomSession, _EventEmitter);

  function RoomSession(props) {
    var _this;

    _this = _EventEmitter.call(this) || this;
    _this.users = [];
    _this.tracks = [];
    _this.localTracks = [];
    _this.subscribedMap = {};
    _this.pushContext = null;
    _this.rtmphost = '';
    _this.signalingurl = 'wss://rtmpgate.cloudvdn.com/';
    _this.mergeJobs = [];
    _this.mergingJobs = [];

    if (props && props.server) {
      _this.signalingurl = props.server;
    }

    _qos["default"].addEvent('Init', {
      id: "track_" + Date.now()
    }); // 使用小程序的 getApp 方法


    if (typeof getApp === 'function') {
      // eslint-disable-next-line no-undef
      var app = getApp();
      app.qiniuQos = _qos["default"];
    }

    return _this;
  }
  /**
   * joinRoom.
   * @param {String} token [RoomToken]{@link https://doc.qnsdk.com/rtn/docs/server_overview#1}
   * @return {Promise<void>}
   */


  var _proto = RoomSession.prototype;

  _proto.joinRoomWithToken = function joinRoomWithToken(token, userData) {
    var _this2 = this;

    try {
      var roomAccess = (0, _utils.getRoomAccessFromToken)(token);
      this.userId = roomAccess.userId;
      this.roomName = roomAccess.roomName;
      this.appId = roomAccess.appId;
      this.token = token;
      this.userData = userData;

      _qos["default"].addEvent('JoinRoom', {
        room_token: token,
        user_data: userData
      });
    } catch (error) {
      return Promise.reject(error);
    }

    this.ws = new _Signaling["default"](this.signalingurl, this.appId, token, this.userId, this.roomName, userData);
    this.ws.on('#message', this.onMessage.bind(this));
    this.ws.on('@error', this.onError.bind(this));
    this.ws.on('#closed', function (data) {
      _this2.releaseRoom(data);

      _this2.emit('disconnected', data);
    });
    return this.ws.init().then(function (data) {
      console.log('init', data);
      _this2.users = data.players || [];
      _this2.tracks = data.tracks || [];
      _this2.rtmptoken = data.rtmptoken;
      _this2.rtmphost = data.rtmphost;

      _this2.ws.on('connected', _this2.onConnected.bind(_this2));

      _this2.ws.on('reconnecting', function () {
        return _this2.emit('reconnecting');
      });

      return data;
    });
  };

  _proto.updatePushContext = function updatePushContext(pushContext) {
    this.pushContext = pushContext;
  };

  _proto.onConnected = function onConnected(data) {
    var _this3 = this;

    console.log('connected', data);
    this.emit('reconnected');
    this.rtmptoken = data.rtmptoken;
    this.rtmphost = data.rtmphost;
    var users = data.players || [];
    var tracks = (data.tracks || []).filter((0, _functions.propNotEq)('playerid', this.userId));
    var usersdiff = (0, _utils.diff)(this.users, users, (0, _functions.prop)('playerid'));
    var tracksdiff = (0, _utils.diff)(this.tracks, tracks, (0, _functions.prop)('trackid'));
    return Promise.resolve().then(function () {
      usersdiff.remove.forEach(_this3.handlePlayerOut, _this3);

      if (tracksdiff.remove.length > 0) {
        _this3.handleRemoveTracks({
          tracks: tracksdiff.remove
        });
      }

      usersdiff.add.forEach(_this3.handlePlayerIn, _this3);

      if (tracksdiff.add.length > 0) {
        _this3.handleAddTracks({
          tracks: tracksdiff.add
        });
      }

      return true;
    });
  };

  _proto.onError = function onError(e) {
    this.emit('error', e);
  };

  _proto.onMessage = function onMessage(type, data) {
    console.log("[onmessage] " + type + ": " + JSON.stringify(data));

    switch (type) {
      case 'on-player-in':
        {
          this.handlePlayerIn(data);
          break;
        }

      case 'on-player-out':
        {
          this.handlePlayerOut(data);
          break;
        }

      case 'on-add-tracks':
        {
          this.handleAddTracks(data);
          break;
        }

      case 'on-remove-tracks':
        {
          this.handleRemoveTracks(data);
          break;
        }

      case 'on-add-local-tracks':
        {
          this.handleAddLocalTracks(data);
          break;
        }

      case 'on-remove-local-tracks':
        {
          this.handleRemoveLocalTracks(data);
          break;
        }

      case 'disconnect':
        {
          this.emit('disconnect', data);
          this.leaveRoom(data);
          break;
        }

      case 'create-merge-job-res':
        {
          this.handleCreateMergeJob(data);
          break;
        }

      case 'update-merge-tracks-res':
        {
          this.handleUpdateMergeTracks(data);
          break;
        }

      case 'stop-merge-res':
        {
          this.handleStopMerge(data);
          break;
        }

      case 'on-messages':
        {
          this.handleOnMessages(data);
          break;
        }

      default:
    }
  };

  _proto.handlePlayerIn = function handlePlayerIn(data) {
    var index = this.users.indexOf(function (value) {
      return value.playerid === data.playerid;
    });

    if (index !== -1) {
      this.users[index] = data;
    } else {
      this.users.push(data);
    }

    this.emit('user-join', data);
  };

  _proto.handlePlayerOut = function handlePlayerOut(data) {
    this.users = this.users.filter(function (value) {
      return value.playerid !== data.playerid;
    });
    /**
      * user-leave event.
      *
      * @event RoomSession#user-leave
      * @type {Object}
      * @property {String} playerid - userid.
      */

    this.emit('user-leave', data);
  };

  _proto.handleAddTracks = function handleAddTracks(data) {
    var _this4 = this;

    data.tracks.forEach(function (track) {
      var index = _this4.tracks.indexOf(function (value) {
        return value.trackid === track.trackid;
      });

      if (index !== -1) {
        _this4.tracks[index] = track;
      } else {
        _this4.tracks.push(track);
      }
    });
    this.emit('track-add', data.tracks);
  };

  _proto.handleRemoveTracks = function handleRemoveTracks(data) {
    this.tracks = this.tracks.filter(function (value) {
      return !data.tracks.some(function (v) {
        return v.trackid === value.trackid;
      });
    });
    this.emit('track-remove', data.tracks);
  };

  _proto.handleAddLocalTracks = function handleAddLocalTracks(data) {
    this.localTracks = data.tracks;
    this.emit('local-track-add', data.tracks);
  };

  _proto.handleRemoveLocalTracks = function handleRemoveLocalTracks(data) {
    // 本地 track 同时断开
    this.localTracks = [];
    this.emit('local-track-remove', data.tracks);
  };

  _proto.handleCreateMergeJob = function handleCreateMergeJob(data) {
    if (data.code === 0) {
      var newMergeJob = this.newMergeJob;
      this.mergeJobs.push(newMergeJob);
      this.newMergeJob = null;
      this.emit('merge-job-create', newMergeJob, this.mergeJobs);
    }
  };

  _proto.handleUpdateMergeTracks = function handleUpdateMergeTracks(data) {
    var job = (0, _functions.find)(this.mergeJobs, function (job) {
      return job.rpcid === data.rpcid;
    });

    if (data.code !== 0 || !job) {
      return;
    }

    if (this.mergingJobs.indexOf(job.id) === -1) {
      this.mergingJobs.push(job.id);
    }

    this.emit('merge-update', job, this.mergeJobs);
  };

  _proto.handleStopMerge = function handleStopMerge(data) {
    var job = (0, _functions.find)(this.mergeJobs, function (job) {
      return job.rpcid === data.rpcid;
    });

    if (data.code !== 0 || !job) {
      return;
    }

    this.mergeJobs = this.mergeJobs.filter(function (job) {
      return job.rpcid !== data.rpcid;
    });
    this.mergingJobs = this.mergingJobs.filter(function (jobid) {
      return jobid !== job.id;
    });
    this.emit('merge-stop', job, this.mergeJobs);
  };

  _proto.handleOnMessages = function handleOnMessages(data) {
    this.emit('message-recv', data);
  };

  _proto.publish = function publish() {
    return "rtmp://" + this.rtmphost + "/?rtmptoken=" + this.rtmptoken + "&playerid=" + this.userId;
  };

  _proto.subscribe = function subscribe(playerid) {
    if (!this.tracks || playerid === this.userId) {
      return;
    }

    var tracks = this.tracks.filter(function (v) {
      return v.playerid === playerid && v.master;
    });

    if (tracks.length === 0) {
      return;
    }

    var trackids = tracks.map(function (v) {
      return v.trackid;
    });

    _qos["default"].addEvent('SubscribeTracks', {
      result_code: 0,
      signal_take_time: 0,
      tracks: (tracks || []).map(function (t) {
        return {
          track_id: t.trackid,
          status: t.status
        };
      })
    });

    return "rtmp://" + this.rtmphost + "/?rtmptoken=" + this.rtmptoken + "&trackid=" + trackids.join('&trackid=') + "&playerid=" + playerid;
  };

  _proto.createMergeJob = function createMergeJob(jobid, options) {
    if (this.newMergeJob) {
      return;
    }

    var defaultMergeJob = {
      publishUrl: '',
      audioOnly: '',
      height: '',
      width: '',
      fps: '',
      kbps: '',
      minRate: '',
      maxRate: '',
      stretchMode: 'aspectFill',
      watermarks: [],
      background: {}
    }; // 需要用 rpcid 来判定后端响应的 job

    this.newMergeJob = Object.assign(defaultMergeJob, options, {
      id: jobid,
      rpcid: (0, _utils.rpcid)()
    });
    return this.ws.sendCreateMergeJob(this.newMergeJob);
  };

  _proto.updateMergeTracks = function updateMergeTracks(updateOpt) {
    return this.ws.sendUpdateMergeTracks(updateOpt);
  };

  _proto.addMergeTracks = function addMergeTracks(trackOpts, jobid) {
    return this.updateMergeTracks({
      id: jobid,
      add: trackOpts
    });
  };

  _proto.removeMergeTracks = function removeMergeTracks(trackOpts, jobid) {
    return this.updateMergeTracks({
      id: jobid,
      remove: trackOpts
    });
  };

  _proto.stopMerge = function stopMerge(jobid) {
    return this.ws.sendStopMerge(jobid);
  };

  _proto.sendMessage = function sendMessage(target, text) {
    return this.ws.sendSendMessage(target, text);
  };

  _proto.leaveRoom = function leaveRoom(data) {
    if (this.ws) {
      _qos["default"].addEvent('LeaveRoom', {
        leave_reason_code: data && data.code
      }, true);

      return this.ws.send('disconnect').then(this.releaseRoom.bind(this))["catch"](this.releaseRoom.bind(this));
    }
  };

  _proto.releaseRoom = function releaseRoom(data) {
    _qos["default"].addEvent('LeaveRoom', {
      leave_reason_code: data.code
    }, true);

    this.removeAllListeners();

    _qos["default"].addEvent('UnInit', {
      id: "track_" + Date.now()
    }, true);

    if (this.ws) {
      this.ws.close();
    }
  };

  return RoomSession;
}(_events.EventEmitter);

exports["default"] = RoomSession;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports["default"] = exports.SignalingState = void 0;

var _events = __webpack_require__(1);

var _env = __webpack_require__(2);

var _utils = __webpack_require__(0);

var _qos = _interopRequireDefault(__webpack_require__(5));

var _WebSocket = _interopRequireDefault(__webpack_require__(12));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var SignalingState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};
/**
 * @ingore
 * RoomSession.
 * @extends EventEmitter
 */

exports.SignalingState = SignalingState;

var Signaling = /*#__PURE__*/function (_EventEmitter) {
  _inheritsLoose(Signaling, _EventEmitter);

  /**
   * constructor
   * @param {String} url Signaling url
   * @param {String} appId AppID
   * @param {String} token accessToken
   * @param {String} userId UserID
   * @param {String} roomName roomName
   * @param {String} userData userData
   */
  function Signaling(url, appId, token, userId, roomName, userData) {
    var _this;

    _this = _EventEmitter.call(this) || this;
    _this.url = url;
    _this.app = appId;
    _this.accessToken = token;
    _this.user = userId;
    _this.room = roomName;
    _this.userData = userData || '';
    _this.reconnectTimeout = 10000;

    _qos["default"].setUserBase(userId, roomName, appId);

    return _this;
  }
  /**
   * @return {Promise<Object>} Auth data
   */


  var _proto = Signaling.prototype;

  _proto.init = function init() {
    var _this2 = this;

    return new Promise(function (resolve, reject) {
      _this2.changeState(SignalingState.CONNECTING);

      _this2.startAuthTime = Date.now();

      if (_this2.ws) {
        _this2.ws.silentClose();
      }

      var ws = new _WebSocket["default"](_this2.url);
      ws.on('open', function () {
        console.log('socketopen');
        resolve(_this2.sendAuth().then(function (data) {
          _this2.changeState(SignalingState.OPEN);

          _qos["default"].addEvent('SignalAuth', {
            auth_start_time: _this2.startAuthTime,
            auth_dns_time: 0,
            auth_server_ip: '',
            auth_error_code: data.code,
            auth_error_message: data.error,
            auth_take_time: Date.now() - _this2.startAuthTime,
            access_token: _this2.accessToken
          });

          ws.off('close', reject);
          ws.on('close', _this2.onClose.bind(_this2));
          _this2.rtmptoken = data.rtmptoken;

          _this2.changeState(SignalingState.OPEN);

          _this2.emit('connected', data);

          return data;
        }));
      });
      ws.on('close', reject);
      ws.on('message', _this2.onMessage.bind(_this2));
      _this2.ws = ws;
    });
  }
  /**
   * onOpen handler
   * @param {Object} res response
   */
  ;

  _proto.onOpen = function onOpen(res) {
    console.log('on socket open', res);
    this.emit('#open', res);
  }
  /* eslint-disable */

  /**
   * onClose handler
   */
  ;

  _proto.onClose = function onClose(res) {
    console.log('on socket close: ', res.code);

    if (this.startAuthTime) {
      _qos["default"].addEvent('SignalAuth', {
        auth_start_time: this.startAuthTime,
        auth_dns_time: 0,
        auth_server_ip: "",
        auth_error_code: res.code,
        auth_error_message: res.reason,
        auth_take_time: Date.now() - this.startAuthTime,
        access_token: this.accessToken
      });
    }

    switch (Number(res.code)) {
      case 1000:
        {
          this.changeState(SignalingState.CLOSED);
          this.emit('#closed', res);
          break;
        }

      case 1001:
        {
          this.reconnect();
          break;
        }

      case 1005:
        {
          // No status code was actually present.
          this.reconnect();
          break;
        }

      case 1006:
        {
          this.reconnect();
          break;
        }

      case 1011:
        {
          this.reconnect();
          break;
        }
      // https://www.ietf.org/mail-archive/web/hybi/current/msg09670.html

      case 1012:
        {
          // the service is restarted. a client may reconnect,
          // and if it choses to do, should reconnect using a randomized delay of 5 - 30s.
          this.reconnect(5000);
          break;
        }

      case 1013:
        {
          // The server is terminating the connection due to a temporary condition,
          // e.g. it is overloaded and is casting off some of its clients.
          this.reconnect();
          break;
        }

      case 1014:
        {
          // This is similar to 502 HTTP Status Code.
          this.reconnect(5000);
          break;
        }

      default:
        {
          // Others
          break;
        }
    }
  }
  /* eslint-enable */

  /**
   * onRrror handler
   * @param {String} res.errMsg 错误信息
   */
  ;

  _proto.onError = function onError(res) {
    console.log('on socket error', res);
    this.emit('#error', res);
  }
  /**
   * onMessage handler
   * @param {(String|ArrayBuffer)} data message data
   */
  ;

  _proto.onMessage = function onMessage(_ref) {
    var data = _ref.data;
    console.info(Date.now().toLocaleString() + ' onmessage ' + data);
    var index = data.indexOf('=');

    if (index > 0) {
      var msgType = data.substring(0, index);
      var payload = JSON.parse(data.substring(index + 1));
      this.receiveWsMsg(msgType, payload);
    }
  };

  _proto.receiveWsMsg = function receiveWsMsg(msgType, payload) {
    if (msgType === 'on-rtmp-conn-closed') {
      _qos["default"].addEvent('AbnormalDisconnect', {
        event_reason: 'on-rtmp-conn-closed',
        event_description: payload.error
      });
    } else if (msgType === 'ping') {
      this.handlePing();
    } else if (payload.rpcid) {
      this.emit("#message#" + payload.rpcid, msgType, payload);
    } else {
      this.emit('#message', msgType, payload);
    }
  }
  /**
   * 通过 WebSocket 连接发送数据
   * @param {String} type message type
   * @param {Object} message POJO
   * @param {Object} param 通过 WebSocket 连接发送数据
   * @param {(String|ArrayBuffer)} param.data 需要发送的内容
   * @param {successCallback=} param.success 接口调用成功的回调函数
   * @param {successCallback=} param.fail 接口调用失败的回调函数
   * @param {successCallback=} param.complete 接口调用结束的回调函数
   */
  ;

  _proto.send = function send(type, message) {
    if (message === void 0) {
      message = {};
    }

    if (!this.ws) {
      return;
    }

    var data = type + "=" + JSON.stringify(message);
    return this.ws.send(data);
  };

  _proto.request = function request(type, message) {
    var _this3 = this;

    if (message === void 0) {
      message = {};
    }

    return new Promise(function (resolve, reject) {
      // 在请求中没有携带 rpcid 的时候添加 rpcid
      if (!message.rpcid) {
        message.rpcid = (0, _utils.rpcid)();

        _qos["default"].setRpcId(message.rpcid);
      }

      _this3.send(type, message)["catch"](reject);

      console.log('send: ' + type + JSON.stringify(message));

      _this3.once("#message#" + message.rpcid, function (type, data) {
        console.log('recv:', type, data);

        if (data.code === 0) {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  };

  _proto.close = function close() {
    if (this.reconnectTimeoutID) {
      clearTimeout(this.reconnectTimeoutID);
    }

    if (!this.ws) {
      return;
    }

    this.ws.close();
  };

  _proto.handlePing = function handlePing() {
    var _this4 = this;

    this.send('pong', {});

    if (this.reconnectTimeoutID) {
      clearTimeout(this.reconnectTimeoutID);
    }

    this.reconnectTimeoutID = setTimeout(function () {
      console.log('signaling: websocket heartbeat timeout');

      _this4.emit('timeout', 'signaling: websocket heartbeat timeout');

      _this4.reconnect();
    }, 9000);
  };

  _proto.changeState = function changeState(state) {
    _qos["default"].addEvent('RoomStateChanged', {
      room_state: state
    });

    this._state = state;
  };

  _proto.reconnect = function reconnect(time) {
    var _this5 = this;

    if (time === void 0) {
      time = 1000;
    }

    // 每次连接已经确认断开后，本地 heartbeat 都需要删除
    if (this.reconnectTimeoutID) {
      clearTimeout(this.reconnectTimeoutID);
    }

    if (this._state === SignalingState.CLOSED) {
      this.ws.silentClose();
      this.emit('#error');
      return Promise.resolve();
    }

    if (this.reconnectPromise) {
      return this.reconnectPromise;
    }

    if (this.reconnectTimeoutID === undefined) {
      this.reconnectTimeoutID = setTimeout(function () {
        _this5.changeState(SignalingState.CLOSED);

        _this5.reconnectTimeoutID = undefined;
      }, this.reconnectTimeout);
    }

    this.changeState(SignalingState.CONNECTING);
    this.emit('reconnecting');
    console.log('signaling: websocket reconnecting');
    this.reconnectPromise = (0, _utils.timeout)(time).then(this.init.bind(this)).then(function (res) {
      _this5.reconnectPromise = undefined;
      console.log('signaling: websocket reconnected');
      return res;
    })["catch"](function (e) {
      _this5.reconnectPromise = undefined;

      if (e.code) {
        if (e.code === 10001) {
          _this5.changeState(SignalingState.CLOSED);
        } else {
          return _this5.reconnect();
        }
      }

      console.log('signaling: websocket reconnect fail', e);

      _this5.ws.close();

      _this5.emit('@error', e);

      return Promise.reject(e);
    });
    return this.reconnectPromise;
  };

  _proto.sendAuth = function sendAuth() {
    var params;

    if (this.rtmptoken) {
      params = {
        rtmptoken: this.rtmptoken
      };
    } else {
      params = {
        app: this.app,
        agent: 'wechat miniprogram',
        roomtoken: this.accessToken,
        sdkversion: _env.version,
        room: this.room,
        user: this.user,
        playerdata: this.userData
      };
    }

    _qos["default"].setSessionId(params.rtmptoken || params.roomtoken);

    return this.request('auth', params);
  };

  _proto.sendCreateMergeJob = function sendCreateMergeJob(options) {
    var startTime = Date.now();
    return this.request('create-merge-job', options).then(function (data) {
      _qos["default"].addEvent('CreateMergeJob', {
        signal_take_time: Date.now() - startTime,
        id: options.id,
        result_code: data.code
      });

      return data;
    });
  };

  _proto.sendUpdateMergeTracks = function sendUpdateMergeTracks(options) {
    _qos["default"].addEvent('UpdateMergeTracks', {
      id: options.id,
      add: (options.add || []).map(function (t) {
        return {
          track_id: t.trackid,
          x: t.x || 0,
          y: t.y || 0,
          w: t.w || 0,
          h: t.h || 0,
          z: t.z || 0
        };
      }),
      remove: (options.remove || []).map(function (t) {
        return {
          track_id: t.trackid,
          x: t.x || 0,
          y: t.y || 0,
          w: t.w || 0,
          h: t.h || 0,
          z: t.z || 0
        };
      })
    });

    return this.request('update-merge-tracks', options);
  };

  _proto.sendStopMerge = function sendStopMerge(id) {
    _qos["default"].addEvent('StopMerge', {
      id: id
    });

    return this.request('stop-merge', {
      id: id
    });
  };

  _proto.sendSendMessage = function sendSendMessage(target, text) {
    var params = {
      msgid: (0, _utils.rpcid)(),
      target: target,
      type: 'normal',
      text: text
    };
    return this.request('send-message', params);
  };

  return Signaling;
}(_events.EventEmitter);

exports["default"] = Signaling;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("fingerprintjs2");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("blueimp-md5");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("gzip-js");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports["default"] = void 0;

var _events = __webpack_require__(1);

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var WebSocket = /*#__PURE__*/function (_EventEmitter) {
  _inheritsLoose(WebSocket, _EventEmitter);

  function WebSocket(url) {
    var _this;

    _this = _EventEmitter.call(this) || this;
    _this.socketTask = wx.connectSocket({
      url: url,
      success: function success(msg) {
        console.log('success:' + JSON.stringify(msg));
      },
      fail: function fail(data) {
        console.log('fail:' + JSON.stringify(data));
      }
    });

    _this.socketTask.onClose(_this.emit.bind(_assertThisInitialized(_this), 'close'));

    _this.socketTask.onError(_this.emit.bind(_assertThisInitialized(_this), 'error'));

    _this.socketTask.onMessage(_this.emit.bind(_assertThisInitialized(_this), 'message'));

    _this.socketTask.onOpen(_this.emit.bind(_assertThisInitialized(_this), 'open'));

    return _this;
  }

  var _proto = WebSocket.prototype;

  _proto.send = function send(data) {
    var _this2 = this;

    return new Promise(function (resolve, reject) {
      try {
        _this2.socketTask.send({
          data: data,
          success: resolve,
          fail: reject
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  _proto.close = function close() {
    return this.socketTask.close();
  };

  _proto.silentClose = function silentClose() {
    this.removeAllListeners();
    return this.socketTask.close();
  };

  return WebSocket;
}(_events.EventEmitter);

exports["default"] = WebSocket;

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map