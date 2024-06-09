let glViewLt = null;
let glViewRt = null;
// let coder = null;

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
    $('#google-map-container-lt').height(sh);
    $('#google-map-container-rt').height(sh);
}

function initGoogle()
{
    // coder = new google.maps.Geocoder();

    let pos = new google.maps.LatLng({ lat: 24.978606, lng: 121.540033 });
    glViewLt = new google.maps.Map(document.getElementById('google-map-container-lt'), { center: pos, zoom: 16 });
    glViewRt = new google.maps.Map(document.getElementById('google-map-container-rt'), { center: pos, zoom: 16 });

    // set zoom handler
    glViewLt.addListener('zoom_changed', function(){ afterChangeZoomLevel(true); });
    glViewRt.addListener('zoom_changed', function(){ afterChangeZoomLevel(false); });
}

function afterChangeZoomLevel(isLeft)
{
    // stop zooming
    if (isLeft) glViewRt.setZoom(glViewLt.getZoom());
    else        glViewLt.setZoom(glViewRt.getZoom());
}
