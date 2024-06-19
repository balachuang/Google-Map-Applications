let glMapView = null;
let glStreetView = null;
let glMarkerBk = null;
let glMarkerAr = null;

const MARKER_BACKGROUND = 'M 7 0 A 7 7 90 0 0 0 -7 A 7 7 90 0 0 -7 0 A 7 7 90 0 0 0 7 A 7 7 90 0 0 7 0 Z';
const MARKER_ARROW = 'M -0 3 L -4 4 L 0 -6 L 4 4 Z';
const MARKER_ANIMATE_TIME_SPAN = 200;
const MARKER_ANIMATE_TIME_INTERVAL = 10;

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
	});
});

function onReSize(){ $('.gmap-container').height($(window).height() - $('#idx-navbar').height()); }

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
    glGglMapView.setOptions({draggableCursor:'pointer'});

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
            path: MARKER_BACKGROUND,
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
            path: MARKER_ARROW,
            fillColor: 'blue',
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(0, 0)
        }
    });

    glGglMapView.addListener('click', mapClicked);
    glStreetView.addListener('position_changed', streetPosChanged);
    glStreetView.addListener('pov_changed', streetPovChanged);
}

function mapClicked(e)
{
    // check StreetView data existing
    let glCurrPos = e.latLng;
    (new google.maps.StreetViewService()).getPanoramaByLocation(glCurrPos, 50, function(result, status){
        if (status == google.maps.StreetViewStatus.OK) glStreetView.setPosition(glCurrPos);
        else
        {
            // show error message if there is no StreetView data
            let infowindow = new google.maps.InfoWindow({
                position: glCurrPos,
                content: $('#error-msg').html()
            });
            infowindow.addListener('close', ()=>{ glGglMapView.panTo(glStreetView.getPosition()); });
            infowindow.addListener('domready', ()=>{ $('.gm-style-iw-ch').next('button').hide(); });
            infowindow.open({ map: glGglMapView });
            setTimeout(function(){ infowindow.close(); }, 1500);
        }
    });
}

function streetPosChanged()
{
    // move marker first, then pan map
    let glCurrPos = glStreetView.getPosition();
    moveMarkerTo(-1, glCurrPos);
}

function streetPovChanged()
{
    var heading = glStreetView.getPov().heading;
    glMarkerAr.setIcon({
        path: MARKER_ARROW,
        fillColor: 'blue',
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: heading,
        scale: 2,
        anchor: new google.maps.Point(0, 0)
    });
}

function moveMarkerTo(idx, newPos)
{
    if (idx < 0)
    {
        // create steps
        let steps = MARKER_ANIMATE_TIME_SPAN / MARKER_ANIMATE_TIME_INTERVAL;
        let fromPos = glMarkerBk.getPosition();
        let latDelta = (newPos.lat() - fromPos.lat()) / steps;
        let lngDelta = (newPos.lng() - fromPos.lng()) / steps;
        newPos = [];
        for (let i=0; i<steps; ++i)
        {
            newPos[i] = new google.maps.LatLng({
                lat: fromPos.lat() + latDelta * (i+1),
                lng: fromPos.lng() + lngDelta * (i+1)
            });
        }
        idx = -1;
    }else{
        // perform animation
        if (idx >= newPos.length) {
            glGglMapView.panTo(newPos[newPos.length - 1]);
            return;
        }
        glMarkerBk.setPosition(newPos[idx]);
        glMarkerAr.setPosition(newPos[idx]);
    }

    setTimeout(() => {
        moveMarkerTo(idx + 1, newPos);
    }, MARKER_ANIMATE_TIME_INTERVAL);
}
