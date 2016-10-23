# handwriting.js

A simple API access to the incredible handwriting recognition of Google IME

## Example
See [here] [1]

  [1]: http://chenyuho.com/handwriting.js        "here"

## Usage

### Include src

```html
    <script type="text/javascript" src="handwriting.js"></script>
```

### Capture trace

<p id="trace">The trace structure is like below:</p>
```javascript
var trace = 
	[        //the trace is an array of strokes
        [        //a stroke is an array of pairs of captured (x, y) coordinates
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

 (300, 320), (310, 320), (320, 320), (330, 320), (340, 320)
and
(320, 300), (320, 310), (320, 320), (320, 330), (320, 340),

 which is produced by writing "十".

### Manage options

options argument is an optional object of following fields:

```javascript
var options = {
		width : 800,		//int, width of the writing area, default: undefined
		height : 800,		//int, height of the writing area, default: undefined
		language : "zh_TW",	//string, language of input trace, default: "zh_TW"
		numOfWords : 1,		//int, number of words of input trace, default: undefined
		numOfReturn : 5,	//int, number of maximum returned results, default: undefined
	};
```

For most conditions, only **language** field is **required**.  However, specifying writing area width and height helps in improving precision.

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

###Usage
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
<h3 id="language">Supported Language</h3>
   
[Reference](http://www.google.com/inputtools/help/languages.html)

| 語言代碼 |     語言     |   地區   |
|:--------:|:------------:|:--------:|
| af       | 南非荷蘭文   |          |
| be       | 白俄羅斯文   |          |
| bg       | 保加利亞文   |          |
| ca       | 卡達隆尼亞文 |          |
| cs       | 捷克文       |          |
| cy       | 威爾斯文     |          |
| da       | 丹麥文       |          |
| de       | 德文         |          |
| el       | 希臘文       |          |
| en       | 英文         |          |
| es       | 西班牙文     |          |
| et       | 愛沙尼亞文   |          |
| eu       | 巴斯克文     |          |
| fi       | 芬蘭文       |          |
| fil      | 菲律賓文     |          |
| fr       | 法文         |          |
| gl       | 加里西亞文   |          |
| hi       | 北印度文     |          |
| hr       | 克羅埃西亞文 |          |
| ht       | 海地文       |          |
| hu       | 匈牙利文     |          |
| id       | 印尼文       |          |
| is       | 冰島文       |          |
| it       | 義大利文     |          |
| ja       | 日文         |          |
| ko       | 韓文         |          |
| la       | 拉丁文       |          |
| lt       | 立陶宛文     |          |
| lv       | 拉脫維亞文   |          |
| mk       | 馬其頓文     |          |
| ms       | 馬來文       |          |
| nl       | 荷蘭文       |          |
| no       | 挪威文       |          |
| pl       | 波蘭文       |          |
| pt       | 葡萄牙文     |          |
| pt_BR    | 葡萄牙文     | (巴西)   |
| pt_PT    | 葡萄牙文     | (葡萄牙) |
| ro       | 羅馬尼亞文   |          |
| ru       | 俄文         |          |
| sk       | 斯洛伐克文   |          |
| sl       | 斯洛維尼亞文 |          |
| sq       | 阿爾巴尼亞文 |          |
| sr       | 塞爾維亞文   |          |
| sv       | 瑞典文       |          |
| sw       | 斯瓦希里文   |          |
| th       | 泰文         |          |
| tr       | 土耳其文     |          |
| uk       | 烏克蘭文     |          |
| vi       | 越南文       |          |
| zh       | 中文         |          |
| zh_CN    | 中文         | (中國)   |
| zh_TW    | 中文         | (台灣)   |

***
## License

MIT licensed
