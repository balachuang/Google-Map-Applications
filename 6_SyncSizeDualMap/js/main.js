let glViewLt = null;
let glViewRt = null;
let activeGMap = 0; // left: 1, right: 2

$(document).ready(function(){
	$('#menubar').load('../menubar.html', function(){
	    $('#nav-DM').addClass('active');

		var userLang = navigator.language || navigator.userLanguage;
		$('i18n').each(function(){
			var txt = $(this).attr(userLang);
			$(this).replaceWith(txt);
		});

        // set google map container handler
        $('#gMapL').on('mouseenter', focusToLGMap);
        $('#gMapR').on('mouseenter', focusToRGMap);
        $('#gMapL').on('mouseleave', leaveGMap);
        $('#gMapR').on('mouseleave', leaveGMap);

        onReSize();
        initGoogle();
	});
});

$(window).resize(onReSize);
function onReSize()
{
    var sh = $(window).height() - $('#idx-navbar').height() - 20;
    $('#gMapL').height(sh);
    $('#gMapR').height(sh);
}

function initGoogle()
{
    // block initGoogle() until google is loaded.
    if((typeof(google) == 'undefined') || (google == null)) {
        setTimeout(initGoogle, 200);
        return;
    }

    let pos = new google.maps.LatLng({ lat: 24.978606, lng: 121.540033 });
    glViewLt = new google.maps.Map(document.getElementById('gMapL'), { center: pos, zoom: 16 });
    glViewRt = new google.maps.Map(document.getElementById('gMapR'), { center: pos, zoom: 16 });

    glViewLt.addListener('zoom_changed', function(){ afterChangeZoomLevel(true); });
    glViewRt.addListener('zoom_changed', function(){ afterChangeZoomLevel(false); });
}

function focusToLGMap() { activeGMap = 1; }
function focusToRGMap() { activeGMap = 2; }
function leaveGMap() { activeGMap = 0; }

function afterChangeZoomLevel(isLeft)
{
    if ( isLeft && (activeGMap == 1)) glViewRt.setZoom(glViewLt.getZoom());
    if (!isLeft && (activeGMap == 2)) glViewLt.setZoom(glViewRt.getZoom());
}
