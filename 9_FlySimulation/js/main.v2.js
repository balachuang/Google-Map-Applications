// https://developers.google.com/maps/documentation/javascript/examples/3d/toggle-labels#maps_3d_label_toggle-html
// ==> 最後還是自己算, altitude 固定為 0, 用 range 模擬高度

// plane parameter
let planeInfo = {
	pos: {
		lat: 24.978899291207604,
		lng: 121.54248131780544,
	},
	height: 300,
	heading: 0,
	tilt: 80,
}

var mapView = null;
var geoCalculator = null;

var shift = 0; // 擋位, 0 ~ 8
var flySpeed = 5;  // 單位: 公尺 / 25ms (秒速要 x40), 每一擋加 2
var turnSpeed = 0.3; // 每一擋加 0.05
var flyInv = 25;

let ctrlKeys = [
	{ keyCode: 68,  value: false, label: 'IsAltitudeUp',   action: function(){ altitude(+1); } },
	{ keyCode: 67,  value: false, label: 'IsAltitudeDown', action: function(){ altitude(-1); } },
	{ keyCode: 65,  value: false, label: 'IsTiltUp',       action: function(){ tilt(-1);     } },
	{ keyCode: 90,  value: false, label: 'IsTiltDown',     action: function(){ tilt(+1);     } },
	{ keyCode: 104, value: false, label: 'IsFly',          action: function(){ forward();    } },
	{ keyCode: 100, value: false, label: 'IsTurnLeft',     action: function(){ turn(-1);     } },
	{ keyCode: 102, value: false, label: 'IsTurnRight',    action: function(){ turn(+1);     } },
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

	$('#google-map-container').on('keydown', keyDownHandler);
	$('#google-map-container').on('keyup', keyUpHandler);

	window.setTimeout(updateView, 100);

	$('#manual').click(function(){
		$('#manual').hide();

		// 目前找不到可以自動 focus 到 3D map 的方法, 一定要先手動點一下地圖, 才能開始用 keyboard 控制
		// const targetElement = document.elementFromPoint(100, 100);
		// if (targetElement) targetElement.click();
		// $(targetElement).click();
	});
}

function keyDownHandler(e)
{
	// console.log('key down: ' + e.keyCode);

	// press number 1 ~ 9
	if ((e.keyCode >= 49) && (e.keyCode <= 57))
	{
		shift = (e.keyCode - 49);
		flySpeed = 5 + shift * 2;
		turnSpeed = 0.3 + shift * 0.05;
	}

	// press other keys
	for (let n=0; n<ctrlKeys.length; ++n)
	{
		if (ctrlKeys[n].keyCode == e.keyCode) {
			if (!ctrlKeys[n].value) ctrlKeys[n].value = true;
			break;
		}
	}
}

function keyUpHandler(e)
{
	// console.log('key up: ' + e.keyCode);

	// press other keys
	for (let n=0; n<ctrlKeys.length; ++n)
	{
		if (ctrlKeys[n].keyCode == e.keyCode) {
			if (ctrlKeys[n].value) ctrlKeys[n].value = false;
			break;
		}
	}
}

function updateView()
{
	ctrlKeys.forEach(item => { if(item.value) item.action(); });

	$('#lat').text(Math.round(10000 * planeInfo.pos.lat) / 10000);
	$('#lng').text(Math.round(10000 * planeInfo.pos.lng) / 10000);
	$('#altitude').text(planeInfo.height);
	$('#heading').text(Math.round(1000 * planeInfo.heading) / 1000);
	$('#flyspeed').text(flySpeed * 1000 / flyInv);
	$('#turnspeed').text(Math.round(100 * (turnSpeed * 1000 / flyInv)) / 100);

	let cameraInfo = calculateCamera();
	mapView.center = cameraInfo.center;
	mapView.heading = cameraInfo.heading;
	mapView.tilt = cameraInfo.tilt;
	mapView.range = cameraInfo.range;

	window.setTimeout(updateView, flyInv);
}

function forward()
{
	const newLoc = geoCalculator.computeOffset({lat: planeInfo.pos.lat, lng: planeInfo.pos.lng}, flySpeed, planeInfo.heading);
	planeInfo.pos.lat = newLoc.lat();
	planeInfo.pos.lng = newLoc.lng();
}

function turn(dir)
{
	planeInfo.heading += dir * turnSpeed;
	if (planeInfo.heading < 0)   planeInfo.heading += 360;
	if (planeInfo.heading > 360) planeInfo.heading -= 360;
}

function altitude(dir)
{
	planeInfo.height += dir * (shift+1);
	if (planeInfo.height < 0) planeInfo.height = 0;
}

function tilt(dir)
{
	planeInfo.tilt += dir * 0.1;
	if (planeInfo.tilt < 0 ) planeInfo.tilt = 0;
	if (planeInfo.tilt > 80) planeInfo.tilt = 80;
}

function calculateCamera()
{
	let cameraRange = planeInfo.height / Math.cos(radian(planeInfo.tilt));
	let distance = cameraRange * Math.sin(radian(planeInfo.tilt));
	let cameraPos = geoCalculator.computeOffset({lat: planeInfo.pos.lat, lng: planeInfo.pos.lng}, distance, planeInfo.heading);

	let cameraInfo = {
		center: {
			lat: cameraPos.lat(),
			lng: cameraPos.lng(),
			altitude: 0
		},
		range: cameraRange,
		heading: planeInfo.heading,
		tilt: planeInfo.tilt
	};
	return cameraInfo;
}

function radian(degree)
{
	return degree * Math.PI / 180;
}