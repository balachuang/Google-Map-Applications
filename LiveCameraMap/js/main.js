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

        new google.maps.Marker({
            position: new google.maps.LatLng({ lat: camePos[i].position.lng, lng: camePos[i].position.lat }),
            map: mapView,
            draggable: false,
            title: camePos[i].title,
            zIndex: 100,
            icon: {
                path: 'M 0 0 L 15 -5 L 15 5 Z',
                fillColor: 'yellow',
                fillOpacity: 0.6,
                strokeColor: 'blue',
                strokeWeight: 2,
                strokeOpacity: 0.6,
                rotation: camePos[i].angle,
                scale: 2,
                anchor: new google.maps.Point(0, 0)
            }
        });
        new google.maps.Marker({
            position: new google.maps.LatLng({ lat: camePos[i].position.lng, lng: camePos[i].position.lat }),
            map: mapView,
            draggable: false,
            title: camePos[i].title,
            zIndex: 100,
            icon: {
                path: 'M 3 0 A 1 1 0 0 0 -3 0 A 1 1 0 0 0 3 0 Z',
                fillColor: 'blue',
                fillOpacity: 0.6,
                stroke: 'none',
                rotation: 0,
                scale: 2,
                anchor: new google.maps.Point(0, 0)
            }
        });
    }
}
