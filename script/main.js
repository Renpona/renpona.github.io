/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./frontend/clock.js":
/*!***************************!*\
  !*** ./frontend/clock.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initClock": () => (/* binding */ initClock),
/* harmony export */   "startClock": () => (/* binding */ startClock)
/* harmony export */ });
/* harmony import */ var _vts_script_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vts-script.js */ "./frontend/vts-script.js");
const utils = __webpack_require__(/*! ../vts_modules/utils */ "./vts_modules/utils.js");



var timeKeeper; // Stores the setInterval used to keep the clock running
var mode;

var currDisplay = {
    "Digit1": 0,
    "Digit2": 0,
    "Digit3": 0,
    "Digit4": 0,
    "separator": 1
};
const clockParams = ["separator", "Digit1", "Digit2", "Digit3", "Digit4"];

function initClock() {
    createParams();
}

function startClock(mode, data) {
    clearInterval(timeKeeper);

    let inputTime;
    let inputObject;

    if (mode == "timer") {
        inputTime = data.seconds;
        var direction = data.direction;
    } else if (mode == "number") {
        inputTime = data.number;
        inputObject = parseNumberToObject(inputTime, false);
    }
    
    switch (mode) {
        case "number":
            timeKeeper = setInterval(parseObjectToParams, 800, inputObject);
            break;
        case "timer":
            let startTime = Date.now();
            timeKeeper = setInterval(timer, 200, inputTime, startTime, direction);
            break;
        case "clock":
            timeKeeper = setInterval(realTimeClock, 800);
            break;
        case "disable":
        default:
            break;
    }
}

function createParams() {
    (0,_vts_script_js__WEBPACK_IMPORTED_MODULE_0__.createNewParameter)(clockParams[1], "clock digit", -1, 9, 0);
    (0,_vts_script_js__WEBPACK_IMPORTED_MODULE_0__.createNewParameter)(clockParams[2], "clock digit", -1, 9, 0);
    (0,_vts_script_js__WEBPACK_IMPORTED_MODULE_0__.createNewParameter)(clockParams[3], "clock digit", -1, 9, 0);
    (0,_vts_script_js__WEBPACK_IMPORTED_MODULE_0__.createNewParameter)(clockParams[4], "clock digit", -1, 9, 0);
    (0,_vts_script_js__WEBPACK_IMPORTED_MODULE_0__.createNewParameter)(clockParams[0], "clock colon", 0, 1, 1);
}

function realTimeClock() {
    let time = new Date();
    let hourData = parseHours(time);
    let minuteData = parseMinutes(time);
    Object.assign(hourData, minuteData);
    parseObjectToParams(hourData);
}

function parseHours(time) {
    let data = {};
    let hour = time.getHours();
    if (hour <= 29 && hour > 19) {
        data.Digit2 = hour - 20;
        data.Digit1 = 2;
    } else if (hour <= 19 && hour > 9) {
        data.Digit2 = hour - 10;
        data.Digit1 = 1;
    } else if (hour <= 9 && hour >= 0) {
        data.Digit2 = hour;
        data.Digit1 = 0;
    } else {
        console.error("weird shit happened");
    }
    return data;
}

function parseMinutes(time) {
    let data = {};
    let minute = time.getMinutes();

    if (minute <= 59 && minute > 49) {
        data.Digit4 = minute - 50;
        data.Digit3 = 5;
    } else if (minute <= 49 && minute > 39) {
        data.Digit4 = minute - 40;
        data.Digit3 = 4;
    } else if (minute <= 39 && minute > 29) {
        data.Digit4 = minute - 30;
        data.Digit3 = 3;
    } else if (minute <= 29 && minute > 19) {
        data.Digit4 = minute - 20;
        data.Digit3 = 2;
    } else if (minute <= 19 && minute > 9) {
        data.Digit4 = minute - 10;
        data.Digit3 = 1;
    } else if (minute <= 9 && minute > 0) {
        data.Digit4 = minute;
        data.Digit3 = 0;
    } else {
        console.error("weird shit happened");
    }
    return data;
}

function timer(inputTime, startTime, direction = "down") {
    //startTime is milliseconds
    //inputTime is seconds, convert to milliseconds
    let currentTime = Date.now();
    inputTime = inputTime * 1000;
    let timeElapsed = currentTime - startTime;
    let remainingTime = inputTime - timeElapsed;
    
    //console.log(remainingTime);
    if (remainingTime < 1) {
        clearInterval(timeKeeper);
    }
    if (direction == "up") {
        remainingTime = Math.floor(timeElapsed / 1000);
    } else {
        remainingTime = Math.floor(remainingTime / 1000);
    }
   
    //convert to seconds
    let minuteSecondValue = remainingTime / 60;
    //console.log(minuteSecondValue);
    let minutes = Math.floor(minuteSecondValue).toString().padStart(2, '0');
    let seconds = Math.floor((minuteSecondValue - minutes) * 60).toString().padStart(2, '0');

    let timeString = parseNumberToObject(minutes.toString().concat(seconds), true);
    parseObjectToParams(timeString);
}

function parseNumberToObject(inputNumber, separator) {
    let outputObject = {};
    inputNumber.padStart(4, '0');
    for (let i = 0; i < 4; i++) {
        let digit = i + 1;
        outputObject["Digit" + digit] = inputNumber.charAt(i);
    }
    if (separator === true) {
        outputObject.separator = 1;
    } else {
        outputObject.separator = 0;
    }
    return outputObject;
}

function parseObjectToParams(data) {
    let paramArray = [];
    for (let i = 0; i < clockParams.length; i++) {
        let currParam = clockParams[i];
        if (data[currParam] || data[currParam] == 0) {
            paramArray.push(sendSingleNumber(currParam, data[currParam]));
            currDisplay[currParam] = data[currParam];
        } else {
            paramArray.push(sendSingleNumber(currParam, currDisplay[currParam]));
        }
    }
    sendNumberRequest(paramArray);
}

function sendSingleNumber(param, value) {
    return utils.createParamValue(param, value);
}

function sendNumberRequest(paramArray) {
    let request = utils.buildRequest("InjectParameterDataRequest", {"parameterValues": paramArray});
    (0,_vts_script_js__WEBPACK_IMPORTED_MODULE_0__.sendRequest)(request);
}



/***/ }),

/***/ "./frontend/vts-script.js":
/*!********************************!*\
  !*** ./frontend/vts-script.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "eventEmitter": () => (/* binding */ eventEmitter),
/* harmony export */   "connect": () => (/* binding */ connect),
/* harmony export */   "parseResponse": () => (/* binding */ parseResponse),
/* harmony export */   "createNewParameter": () => (/* binding */ createNewParameter),
/* harmony export */   "sendRequest": () => (/* binding */ sendRequest)
/* harmony export */ });
const events = __webpack_require__(/*! events */ "./node_modules/events/events.js");
const utils = __webpack_require__(/*! ../vts_modules/utils.js */ "./vts_modules/utils.js");
const Auth = __webpack_require__(/*! ../vts_modules/auth-browser.js */ "./vts_modules/auth-browser.js");
const auth = new Auth();

const eventEmitter = new events.EventEmitter();
var vtsConnection = null;

function connect(port) {
    //var socket = new WebSocket("ws://0.0.0.0:" + port);
    var socket = new WebSocket("ws://localhost:" + port);

    // Connection opened
    socket.addEventListener('open', function (event) {
        //socket.send('Hello Server!');
        console.log("Connected to VTubeStudio on port " + port);
        socket.send(auth.checkForCredentials("Renpona", "VTuber clock"));
        vtsConnection = socket;
    });

    // Error
    socket.addEventListener('error', function (event) {
        connectionError(event);
    });

    socket.addEventListener('message', function (event) {
        //console.log('Received Message: ' + message.utf8Data);
        parseResponse(JSON.parse(event.data), socket);
    });

}

function connectionError(cause) {

}

function parseResponse(response, connection) {
    // Handle API Errors
    if (response.messageType == "APIError") {
        console.error(response.data);
        switch (response.data.errorID) {
            case 8: //RequestRequiresAuthetication 
            // Errors related to AuthenticationTokenRequest
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            // Errors related to AuthenticationRequest
            case 100:
            case 101:
            case 102:
                updateConnectionState(false, response.data.message);
                break;
            default:
                break;
        }
    }

    // Handle saving and sending Auth token
    if (!auth.token && response.messageType == "AuthenticationTokenResponse") {
        auth.token = response.data.authenticationToken;
        connection.send(auth.tokenAuth());
    }
    
    // Check for successful authentication
    else if (response.messageType == "AuthenticationResponse") {
        if (response.data.authenticated == true) {
            eventEmitter.emit("authComplete");
            updateConnectionState(true, "Connected and Authenticated to VTubeStudio!")
        } else {
            auth.invalidateToken();
            updateConnectionState(false, response.data.reason);
        }
    }
}

function sendRequest(request) {
    //console.log("SendRequest: ", request);
    vtsConnection.send(request);
}

function createNewParameter(paramName, explanation, min, max, defaultValue) {
    let request = utils.createNewParameter(paramName, explanation, min, max, defaultValue);
    //console.log("ParameterCreationRequest", request);
    vtsConnection.send(request);
}

function updateConnectionState(connected, message) {
    eventEmitter.emit("connectionState", connected, message);
};



/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./vts_modules/auth-browser.js":
/*!*************************************!*\
  !*** ./vts_modules/auth-browser.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const utils = __webpack_require__(/*! ./utils.js */ "./vts_modules/utils.js");

class Auth {
    constructor() {
        this.token = null;
        this.appName = null;
        this.devName = null;
        this.tokenSaved = false;
        this.storageName = "";
    }
    checkForCredentials(name, developer) {
        this.appName = name;
        this.devName = developer;
        this.storageName = "VTS " + this.appName;
        if (localStorage.getItem(this.storageName)) {
            this.tokenSaved = true;
            this.token = localStorage.getItem(this.storageName);
            return this.tokenAuth();
        } else {
            return this.requestToken(name, developer);
        }
    }
    requestToken(name, developer) {
        this.appName = name;
        this.devName = developer;
        let data = {
            "pluginName": this.appName,
            "pluginDeveloper": this.devName,
        };
        let request = utils.buildRequest("AuthenticationTokenRequest", data);
        console.log("Sent Message: " + request)
        return request;
    }
    tokenAuth() {
        let data = {
            "pluginName": this.appName,
            "pluginDeveloper": this.devName,
            "authenticationToken": this.token
        };
        let request = utils.buildRequest("AuthenticationRequest", data);
        console.log("Sent Message: " + request);
        if (this.tokenSaved == false) {
            localStorage.setItem(this.storageName, this.token);
        }
        return request;
    }
    invalidateToken() {
        localStorage.removeItem(this.storageName);
        this.tokenSaved = false;
    }
}

module.exports = Auth;

/***/ }),

/***/ "./vts_modules/utils.js":
/*!******************************!*\
  !*** ./vts_modules/utils.js ***!
  \******************************/
/***/ ((module) => {

const basicInfo = {
    "apiName": "VTubeStudioPublicAPI",
    "apiVersion": "1.0",
    "requestID": "testID"
}

function buildRequest(type, data, requestId = "testId") { 
    let request = basicInfo;
    request.messageType = type;
    request.requestID = requestId;
    request.data = data;
    let returnValue = JSON.stringify(request);
    //console.log(returnValue);
    return returnValue;
}

function createNewParameter(paramName, explanation, min, max, defaultValue) {
    let data = {
        "parameterName": paramName,
        "explanation": explanation,
        "min": min,
        "max": max,
        "defaultValue": defaultValue
    };
    return buildRequest("ParameterCreationRequest", data);
}

function createParamValue(id, value, weight = null) {
    let param = {
        "id": id,
        "value": value
    }
    if (weight) param.weight = weight;
    return param;
}

//exports.buildRequest = buildRequest;
module.exports = {
    buildRequest: buildRequest,
    createNewParameter: createNewParameter,
    createParamValue: createParamValue
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************************!*\
  !*** ./frontend/frontend-script.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vts_script_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vts-script.js */ "./frontend/vts-script.js");
/* harmony import */ var _clock_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./clock.js */ "./frontend/clock.js");



var connectionStatus = false;
initHandlers();

function initHandlers() {
    document.getElementById("modeSelect").addEventListener('input', controlsController);
    
    document.getElementById("connectBtn").addEventListener('click', () => (0,_vts_script_js__WEBPACK_IMPORTED_MODULE_0__.connect)(document.getElementById("portInput").value));
    document.getElementById("updateBtn").addEventListener('click', sendUpdatedValues);
    _vts_script_js__WEBPACK_IMPORTED_MODULE_0__.eventEmitter.on("connectionState", updateConnectionState);
    _vts_script_js__WEBPACK_IMPORTED_MODULE_0__.eventEmitter.once("authComplete", _clock_js__WEBPACK_IMPORTED_MODULE_1__.initClock);

    controlsController();
    displayMode("disable");
}

function updateConnectionState(connected, message) {
    connectionStatus = connected;
    document.getElementById("connectionState").textContent = message;
}

function sendUpdatedValues() {
    let mode = document.getElementById("modeSelect").value;
    let data = {};
    switch (mode) {
        case "disable":
            (0,_clock_js__WEBPACK_IMPORTED_MODULE_1__.startClock)("disable");
            break;
        case "clock":
            (0,_clock_js__WEBPACK_IMPORTED_MODULE_1__.startClock)("clock");
            break;
        case "timer":
            data.seconds = document.getElementById("timerSetting").value;
            data.direction = document.getElementById("timerStyle").value;
            (0,_clock_js__WEBPACK_IMPORTED_MODULE_1__.startClock)("timer", data);
            break;
        case "number":
            data.number = document.getElementById("inputVal").value;
            (0,_clock_js__WEBPACK_IMPORTED_MODULE_1__.startClock)("number", data);
            break;
        default:
            break;
    }
    displayMode(mode);
    
}

function displayMode(value) {
    if (value == "disable") value = "inactive";
    document.getElementById("modeStatus").textContent = value;
}

function controlsController() {
    let value = document.getElementById("modeSelect").value;
    let controls = document.querySelectorAll(".controls > div");
    controls.forEach((currentValue) => {
        if (currentValue.id == value) {
            currentValue.hidden = false;
        } else {
            currentValue.hidden = true;
        }
    });
}
})();

/******/ })()
;
//# sourceMappingURL=main.js.map