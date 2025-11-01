// https://developers.google.com/maps/documentation/javascript/examples/3d/toggle-labels#maps_3d_label_toggle-html
// ==> 最後還是自己算, altitude 固定為 0, 用 range 模擬高度
// ==> 加上漸變功能

// plane parameter
let groundHeight = 0;
let planeInfo = {
	pos: { lat: 24.978899291207604, lng: 121.54248131780544 },
	height: 300,
	heading: 0,
	tilt: 80,
}

let mapView = null;
let geoCalculator = null;

let shift = 0; // 檔位, 0 ~ 8
const renderInv = 25;
const stackSize = 1000 / renderInv;

// 飛行速度, 單位: m/s, 直接指定不同檔位速度
let flySpeedInvBase = [
	1.39, // 步行 (5 km/h)
	5.56, // 腳踏車 (20 km/h)
	16.67, // 市區車速 (60 km/h)
	33.33, // 高速車速 (120 km/h)
	63.89, // 高鐵平均車速 (230 km/h)
	83.33, // 高鐵最高車速 (300 km/h)
	277.78, // 民航機平均速度 (1000 km/h)
	7888.89, // 第一宇宙速度 / 環繞速度 (7.9 km/h)
	11194.44, // 第二宇宙速度 / 逃逸速度 (11.2 km/h) 
];
let flySpeedInv = new Array(flySpeedInvBase.length);
for (let n=0; n<flySpeedInvBase.length; ++n) flySpeedInv[n] = renderInv * flySpeedInvBase[n] / 1000;

// 轉頭速度, 單位: 度/秒, 按越久轉越快.
let minTurnChangeRate =  5 * renderInv / 1000; //  3 度/秒
let maxTurnChangeRate = 15 * renderInv / 1000; // 10 度/秒
let turnChangeRateInt = (maxTurnChangeRate - minTurnChangeRate) / 3;

let currFlySpeed = 0;
let currTurnSpeed = 0;
let currHighChangeRate = 0;
let targetFlySpeed = 0;
let targetTurnSpeed = 0.0;
let targetHighChangeRate = 0;

let flySpeedStack = [];
let turnSpeedStack = [];
let highChangeRateStack = [];

let ctrlKeys = [
	{ keyCode: 48,  isPress: false, keyHnlr: keyNumHandler,    action: null,     dir:  0}, // shift: 0
	{ keyCode: 49,  isPress: false, keyHnlr: keyNumHandler,    action: null,     dir:  0}, // shift: 1
	{ keyCode: 50,  isPress: false, keyHnlr: keyNumHandler,    action: null,     dir:  0}, // shift: 2
	{ keyCode: 51,  isPress: false, keyHnlr: keyNumHandler,    action: null,     dir:  0}, // shift: 3
	{ keyCode: 52,  isPress: false, keyHnlr: keyNumHandler,    action: null,     dir:  0}, // shift: 4
	{ keyCode: 53,  isPress: false, keyHnlr: keyNumHandler,    action: null,     dir:  0}, // shift: 5
	{ keyCode: 54,  isPress: false, keyHnlr: keyNumHandler,    action: null,     dir:  0}, // shift: 6
	{ keyCode: 55,  isPress: false, keyHnlr: keyNumHandler,    action: null,     dir:  0}, // shift: 7
	{ keyCode: 56,  isPress: false, keyHnlr: keyNumHandler,    action: null,     dir:  0}, // shift: 8
	{ keyCode: 57,  isPress: false, keyHnlr: keyNumHandler,    action: null,     dir:  0}, // shift: 9
	{ keyCode: 68,  isPress: false, keyHnlr: keyDCHandler,     action: altitude, dir: +1}, // IsAltitudeUp',   
	{ keyCode: 67,  isPress: false, keyHnlr: keyDCHandler,     action: altitude, dir: -1}, // IsAltitudeDown', 
	{ keyCode: 65,  isPress: false, keyHnlr: null,             action: tilt,     dir: +1}, // IsTiltUp',       
	{ keyCode: 90,  isPress: false, keyHnlr: null,             action: tilt,     dir: -1}, // IsTiltDown',     
	{ keyCode: 104, isPress: false, keyHnlr: keyNumPadHandler, action: forward,  dir:  0}, // IsFly',          
	{ keyCode: 100, isPress: false, keyHnlr: keyNumPadHandler, action: turn,     dir: -1}, // IsTurnLeft',     
	{ keyCode: 102, isPress: false, keyHnlr: keyNumPadHandler, action: turn,     dir: +1}, // IsTurnRight',    
];


$(document).ready(function(){
	generateMenubar($('#menubar'), 'FS');

	window.setTimeout(function(){
		onReSize();
		initGoogle();
	}, 1000);
});

$(window).resize(onReSize);

function onReSize()
{
	// 原本用 $(window).height() - $('#idx-navbar').height() - 20;
	// 可是會造成手機版下方有大片空白
	// 改成 -55 後就不會了.
	var sh = $(window).height() - 55;
	$('#google-map-container').height(sh);
}

async function initGoogle()
{
	// block initGoogle() until google is loaded.
	if((typeof(google) == 'undefined') || (google == null)) {
		setTimeout(initGoogle, 200);
		return;
	}

	const {spherical} = await google.maps.importLibrary("geometry");
	geoCalculator = google.maps.geometry.spherical;

	const { Map3DElement, MapMode } = await google.maps.importLibrary("maps3d");
	mapView = new Map3DElement(calculateCamera(planeInfo));
	mapView.mode = MapMode.SATELLITE;
	document.getElementById('google-map-container').append(mapView);

	// key handler
	// 目前找不到可以自動 focus 到 3D map 的方法, 一定要先手動點一下地圖, 才能開始飛
	// const targetElement = document.elementFromPoint(100, 100);
	// if (targetElement) targetElement.click();
	// $(targetElement).click();
	$('#fly-mode').change(resetPlanePosition);
	$('#google-map-container').on('keydown', keyDownHandler);
	$('#google-map-container').on('keyup', keyUpHandler);
	$('#manual').click(function(){ $('#manual').hide(); });

	// render Google 3D Map
	window.setInterval(renderMap, renderInv);
}



// =================================================================
// Handler
// =================================================================

function resetPlanePosition(e)
{
	let option = $(this).find('option:selected');
	groundHeight = eval(option.attr('gdh'));
	planeInfo.pos.lat = eval(option.attr('lat'));
	planeInfo.pos.lng = eval(option.attr('lng'));
	planeInfo.height = groundHeight + 300;
}

function keyDownHandler(e)
{
	// console.log('key down: ' + e.keyCode);

	// call handler of each key
	ctrlKeys.forEach(item => {
		if (!item.isPress && (item.keyCode == e.keyCode))
		{
			item.isPress = true;
			if (item.keyHnlr) item.keyHnlr(e, true);
		}
	});
}

function keyUpHandler(e)
{
	// console.log('key up: ' + e.keyCode);

	// call handler of each key
	ctrlKeys.forEach(item => {
		if (item.isPress && (item.keyCode == e.keyCode))
		{
			// 延後停止, 留時間做結束動畫
			window.setTimeout(function(){ item.isPress = false; }, 1000);
			if (item.keyHnlr) item.keyHnlr(e, false);
		}
	});
}

function keyDCHandler(e, isPress)
{
	// press D : fly up
	// press C : fly down
	if (isPress)
	{
		changeHighChangeRate((planeInfo.height - groundHeight) / 100.0);
	}else{
		changeHighChangeRate(0);
	}
}

function keyNumHandler(e, isPress)
{
	// press number 1 ~ 9
	if (isPress)
	{
		shift = (e.keyCode - 49);

		if (ctrlKeys[14].isPress) changeTargetFlySpeed(flySpeedInv[shift]);
		if (ctrlKeys[15].isPress) changeTargetTurnSpeed(turnSpeedInv[shift]);
		if (ctrlKeys[16].isPress) changeTargetTurnSpeed(turnSpeedInv[shift]);
	}
}

function keyNumPadHandler(e, isPress)
{
	if (isPress)
	{
		// press Num Pad
		switch(e.keyCode)
		{
			case 104: // fly forward
				changeTargetFlySpeed(flySpeedInv[shift]);
				break;
			case 100: // turn left
			case 102: // turn right
				changeTargetTurnSpeed(minTurnChangeRate);
				break;
		}
	}else{
		// release Num Pad
		switch(e.keyCode)
		{
			case 104: // fly forward
				changeTargetFlySpeed(0);
				break;
			case 100: // turn left
			case 102: // turn right
				changeTargetTurnSpeed(0);
				break;
		}
	}
}

function changeTargetFlySpeed(target)
{
	targetFlySpeed = target;
	flySpeedStack = [];
	for (let n=0; n<stackSize; ++n) flySpeedStack.push(currFlySpeed + (stackSize-n) * (targetFlySpeed - currFlySpeed) / stackSize);
}

function changeTargetTurnSpeed(target)
{
	targetTurnSpeed = target;
	turnSpeedStack = [];
	for (let n=0; n<stackSize; ++n) turnSpeedStack.push(currTurnSpeed + (stackSize-n) * (targetTurnSpeed - currTurnSpeed) / stackSize);
}

function changeHighChangeRate(target)
{
	targetHighChangeRate = target;
	highChangeRateStack = [];
	for (let n=0; n<stackSize; ++n) highChangeRateStack.push(currHighChangeRate + (stackSize-n) * (targetHighChangeRate - currHighChangeRate) / stackSize);
}



// =================================================================
// View Updater
// =================================================================

function renderMap()
{
	ctrlKeys.forEach(item => { if (item.isPress && item.action) item.action(item.isPress, item.dir); });

	let flySpeedTxt = (currFlySpeed * 1000 / renderInv) * 36 / 10;
	$('#shift').text(shift + 1);
	$('#lat').text(Math.round(10000 * planeInfo.pos.lat) / 10000);
	$('#lng').text(Math.round(10000 * planeInfo.pos.lng) / 10000);
	$('#altitude').text(Math.round(100 * (planeInfo.height - groundHeight)) / 100);
	$('#heading').text(Math.round(100 * planeInfo.heading) / 100);
	$('#tilt').text(Math.round(100 * planeInfo.tilt) / 100);
	$('#curr-fly-speed').text(Math.round(flySpeedTxt * 100) / 100);
	$('#turnspeed').text(Math.round(100 * (currTurnSpeed * 1000 / renderInv)) / 100);

	let cameraInfo = calculateCamera();
	mapView.center = cameraInfo.center;
	mapView.heading = cameraInfo.heading;
	mapView.tilt = cameraInfo.tilt;
	mapView.range = cameraInfo.range;
}


function forward(active, direction)
{
	currFlySpeed = (flySpeedStack.length > 0) ? flySpeedStack.pop() : targetFlySpeed;
	const newLoc = geoCalculator.computeOffset({lat: planeInfo.pos.lat, lng: planeInfo.pos.lng}, currFlySpeed, planeInfo.heading);
	planeInfo.pos.lat = newLoc.lat();
	planeInfo.pos.lng = newLoc.lng();
}

function turn(active, direction)
{
	if ((turnSpeedStack.length <= 0) && active) changeTargetTurnSpeed(Math.min(currTurnSpeed + turnChangeRateInt, maxTurnChangeRate));
	currTurnSpeed = (turnSpeedStack.length > 0) ? turnSpeedStack.pop() : targetTurnSpeed;
	planeInfo.heading += direction * currTurnSpeed;
	if (planeInfo.heading < 0)   planeInfo.heading += 360;
	if (planeInfo.heading > 360) planeInfo.heading -= 360;
}

function altitude(active, direction)
{
	currHighChangeRate = (highChangeRateStack.length > 0) ? highChangeRateStack.pop() : (planeInfo.height - groundHeight) / 100.0;
	planeInfo.height += direction * currHighChangeRate;
	if (planeInfo.height < groundHeight) planeInfo.height = groundHeight + 1;
}

function tilt(active, direction)
{
	planeInfo.tilt += direction * 1;
	if (planeInfo.tilt < 0 ) planeInfo.tilt = 0;
	if (planeInfo.tilt > 89) planeInfo.tilt = 89;
}



// =================================================================
// View Updater
// =================================================================

function calculateCamera()
{
	// 把 tilt 分成 <90, 90, >90 三分別用 range + distance 來模擬 ==> 失敗.
	// 看來 google map 的這幾個值有一些奇怪的限制.
	let range = planeInfo.height / Math.cos(radian(planeInfo.tilt));
	let distance = range * Math.sin(radian(planeInfo.tilt));
	let cameraPos = geoCalculator.computeOffset({lat: planeInfo.pos.lat, lng: planeInfo.pos.lng}, distance, planeInfo.heading);

	let cameraInfo = {
		center: {
			lat: cameraPos.lat(),
			lng: cameraPos.lng(),
			altitude: 0
		},
		range: range,
		heading: planeInfo.heading,
		tilt: planeInfo.tilt
	};

	return cameraInfo;
}

function radian(degree)
{
	return degree * Math.PI / 180;
}
