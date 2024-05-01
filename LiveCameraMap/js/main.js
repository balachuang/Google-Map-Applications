// const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");

var mapGeoCoder = null;
var mapView = null;

var targetCameraIdx = -1;
var targetZoom = -1;
var centerChangeHandler = null;
var zoomLvlChangeHandler = null;

var cameraRange = [];

$(document).ready(function(){
	$('#menubar').load('../menubar.html', function(){
	    $('#nav-LC').addClass('active');

		var userLang = navigator.language || navigator.userLanguage;
		$('i18n').each(function(){
			var txt = $(this).attr(userLang);
			$(this).replaceWith(txt);
		});

        onReSize();
        initGoogle();
	});
});

$(window).resize(onReSize);

function onReSize()
{
    var sh = $(window).height() - $('#idx-navbar').height() - 20;
    $('#google-map-container').height(sh);
}

function initGoogle()
{
    mapGeoCoder = new google.maps.Geocoder();

    let initPos = new google.maps.LatLng({ lat: 23.583169, lng: 121.2071099 });
    mapView = new google.maps.Map(document.getElementById('google-map-container'), { center: initPos, zoom: 4 });

    if (navigator.geolocation) {
        // Browser support Geolocation, get actual position
        navigator.geolocation.getCurrentPosition(function(position) {
            mapView.setCenter(new google.maps.LatLng({ lat: position.coords.latitude, lng: position.coords.longitude }));
        }, function(error) {
            // var infoWindow = new google.maps.InfoWindow({map: mapView});
            // handleLocationError(true, infoWindow, mapView.getCenter());
            console.log('Error in navigator.geolocation.getCurrentPosition: ' + error);
        });
    } else {
        // Browser doesn't support Geolocation
        // var infoWindow = new google.maps.InfoWindow({map: mapView});
        // handleLocationError(false, infoWindow, mapView.getCenter());
        console.log('navigator.geolocation not support, set map to default view.');
    }

    for (let i=0; i<cameraInfo.length; ++i)
    {
        if (cameraInfo[i].title == '') break;

        // Add Camera Range and Icon
        cameraRange.push(addCameraRange(i));
        addCameraIcon(i, mapView);
    }

    // set zoom handler
    mapView.addListener('zoom_changed', function(){ checkCameraRange(); });
}

// 
function onClickCamera(idx)
{
    // IF current Zoom Level equals to default zoom, show video.
    let currZoomLvl = mapView.getZoom();
    if (currZoomLvl == cameraInfo[idx].zoom)
    {
        let l = (window.innerWidth - 800) / 2;
        let t = (window.innerHeight - 600) / 2;
        window.open(cameraInfo[targetCameraIdx].url, 'YouTube', `width=800,height=600,scrollbars=no,location=no,menubar=no,toolbar=no,top=${t},left=${l}`);
        return;
    }

    // ELSE zooming to clicked camera
    // 一直把 lat 和 lng 弄反了, 直到把數字打出來才發現
    // panTo 和 setCenter 一樣, 跳太多都不會有動畫
    targetCameraIdx = idx;

    // Focus to clicked camera
    let cameraPos = new google.maps.LatLng({
        lat: cameraInfo[idx].position.lat,
        lng: cameraInfo[idx].position.lng
    });
 
    centerChangeHandler = mapView.addListener('idle', function(){ afterChangeCenter(); });
    targetZoom = cameraInfo[idx].zoom;
    mapView.panTo(cameraPos);
}

function afterChangeZoomLevel()
{
    // stop zooming
    let currZoomLvl = mapView.getZoom();
    if ((currZoomLvl == targetZoom) || (targetZoom == -1))
    {
        google.maps.event.removeListener(zoomLvlChangeHandler);
        zoomLvlChangeHandler = null;
        targetZoom = -1;

        // reset camera range
        hideAllCameraRange();
        if (targetCameraIdx != -1)
        {
            showCameraRange(targetCameraIdx);
            targetCameraIdx = -1;
        }

        return false;
    }

    // else change zoom level a little bit
    let zoomLvlGap = targetZoom - currZoomLvl;
    let zoomLvlGapSign = zoomLvlGap / Math.abs(zoomLvlGap);
    let nxtZoomLvl = currZoomLvl + zoomLvlGapSign * Math.min(4, Math.abs(zoomLvlGap));
    mapView.setZoom(nxtZoomLvl);
    return true;
}

function afterChangeCenter()
{
    // Center changed, remove this handler
    google.maps.event.removeListener(centerChangeHandler);
    centerChangeHandler = null;

    zoomLvlChangeHandler = mapView.addListener('idle', function(){ afterChangeZoomLevel(); });
    afterChangeZoomLevel();

    return false;
}

// add Range by SVG
function addCameraRange(idx)
{
    let camePosition = new google.maps.LatLng({ lng: cameraInfo[idx].position.lng, lat: cameraInfo[idx].position.lat });

    let rangeMarker = new google.maps.Marker({
        position: camePosition, 
        map: null, draggable: false, zIndex: 100,
        icon: {
            path: 'M 0 0 L 50 -15 C 52 -8 52 8 50 15 Z',
            fillColor: 'blue',
            fillOpacity: 0.5,
            strokeWeight: 0,
            rotation: cameraInfo[idx].angle,
            scale: 2,
            anchor: new google.maps.Point(0, 0)
        }
    });

    return rangeMarker;
}

// add Icon by PNG
function addCameraIcon(idx, mapView)
{
    let camePosition = new google.maps.LatLng({ lng: cameraInfo[idx].position.lng, lat: cameraInfo[idx].position.lat });
    let cameTitle = cameraInfo[idx].title + '\r\n' + cameraInfo[idx].url;

    let iconMarker = new google.maps.Marker({
        title: cameTitle, position: camePosition, 
        map: mapView, draggable: false, zIndex: 200,
        icon: {
            url: 'images/camera_64.png',
            anchor: new google.maps.Point(32, 18)
        }
    });

    iconMarker.addListener('click', function(){ onClickCamera(idx); });
}

// hide camera range if current ZoomLvl not equal to anyone of default zoom.
function checkCameraRange()
{
    let currZoomLvl = mapView.getZoom();
    for (let i=0; i<cameraInfo.length; i++) {
        if (cameraInfo[i].zoom == currZoomLvl) return;
    }
    hideAllCameraRange();
}

function hideAllCameraRange()
{
    for (let i=0; i<cameraRange.length; i++) {
        cameraRange[i].setMap(null);
    }
}

function showCameraRange(idx)
{
    cameraRange[idx].setMap(mapView);
}