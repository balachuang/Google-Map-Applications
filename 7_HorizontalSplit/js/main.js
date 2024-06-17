// let coder = null;
let glMapView = null;
let glStreetView = null;
let glMarkerBk = null;
let glMarkerAr = null;

const markerCr = 'M 7 0 A 7 7 90 0 0 0 -7 A 7 7 90 0 0 -7 0 A 7 7 90 0 0 0 7 A 7 7 90 0 0 7 0 Z';
const markerAr = 'M -0 3 L -4 4 L 0 -6 L 4 4 Z';

$(window).resize(onReSize);
$(document).ready(function()
{
	$('#menubar').load('../menubar.html', function(){
	    $('#nav-LF').addClass('active');

		var userLang = navigator.language || navigator.userLanguage;
		$('i18n').each(function(){
			var txt = $(this).attr(userLang);
			$(this).replaceWith(txt);
		});

        onReSize();
        initGoogle();
        // setInterval(checkStatus, 1000);
	});
});

function onReSize(){ $('.gmap-container').height($(window).height() - $('#idx-navbar').height() - 20); }

function initGoogle()
{
    // block initGoogle() until google is loaded.
    if((typeof(google) == 'undefined') || (google == null)) {
        setTimeout(initGoogle, 200);
        return;
    }

    // coder = new google.maps.Geocoder();
    let glCurrPos = new google.maps.LatLng({ lat: 25.032957706195887, lng: 121.56056000860389 });
    glGglMapView = new google.maps.Map(document.getElementById('gmap-map'), { center: glCurrPos, zoom: 18 });
    glStreetView = new google.maps.StreetViewPanorama(document.getElementById('gmap-street'), {position: glCurrPos, pov: {heading: 0, pitch: 0}, disableDoubleClickZoom: true});

    // set current position to real position
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            glCurrPos = new google.maps.LatLng({ lat: position.coords.latitude, lng: position.coords.longitude });
            glGglMapView.setCenter(glCurrPos);
            glStreetView.setPosition(glCurrPos);
        }, function() {
            console.log('Error in navigator.geolocation.getCurrentPosition: ' + error);
        });
    } else {
        // Browser doesn't support Geolocation
        console.log('navigator.geolocation not support, set map to default view.');
    }

    // add current position marker
    // SVG Path Editor: https://yqnn.github.io/svg-path-editor/
    glMarkerBk = new google.maps.Marker({
        position: glCurrPos, 
        map: glGglMapView, draggable: false, zIndex: 100,
        icon: {
            path: markerCr,
            fillColor: 'yellow',
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor: 'blue',
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(0, 0)
        }
    });
    glMarkerAr = new google.maps.Marker({
        position: glCurrPos, 
        map: glGglMapView, draggable: false, zIndex: 110,
        icon: {
            path: markerAr,
            fillColor: 'blue',
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(0, 0)
        }
    });

    // glMarker.addListener('dragend', function(){ markerDragEnd(0); });
    glGglMapView.addListener('click', mapPosChanged);
    glStreetView.addListener('position_changed', streetPosChanged);
    glStreetView.addListener('pov_changed', streetPosChanged);
}

function mapPosChanged(e)
{
    let glCurrPos = e.latLng;
    // moveMarkerTo(glCurrPos)
    // glMarkerBk.setPosition(glCurrPos);
    // glMarkerAr.setPosition(glCurrPos);
    glStreetView.setPosition(glCurrPos);
}

function streetPosChanged()
{
    let glCurrPos = glStreetView.getPosition();
    moveMarkerTo(glCurrPos)
    glGglMapView.panTo(glCurrPos);
    // glMarkerBk.setPosition(glCurrPos);
    // glMarkerAr.setPosition(glCurrPos);
    // glGglMapView.setCenter(glCurrPos);

    var heading = glStreetView.getPov().heading;
    glMarkerAr.setIcon({
        path: markerAr,
        fillColor: 'blue',
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: heading,
        scale: 2,
        anchor: new google.maps.Point(0, 0)
    });
}

function moveMarkerTo(newPos)
{
    let timeSpan = 200;
    let timeIntv = 10;
    let steps = timeSpan / timeIntv;

    let fromPos = glMarkerBk.getPosition();
    let latDelta = (newPos.lat() - fromPos.lat()) / steps;
    let lngDelta = (newPos.lng() - fromPos.lng()) / steps;

    for (let i=0; i<steps; ++i)
    {
        setTimeout(function(){
            let posTemp = new google.maps.LatLng({
                lat: fromPos.lat() + latDelta * i,
                lng: fromPos.lng() + lngDelta * i });
            glMarkerBk.setPosition(posTemp);
            glMarkerAr.setPosition(posTemp);
        }, (i+1) * timeIntv);
    }
}