var mapGeoCoder = null;

$(document).ready(function(){
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
    let mapView = new google.maps.Map(document.getElementById('google-map-container'), { center: initPos, zoom: 8 });

    if (navigator.geolocation) {
        // Browser support Geolocation, get actual position
        navigator.geolocation.getCurrentPosition(function(position) {
            mapView.setCenter(new google.maps.LatLng({ lat: position.coords.latitude, lng: position.coords.longitude }));
        }, function() {
            var infoWindow = new google.maps.InfoWindow({map: mapView});
            handleLocationError(true, infoWindow, mapView.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        var infoWindow = new google.maps.InfoWindow({map: mapView});
        handleLocationError(false, infoWindow, mapView.getCenter());
    }

    for (let i=0; i<camePos.length; ++i)
    {
        if (camePos[i].title == '') continue;

        let camePosition = new google.maps.LatLng({ lat: camePos[i].position.lng, lng: camePos[i].position.lat });
        let cameTitle = camePos[i].title + '\r\n(' + camePos[i].url + ')';

        // add Point
        let camera1 = new google.maps.Marker({
            title: cameTitle, position: camePosition, 
            map: mapView, draggable: false, zIndex: 200,
            icon: {
                path: 'M -6 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0 z',
                fillColor: 'blue',
                fillOpacity: 1,
                strokeColor: 'blue',
                strokeWeight: 0,
                strokeOpacity: 0,
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
                rotation: camePos[i].angle,
                scale: 2,
                anchor: new google.maps.Point(0, 0)
            }
        });

        // set icon click handler
        camera1.addListener('click', function(){ window.open(camePos[i].url, '_blank'); });
        camera2.addListener('click', function(){ window.open(camePos[i].url, '_blank'); });
    }
}
