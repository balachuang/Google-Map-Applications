// https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=zh-tw

var mapView = null;

var mapCircle;
var mapRectangle;

var initPoint = {
	lat: 24.978899291207604,
	lng: 121.54248131780544
};

var shapeDisplay = {
	stroke: {
		color: '#FF0000',
		opacity: 0.8,
		weight: 2,
	},
	fill: {
		color: '#FF0000',
		opacity: 0.35,
	},
};


$(document).ready(function(){
	$('#menubar').load('../menubar.html', function(){
		$('#nav-SM').addClass('active');

		var userLang = navigator.language || navigator.userLanguage;
		$('i18n').each(function(){
			var txt = $(this).attr(userLang);
			$(this).replaceWith(txt);
		});

		window.setTimeout(function(){
			onReSize();
			initGoogle();
		}, 1000);
	});
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

function initGoogle()
{
	// block initGoogle() until google is loaded.
	if((typeof(google) == 'undefined') || (google == null)) {
		setTimeout(initGoogle, 200);
		return;
	}

	mapView = new google.maps.Map(document.getElementById('google-map-container'), { center: initPoint, zoom: 13, mapId: 'SHAPE_MAP' });

	if (navigator.geolocation) {
		// Browser support Geolocation, get actual position
		navigator.geolocation.getCurrentPosition(function(position) {
			mapView.setCenter(new google.maps.LatLng({ lat: position.coords.latitude, lng: position.coords.longitude }));
		}, function(error) {
			console.log('Error in navigator.geolocation.getCurrentPosition: ' + error);
		});
	} else {
		// Browser doesn't support Geolocation
		console.log('navigator.geolocation not support, set map to default view.');
	}

	// 自訂控制項, 其實就是自己做一個 dom object, 然後用 google api 放進 map 裡.
	mapView.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById("shape-selector-container"));
	$('#shape-selector-container').show();
	$('#shape-selector').change(changeShape);

	// for init only.
	initShape();
	mapCircle.setMap(mapView);
	$('#circle-info').show();

	// changeShape();
}

function changeShape(e)
{
	let shapeName = $('#shape-selector').val();
	console.log(shapeName);

	switch(shapeName)
	{
		case 'circle':
			mapCircle.setMap(mapView);
			mapRectangle.setMap(null);
			$('#circle-info').show();
			$('#rectangle-info').hide();
			showCircleInfo();
			break;
		case 'rectangle':
			mapCircle.setMap(null);
			mapRectangle.setMap(mapView);
			$('#circle-info').hide();
			$('#rectangle-info').show();
			$('#rectangle-info-width').text(mapCircle.getRadius());
			$('#rectangle-info-height').text(mapCircle.getRadius());
			showRectangleInfo();
			break;
	}
}

function initShape()
{
	mapCircle = new google.maps.Circle({
		strokeColor: shapeDisplay.stroke.color,
		strokeOpacity: shapeDisplay.stroke.opacity,
		strokeWeight: shapeDisplay.stroke.weight,
		fillColor: shapeDisplay.fill.color,
		fillOpacity: shapeDisplay.fill.opacity,
		draggable: true,
		editable: true,
		center: initPoint,
		radius: 5000,
	});
	mapCircle.addListener("radius_changed", showCircleInfo);

	mapRectangle = new google.maps.Rectangle({
		strokeColor: shapeDisplay.stroke.color,
		strokeOpacity: shapeDisplay.stroke.opacity,
		strokeWeight: shapeDisplay.stroke.weight,
		fillColor: shapeDisplay.fill.color,
		fillOpacity: shapeDisplay.fill.opacity,
		draggable: true,
		editable: true,
		// manually calculate
		bounds: {
			north: 25.024,
			south: 24.934,
			east: 121.592,
			west: 121.493,
		},
	});
	mapRectangle.addListener("bounds_changed", showRectangleInfo);
}

function showCircleInfo() {
	const r = Math.round(mapCircle.getRadius() * 100) / 100;
	$('#circle-info-radius').text(r);
}

function showRectangleInfo()
{
	const ne = mapRectangle.getBounds().getNorthEast();
	const sw = mapRectangle.getBounds().getSouthWest();
	const top = ne.lat();
	const bottom = sw.lat();
	const right = ne.lng();
	const left = sw.lng();
	let width = google.maps.geometry.spherical.computeDistanceBetween(
		{lat: top, lng: left}, 
		{lat: top, lng: right}
	);
	let height = google.maps.geometry.spherical.computeDistanceBetween(
		{lat: top,    lng: left}, 
		{lat: bottom, lng: left}
	);
	width  = Math.round(width * 100) / 100;
	height = Math.round(height * 100) / 100;
	$('#rectangle-info-width' ).text(width);
	$('#rectangle-info-height').text(height);
}

// 手動計算已知中心點, 邊長為 10000 m 的方形 
// const nnee = google.maps.geometry.spherical.computeOffset(initPoint, 7071.068, 45);
// const ssww = google.maps.geometry.spherical.computeOffset(initPoint, 7071.068, -135);
// console.log(nnee.lat());
// console.log(nnee.lng());
// console.log(ssww.lat());
// console.log(ssww.lng());
