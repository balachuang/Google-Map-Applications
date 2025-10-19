// https://developers.google.com/maps/documentation/javascript/examples/3d/toggle-labels#maps_3d_label_toggle-html
// 在不需自行計算的前提下, 把 range 設成 0 可以最大程度模擬第一人稱視角

// camera parameter
caemra_center = {
	lat: 24.978899291207604,
	lng: 121.54248131780544,
	altitude: 100
};
caemra_heading = 0;
caemra_tilt = 80;

var mapView = null;
var geoCalculator = null;

var shift = 0; // 擋位, 0 ~ 4
var flySpeed = 5;  // 單位: 公尺 / 25ms (秒速要 x40), 每一擋加 2
var turnSpeed = 0.3; // 每一擋加 0.2
var flyInv = 25;

let ctrlKeys = [
	{ keyCode: 68,  value: false, label: 'IsAltitudeUp',   action: function(){caemra_center.altitude += (shift+1);} },
	{ keyCode: 67,  value: false, label: 'IsAltitudeDown', action: function(){caemra_center.altitude = Math.max(caemra_center.altitude - (shift+1), 0);} },
	{ keyCode: 65,  value: false, label: 'IsTiltUp',       action: function(){caemra_tilt = Math.min(caemra_tilt + 1, 180);} },
	{ keyCode: 90,  value: false, label: 'IsTiltDown',     action: function(){caemra_tilt = Math.max(caemra_tilt - 1, 0);} },
	{ keyCode: 104, value: false, label: 'IsFly',          action: function(){performFly();} },
	{ keyCode: 100, value: false, label: 'IsTurnLeft',     action: function(){caemra_heading -= turnSpeed;} },
	{ keyCode: 102, value: false, label: 'IsTurnRight',    action: function(){caemra_heading += turnSpeed;} },
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
		center: caemra_center,
		range: 0, // --> fix range
		heading: caemra_heading,
		tilt: caemra_tilt,
		mode: 'SATELLITE'
	});
	document.getElementById('google-map-container').append(mapView);

	const {spherical} = await google.maps.importLibrary("geometry");
	geoCalculator = google.maps.geometry.spherical;

	$('#google-map-container').on('keydown', keyDownHandler);
	$('#google-map-container').on('keyup', keyUpHandler);
	$('#google-map-container').focus();

	window.setTimeout(updateView, 1000);
	$('#google-map-container').focus();
	$('#google-map-container').click();
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

//    檔位: 1    2    3    4    5
//   Speed: 5    10   25   40   50
// DrawInv: 25   20   15   10   5
// TurnInv: 0.1  0.2  0.5  0.7  1
function updateView(e)
{
	let needUpdate = false;
	for (let n=0; n<ctrlKeys.length; ++n)
	{
		if (ctrlKeys[n].value)
		{
			ctrlKeys[n].action();
			needUpdate = true;
		}
	}

	if (needUpdate)
	{
		mapView.center = caemra_center;
		mapView.tilt = caemra_tilt;
		mapView.heading = caemra_heading;
	}

	$('#lat').text(Math.round(10000 * caemra_center.lat) / 10000);
	$('#lng').text(Math.round(10000 * caemra_center.lng) / 10000);
	$('#altitude').text(caemra_center.altitude);
	$('#heading').text(Math.round(1000 * caemra_heading) / 1000);
	$('#flyspeed').text(flySpeed);
	$('#turnspeed').text(Math.round(100 * turnSpeed) / 100);

	window.setTimeout(updateView, flyInv);
}

function performFly()
{
	const newLoc = geoCalculator.computeOffset({lat: caemra_center.lat, lng: caemra_center.lng}, flySpeed, caemra_heading);
	caemra_center.lat = newLoc.lat();
	caemra_center.lng = newLoc.lng();
}