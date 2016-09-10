var glFView = null,
    glBView = null,
    glPos = null;

$(document).ready(function(){
	$('#menubar').load('../menubar.html', function(){
	    $('#nav-RM').addClass('active');

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

function onReSize(){
    $('#street-view-container').height($(window).height() - $('#idx-navbar').height() - 20);
    $('#rearview-container').css({
        'width' : $('#street-view-container').width() / 3,
        'height' : $('#street-view-container').height() / 4,
        'left' : $('#street-view-container').width() / 3
    });
    $('#rearview-container-back').css({
        'width' : $('#rearview-container').width() + 30,
        'height' : $('#rearview-container').height() + 20,
        'left' : $('#rearview-container').position().left -10
    });
}

function initGoogle(){
    coder = new google.maps.Geocoder();

    glPos = new google.maps.LatLng({ lat: 24.978606, lng: 121.539033 });

    glFView = new google.maps.StreetViewPanorama(document.getElementById('street-view-container'), {
                                                position: glPos,
                                                pov: {heading: 0, pitch: 0},
                                                disableDoubleClickZoom: true,
                                                zoomControl: false,
                                                addressControl: false,
                                                linksControl: false,
                                                panControl: false,
                                                fullscreenControl: false});
    glBView = new google.maps.StreetViewPanorama(document.getElementById('rearview-container'), {
                                                position: glPos,
                                                pov: {heading: 180, pitch: 0},
                                                disableDoubleClickZoom: true,
                                                zoomControl: false,
                                                addressControl: false,
                                                linksControl: false,
                                                panControl: false,
                                                fullscreenControl: false});

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            glPos = new google.maps.LatLng({  lat: position.coords.latitude,  lng: position.coords.longitude });
            glFView.setPosition(glPos);
            glBView.setPosition(glPos);
        }, function() {
            // Browser doesn't support Geolocation
        });
    } else {
        // Browser doesn't support Geolocation
    }

    glFView.addListener('pov_changed', changePov);
    glFView.addListener('position_changed', changePov);
}

function changePov(event)
{
    glPos = glFView.getPosition();
    glBView.setPosition(glPos);

    var glPov = glFView.getPov();
    glPov.heading += 180;
    glBView.setPov(glPov);
}
