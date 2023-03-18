(function() {

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
})();
