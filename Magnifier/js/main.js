var glMap = null,
    glMag = null,
    glMapPos = null,
    glMagPos = null;

$(document).ready(function(){
	$('#menubar').load('../menubar.html', function(){
	    $('#nav-MG').addClass('active');

        onReSize();
        initGoogle();
	});
});

$(window).resize(onReSize);

function onReSize(){
    $('#google-map-container').height($(window).height() - $('#idx-navbar').height() - 20);
}

function initGoogle(){
    coder = new google.maps.Geocoder();

    glMapPos = new google.maps.LatLng({ lat: 24.978606, lng: 121.540033 });
    glMagPos = new google.maps.LatLng({ lat: 24.978606, lng: 121.541033 });

    glMap = new google.maps.Map(document.getElementById('google-map-container'), { center: glMapPos, zoom: 16 });
    glMag = new google.maps.Map(document.getElementById('magnifier-container'), { center: glMagPos, zoom: 18 });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            resetPosByCenter(position.coords.latitude, position.coords.longitude);
            glMap.setCenter(glMapPos);
            glMag.setCenter(glMagPos);
        }, function() {
            // Browser doesn't support Geolocation
        });
    } else {
        // Browser doesn't support Geolocation
    }

    glMap.addListener('mousemove', moveMag);
    glMap.addListener('zoom_changed', zoomMag);
    glMap.addListener('rightclick', toggleMag);
}

function moveMag(event)
{
    glMag.setCenter(event.latLng);
    $('#magnifier-container').css({
         'left' : event.pixel.x - 100,
         'top'  : event.pixel.y - 100
    });
}

function zoomMag(event)
{
    glMag.setZoom(glMap.getZoom() + 2);
}

function toggleMag(event)
{
    $('#magnifier-container').fadeToggle(500);
}
