# handwriting.js

A simple API access to the incredible handwriting recognition of Google IME

## Demo
See [here](https://www.chenyuho.com/project/handwritingjs)

## Usage

### Include src

```html
    <script type="text/javascript" src="handwriting.js"></script>
```

### Capture trace

<p id="trace">The captured trace looks like:</p>

```javascript
var trace = 
    [   //the trace is an array of strokes
        [   //a stroke is an array of pairs of captured (x, y) coordinates
            [300, 310, 320, 330, 340], //x coordinate
            [320, 320, 320, 320, 320]  //y coordinate
            //each pair of (x, y) coordinates represents one sampling point 
        ],
        [
             [320, 320, 320, 320, 320],
             [300, 310, 320, 330, 340]
        ]
    ];
```

For example, the trace above is composed of two strokes,

```
(300, 320), (310, 320), (320, 320), (330, 320), (340, 320)
```

and

```
(320, 300), (320, 310), (320, 320), (320, 330), (320, 340),
```

which is produced by writing "十".

### Manage options

options argument is an optional object of following fields:

```javascript
var options = {
    width : 800,                   //int, width of the writing area, default: undefined
    height : 800,                  //int, height of the writing area, default: undefined
    language : "zh_TW",            //string, language of input trace, default: "zh_TW"
    serviceEndpoint: "google_tw",  //string, service endpoint URL used, default: "default"
    numOfWords : 1,                //int, number of words of input trace, default: undefined
    numOfReturn : 5,               //int, number of maximum returned results, default: undefined
};
```

Under most conditions, only **language** field is **required**.  However, specifying writing area width and height helps in improving precision.

See [Language Support](#language)
### Specify callback function

The recognition function will invoke the callback function argument passed in after recognition process.  The callback function should accept two arguments as shown below:

```javascript
var callback = function(result, err){
    if(err) throw err;
    else console.log(result);	
};
```

The returned result will be an array of string, for example, the [trace above](#trace) (with other options set to default) generates:

```javascript
[ "十", "+", "一|", "一1", "一个", "-|", "一'", "-1", "一．", "-．" ]
```

If no error occurred, err will be undefined.

### Call recognition function

bound on a button as an example:

```html
<button onclick="handwriting.recognize(trace, options, callback);">Recognize</button>
```

***
## Fully functional library

Include **handwriting.canvas.js** instead of handwriting.js if you want to use the pre-implemented canvas behaviors.

```html
<script type="text/javascript" src="./handwriting.canvas.js"></script>
```

### Usage
Declare html canvas as **handwriting.Canvas** object by passing that canvas element to the constructor:

```html
<canvas id="can" width="400" height="400" style="border: 2px solid; cursor: crosshair;"></canvas>

<script>
    var can1 = new handwriting.Canvas(document.getElementById("can"));
</script>
```

Now trace is automatically captured, stored in the object, and shown on the given element (either by mouse dragging or touch).

### APIs
The captured trace and other fields are independent through objects, so call the following functions exactly on which object you wish to take action to:

```javascript
    //Set callback function
    can1.setCallBack(function(data, err) {
        if(err) throw err;
        else console.log(data);
    });

    //Set line width shown on the canvas element (default: 3)
    can1.setLineWidth(5);

    //Set options
    can1.setOptions(
        {
            language: "ja",
            numOfReturn: 3
        }
    );

    //recognize captured trace
    can1.recognize();
	
    //Clear canvas, captured trace, and stored steps
    can1.erase();
```

#### undo and redo functionality
This feature is achieved by saving every stroke in object, however, such attempt consumes relatively higher memory, so undo and redo functionalities are disabled by default, to change the availability, simply call :

```javascript
    //only turn on undo functionality
    can1.set_Undo_Redo(true, false);

    //turn on both functionalities
    can1.set_Undo_Redo(true, true);
```

note that redo functionality can be turned on only if undo functionality is also turned on

```javascript
    //calling any of the two functions below leads to the same consequence: turn off both undo, redo functionality, and clear stored steps (if any) 
    can1.set_Undo_Redo(false, false);
    can1.set_Undo_Redo(false, true);
```

If the functionalities are turned on, the following functions will work, otherwise, nothing will happen:

```javascript
    can1.undo();
    //set canvas and stored trace to the last state (stroke)

    can1.redo();
    //if there are undo records, return to the state of the next stored step
```

Note that, even included handwriting.canvas.js now, the previous way of calling recognition still works :

```javascript
    handwriting.recognize(trace, options, callback);
```

so that you can take advantage of the **handwriting.canvas** object, while not changing previous code.

---
<h3 id="serviceEndpointUrl">Supported Service Endpoint URLs</h3>

| code       | URL                                                                                         |
|------------|---------------------------------------------------------------------------------------------|
| default    | https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8 |
| google_tw  | https://www.google.com.tw/inputtools/request?ime=handwriting                                |
| google_jp  | https://www.google.co.jp/inputtools/request?ime=handwriting                                 |
| google     | https://www.google.com/inputtools/request?ime=handwriting                                   |
| inputtools | https://inputtools.google.com/request?ime=handwriting                                       |

---
<h3 id="language">Supported Language</h3>
   
[Reference](https://www.google.com/inputtools/help/languages.html)

**Note:** Google provides a supported language list, but not the language codes. The following codes are collected from the Internet and only `zh_TW, en, ja` are tested. If you notice weird recognition results then maybe the language code is wrong.

| Language              | 語言              | code  |
|-----------------------|-------------------|-------|
| Afrikaans             | 南非荷蘭文        | af    |
| Albanian              | 阿爾巴尼亞文      | sq    |
| Basque                | 巴斯克文          | eu    |
| Belarusian            | 白俄羅斯文        | be    |
| Bulgarian             | 保加利亞文        | bg    |
| Catalan               | 卡達隆尼亞文      | ca    |
| Chinese (Simplified)  | 中文 (簡體)       | zh_CN |
| Chinese (Traditional) | 中文 (繁體)       | zh_TW |
| Croatian              | 克羅埃西亞文      | hr    |
| Czech                 | 捷克文            | cs    |
| Danish                | 丹麥文            | da    |
| Dutch                 | 荷蘭文            | nl    |
| English               | 英文              | en    |
| Estonian              | 愛沙尼亞文        | et    |
| Filipino              | 菲律賓文          | fil   |
| Finnish               | 芬蘭文            | fi    |
| French                | 法文              | fr    |
| Galician              | 加里西亞文        | gl    |
| German                | 德文              | de    |
| Greek                 | 希臘文            | el    |
| Haitian               | 海地文            | ht    |
| Hindi                 | 北印度文          | hi    |
| Hungarian             | 匈牙利文          | hu    |
| Icelandic             | 冰島文            | is    |
| Indonesian            | 印尼文            | id    |
| Irish                 | 愛爾蘭文          | ga    |
| Italian               | 義大利文          | it    |
| Japanese              | 日文              | ja    |
| Korean                | 韓文              | ko    |
| Latin                 | 拉丁語系          | la    |
| Latvian               | 拉脫維亞文        | lv    |
| Lithuanian            | 立陶宛文          | lt    |
| Macedonian            | 馬其頓文          | mk    |
| Malay                 | 馬來文            | ms    |
| Norwegian             | 挪威文            | no    |
| Polish                | 波蘭文            | pl    |
| Portuguese (Brazil)   | 葡萄牙文 (巴西)   | pt_BR |
| Portuguese (Portugal) | 葡萄牙文 (葡萄牙) | pt_PT |
| Romanian              | 羅馬尼亞文        | ro    |
| Russian               | 俄文              | ru    |
| Serbian               | 塞爾維亞文        | sr    |
| Slovak                | 斯洛伐克文        | sk    |
| Slovenian             | 斯洛維尼亞文      | sl    |
| Spanish               | 西班牙文          | es    |
| Swahili               | 斯瓦希里文        | sw    |
| Swedish               | 瑞典文            | sv    |
| Thai                  | 泰文              | th    |
| Turkish               | 土耳其文          | tr    |
| Ukranian              | 烏克蘭文          | yk    |
| Vietnamese            | 越南文            | vi    |
| Welsh                 | 威爾斯文          | cy    |

***
## License

MIT licensed
