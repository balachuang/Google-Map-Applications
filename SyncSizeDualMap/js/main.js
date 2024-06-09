let glViewLt = null;
let glViewRt = null;
let currentActiveMap = 0;

$(window).resize(onReSize);
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

function onReSize()
{
    var sh = $(window).height() - $('#idx-navbar').height() - 20;
    $('#gMapL').height(sh);
    $('#gMapR').height(sh);
}

function initGoogle()
{
    let pos = new google.maps.LatLng({ lat: 24.978606, lng: 121.540033 });
    glViewLt = new google.maps.Map(document.getElementById('gMapL'), { center: pos, zoom: 16 });
    glViewRt = new google.maps.Map(document.getElementById('gMapR'), { center: pos, zoom: 16 });

    // set google map container handler
    $('#gMapL').on('mouseenter', activeLeftGMap);
    $('#gMapR').on('mouseenter', activeRightGMap);
}

function activeLeftGMap()
{
    google.maps.event.clearListeners(glViewRt, 'zoom_changed');
    glViewLt.addListener('zoom_changed', function(){ afterChangeZoomLevel(true); });
}

function activeRightGMap()
{
    google.maps.event.clearListeners(glViewLt, 'zoom_changed');
    glViewRt.addListener('zoom_changed', function(){ afterChangeZoomLevel(false); });
}

function afterChangeZoomLevel(isLeft)
{
    if (isLeft) glViewRt.setZoom(glViewLt.getZoom());
    else        glViewLt.setZoom(glViewRt.getZoom());
}
