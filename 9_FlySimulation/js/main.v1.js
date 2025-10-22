// https://developers.google.com/maps/documentation/javascript/examples/3d/toggle-labels#maps_3d_label_toggle-html
// 在不需自行計算的前提下, 把 range 設成 0 可以最大程度模擬第一人稱視角
// ==> 可是還是差很多. 中間有一段看起來 ok, 可是後來又不見了

// camera parameter
let camera_center = {
	lat: 24.978899291207604,
	lng: 121.54248131780544,
	altitude: 300
};
camera_heading = 0;
camera_tilt = 80;
camera_range = 0; // --> fix range

var mapView = null;
var geoCalculator = null;

var shift = 0; // 擋位, 0 ~ 8
var flySpeed = 5;  // 單位: 公尺 / 25ms (秒速要 x40), 每一擋加 2
var turnSpeed = 0.3; // 每一擋加 0.05
var flyInv = 25;

let ctrlKeys = [
	{ keyCode: 68,  value: false, label: 'IsAltitudeUp',   action: function(){ altitude( 1); } },
	{ keyCode: 67,  value: false, label: 'IsAltitudeDown', action: function(){ altitude(-1); } },
	{ keyCode: 65,  value: false, label: 'IsTiltUp',       action: function(){ tilt(+1);     } },
	{ keyCode: 90,  value: false, label: 'IsTiltDown',     action: function(){ tilt(-1);     } },
	{ keyCode: 104, value: false, label: 'IsFly',          action: function(){ performFly(); } },
	{ keyCode: 100, value: false, label: 'IsTurnLeft',     action: function(){ turn(-1);     } },
	{ keyCode: 102, value: false, label: 'IsTurnRight',    action: function(){ turn( 1);     } },
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

	const { Map3DElement } = await google.maps.importLibrary("maps3d");
	mapView = new Map3DElement({
		center: camera_center,
		range: camera_range,
		heading: camera_heading,
		tilt: camera_tilt,
		mode: 'SATELLITE'
	});
	document.getElementById('google-map-container').append(mapView);

	const {spherical} = await google.maps.importLibrary("geometry");
	geoCalculator = google.maps.geometry.spherical;

	$('#google-map-container').on('keydown', keyDownHandler);
	$('#google-map-container').on('keyup', keyUpHandler);
	// $('#google-map-container').focus();

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

	$('#lat').text(Math.round(10000 * camera_center.lat) / 10000);
	$('#lng').text(Math.round(10000 * camera_center.lng) / 10000);
	$('#altitude').text(camera_center.altitude);
	$('#heading').text(Math.round(1000 * camera_heading) / 1000);
	$('#flyspeed').text(flySpeed * 1000 / flyInv);
	$('#turnspeed').text(Math.round(100 * (turnSpeed * 1000 / flyInv)) / 100);

	window.setTimeout(updateView, flyInv);
}

function performFly()
{
	const newLoc = geoCalculator.computeOffset({lat: camera_center.lat, lng: camera_center.lng}, flySpeed, camera_heading);
	camera_center.lat = newLoc.lat();
	camera_center.lng = newLoc.lng();
	mapView.center = camera_center;
	// mapView.center.lat = camera_center.lat;
	// mapView.center.lng = camera_center.lng;
}

function turn(dir)
{
	camera_heading += dir * turnSpeed;
	mapView.heading = camera_heading;
}

function altitude(dir)
{
	camera_center.altitude += dir * (shift+1);
	if (camera_center.altitude < 0) camera_center.altitude = 0;
	mapView.center = camera_center;
	// mapView.center.altitude = camera_center.altitude;
}

function tilt(dir)
{
	camera_tilt += dir;
	if (camera_tilt < 0) camera_tilt = 0;
	if (camera_tilt > 180) camera_tilt = 180;
	mapView.tilt = camera_tilt;
}

function radian(degree)
{
	return degree * Math.PI / 180;
}