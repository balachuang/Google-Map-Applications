// const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");

var mapGeoCoder = null;
var mapView = null;

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
    mapView = new google.maps.Map(document.getElementById('google-map-container'), { center: initPos, zoom: 8 });

    if (navigator.geolocation) {
        // Browser support Geolocation, get actual position
        navigator.geolocation.getCurrentPosition(function(position) {
            mapView.setCenter(new google.maps.LatLng({ lat: position.coords.latitude, lng: position.coords.longitude }));
        }, function() {
            var infoWindow = new google.maps.InfoWindow({map: mapView});
            // handleLocationError(true, infoWindow, mapView.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        var infoWindow = new google.maps.InfoWindow({map: mapView});
        // handleLocationError(false, infoWindow, mapView.getCenter());
    }

    for (let i=0; i<cameraInfo.length; ++i)
    {
        if (cameraInfo[i].title == '') continue;

        // Add Icon
        addPngIcon(i, mapView);
    }
}

function onClickCamera(idx)
{
    // 一直把 lat 和 lng 弄反了, 直到把數字打出來才發現

    // Focus to clicked camera
    let cameraPos = new google.maps.LatLng({
        lat: cameraInfo[idx].position.lat,
        lng: cameraInfo[idx].position.lng
    });
    mapView.panTo(cameraPos);
    mapView.setZoom(12);

    // test
    //window.open(cameraInfo[idx].url, '_blank');

    // return false;
}

function addSvgIcon(idx, mapView)
{
    let camePosition = new google.maps.LatLng({ lng: cameraInfo[idx].position.lng, lat: cameraInfo[idx].position.lat });
    let cameTitle = cameraInfo[idx].title + '\r\n' + cameraInfo[idx].url;

    // add Point
    let camera1 = new google.maps.Marker({
        title: cameTitle, position: camePosition, 
        map: mapView, draggable: false, zIndex: 200,
        icon: {
            path: 'M -3 0.01 A 3 3 0 1 0 -3 -0.01 Z',
            fillColor: 'blue',
            fillOpacity: 1,
            strokeColor: 'blue',
            strokeWeight: 2,
            strokeOpacity: 1,
            scale: 2,
            anchor: new google.maps.Point(0, 0)
        }
    });

    // add Camera Look
    let camera2 = new google.maps.Marker({
        title: cameTitle, position: camePosition, 
        map: mapView, draggable: false, zIndex: 100,
        icon: {
            path: 'M 0 0 L 20 -8 C 21 -3 21 3 20 8 Z',
            fillColor: 'blue',
            fillOpacity: 1,
            strokeColor: 'blue',
            strokeWeight: 0,
            strokeOpacity: 0.6,
            rotation: cameraInfo[idx].angle,
            scale: 2,
            anchor: new google.maps.Point(0, 0)
        }
    });

    // set icon click handler
    // camera1.addListener('click', function(){ window.open(cameraInfo[idx].url, '_blank'); });
    // camera2.addListener('click', function(){ window.open(cameraInfo[idx].url, '_blank'); });
    camera1.addListener('click', function(){ onClickCamera(idx); });
    camera2.addListener('click', function(){ onClickCamera(idx); });
}

function addPngIcon(idx, mapView)
{
    let camePosition = new google.maps.LatLng({ lng: cameraInfo[idx].position.lng, lat: cameraInfo[idx].position.lat });
    let cameTitle = cameraInfo[idx].title + '\r\n' + cameraInfo[idx].url;

    // add PNG Icon
    let camera = new google.maps.Marker({
        title: cameTitle, position: camePosition, 
        map: mapView, draggable: false, zIndex: 100,
        icon: {
            url: 'images/camera_64.png',
            anchor: new google.maps.Point(32, 18)
        }
    });

    // set icon click handler
    // camera.addListener('click', function(){ window.open(cameraInfo[idx].url, '_blank'); });
    camera.addListener('click', function(){ onClickCamera(idx); });
}