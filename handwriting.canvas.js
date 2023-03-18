(function(window, document) {

    // Establish the root object, `window` (`self`) in the browser, 
    // or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self === 'object' && self.self === self && self || this;

    // Create a safe reference to the handwriting object for use below.        
    var handwriting = function(obj) {
        if (obj instanceof handwriting) return obj;
        if (!(this instanceof handwriting)) return new handwriting(obj);
        this._wrapped = obj;
    };

    root.handwriting = handwriting;

    handwriting.Canvas = function(cvs, lineWidth) {
        this.canvas = cvs;
        this.cxt = cvs.getContext("2d");
        this.cxt.lineCap = "round";
        this.cxt.lineJoin = "round";
        this.lineWidth = lineWidth || 3;
        this.width = cvs.width;
        this.height = cvs.height;
        this.drawing = false;
        this.handwritingX = [];
        this.handwritingY = [];
        this.trace = [];
        this.options = {};
        this.step = [];
        this.redo_step = [];
        this.redo_trace = [];
        this.allowUndo = false;
        this.allowRedo = false;
        cvs.addEventListener("mousedown", this.mouseDown.bind(this));
        cvs.addEventListener("mousemove", this.mouseMove.bind(this));
        cvs.addEventListener("mouseup", this.mouseUp.bind(this));
        cvs.addEventListener("touchstart", this.touchStart.bind(this));
        cvs.addEventListener("touchmove", this.touchMove.bind(this));
        cvs.addEventListener("touchend", this.touchEnd.bind(this));
        this.callback = undefined;
        this.recognize = handwriting.recognize;
    };
    /**
     * [toggle_Undo_Redo description]
     * @return {[type]} [description]
     */
    handwriting.Canvas.prototype.set_Undo_Redo = function(undo, redo) {
        this.allowUndo = undo;
        this.allowRedo = undo ? redo : false;
        if (!this.allowUndo) {
            this.step = [];
            this.redo_step = [];
            this.redo_trace = [];
        }
    };

    handwriting.Canvas.prototype.setLineWidth = function(lineWidth) {
        this.lineWidth = lineWidth;
    };

    handwriting.Canvas.prototype.setCallBack = function(callback) {
        this.callback = callback;
    };

    handwriting.Canvas.prototype.setOptions = function(options) {
        this.options = options;
    };


    handwriting.Canvas.prototype.mouseDown = function(e) {
        // new stroke
        this.cxt.lineWidth = this.lineWidth;
        this.handwritingX = [];
        this.handwritingY = [];
        this.drawing = true;
        this.cxt.beginPath();
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.cxt.moveTo(x, y);
        this.handwritingX.push(x);
        this.handwritingY.push(y);
    };


    handwriting.Canvas.prototype.mouseMove = function(e) {
        if (this.drawing) {
            var rect = this.canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            this.cxt.lineTo(x, y);
            this.cxt.stroke();
            this.handwritingX.push(x);
            this.handwritingY.push(y);
        }
    };

    handwriting.Canvas.prototype.mouseUp = function() {
        var w = [];
        w.push(this.handwritingX);
        w.push(this.handwritingY);
        w.push([]);
        this.trace.push(w);
        this.drawing = false;
        if (this.allowUndo) this.step.push(this.canvas.toDataURL());
    };


    handwriting.Canvas.prototype.touchStart = function(e) {
        e.preventDefault();
        this.cxt.lineWidth = this.lineWidth;
        this.handwritingX = [];
        this.handwritingY = [];
        var de = document.documentElement;
        var box = this.canvas.getBoundingClientRect();
        var top = box.top + window.pageYOffset - de.clientTop;
        var left = box.left + window.pageXOffset - de.clientLeft;
        var touch = e.changedTouches[0];
        touchX = touch.pageX - left;
        touchY = touch.pageY - top;
        this.handwritingX.push(touchX);
        this.handwritingY.push(touchY);
        this.cxt.beginPath();
        this.cxt.moveTo(touchX, touchY);
    };

    handwriting.Canvas.prototype.touchMove = function(e) {
        e.preventDefault();
        var touch = e.targetTouches[0];
        var de = document.documentElement;
        var box = this.canvas.getBoundingClientRect();
        var top = box.top + window.pageYOffset - de.clientTop;
        var left = box.left + window.pageXOffset - de.clientLeft;
        var x = touch.pageX - left;
        var y = touch.pageY - top;
        this.handwritingX.push(x);
        this.handwritingY.push(y);
        this.cxt.lineTo(x, y);
        this.cxt.stroke();
    };

    handwriting.Canvas.prototype.touchEnd = function(e) {
        var w = [];
        w.push(this.handwritingX);
        w.push(this.handwritingY);
        w.push([]);
        this.trace.push(w);
        if (this.allowUndo) this.step.push(this.canvas.toDataURL());
    };

    handwriting.Canvas.prototype.undo = function() {
        if (!this.allowUndo || this.step.length <= 0) return;
        else if (this.step.length === 1) {
            if (this.allowRedo) {
                this.redo_step.push(this.step.pop());
                this.redo_trace.push(this.trace.pop());
                this.cxt.clearRect(0, 0, this.width, this.height);
            }
        } else {
            if (this.allowRedo) {
                this.redo_step.push(this.step.pop());
                this.redo_trace.push(this.trace.pop());
            } else {
                this.step.pop();
                this.trace.pop();
            }
            loadFromUrl(this.step.slice(-1)[0], this);
        }
    };

    handwriting.Canvas.prototype.redo = function() {
        if (!this.allowRedo || this.redo_step.length <= 0) return;
        this.step.push(this.redo_step.pop());
        this.trace.push(this.redo_trace.pop());
        loadFromUrl(this.step.slice(-1)[0], this);
    };

    handwriting.Canvas.prototype.erase = function() {
        this.cxt.clearRect(0, 0, this.width, this.height);
        this.step = [];
        this.redo_step = [];
        this.redo_trace = [];
        this.trace = [];
    };

    function loadFromUrl(url, cvs) {
        var imageObj = new Image();
        imageObj.onload = function() {
            cvs.cxt.clearRect(0, 0, this.width, this.height);
            cvs.cxt.drawImage(imageObj, 0, 0);
        };
        imageObj.src = url;
    }

    handwriting.recognize = function(trace, options, callback) {
        if (handwriting.Canvas && this instanceof handwriting.Canvas) {
            trace = this.trace;
            options = this.options;
            callback = this.callback;
        } else if (!options) options = {};
        var serviceEndpointURLs = {
            "default": "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8",
            "google_tw": "https://www.google.com.tw/inputtools/request?ime=handwriting",
            "google_jp": "https://www.google.co.jp/inputtools/request?ime=handwriting",
            "google": "https://www.google.com/inputtools/request?ime=handwriting",
            "inputtools": "https://inputtools.google.com/request?ime=handwriting"
        }
        var data = JSON.stringify({
            "options": "enable_pre_space",
            "requests": [{
                "writing_guide": {
                    "writing_area_width": options.width || this.width || undefined,
                    "writing_area_height": options.height || this.width || undefined
                },
                "ink": trace,
                "language": options.language || "zh_TW"
            }]
        });
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                switch (this.status) {
                    case 200:
                        var response = JSON.parse(this.responseText);
                        var results;
                        if (response.length === 1) callback(undefined, new Error(response[0]));
                        else results = response[1][0][1];
                        if (!!options.numOfWords) {
                            results = results.filter(function(result) {
                                return (result.length == options.numOfWords);
                            });
                        }
                        if (!!options.numOfReturn) {
                            results = results.slice(0, options.numOfReturn);
                        }
                        callback(results, undefined);
                        break;
                    case 403:
                        callback(undefined, new Error("access denied"));
                        break;
                    case 503:
                        callback(undefined, new Error("can't connect to recognition server"));
                        break;
                }


            }
        });
        xhr.open("POST", serviceEndpointURLs[options.serviceEndpoint] || serviceEndpointURLs["default"]);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(data);
    };

})(window, document);
