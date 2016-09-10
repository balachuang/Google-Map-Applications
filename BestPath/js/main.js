var glMap = null;
var coder = null;
var gRender = null;
var glPosList = [];
var glPosMark = [];
var stationCandidate = [];
var pathCandidate = [];


$(document).ready(function(){
	$('#menubar').load('../menubar.html', function(){
	    $('#nav-BP').addClass('active');

		var userLang = navigator.language || navigator.userLanguage;
		$('i18n').each(function(){
			var txt = $(this).attr(userLang);
			$(this).replaceWith(txt);
		});

        onReSize();
        initGoogle();
	});

	$(document).on('click', '.glyphicon-pushpin', clickPin);
	$(document).on('click', '.glyphicon-remove', clickRemove);
	$(document).on('click', '.glyphicon-arrow-up', clickUp);
	$(document).on('click', '.glyphicon-arrow-down', clickDown);
	$('#go-plan').click(goPlan);
	$('#clear').click(clear);
});

$(window).resize(onReSize);

function onReSize(){
    var sh = $(window).height() - $('#idx-navbar').height() - 20;
    $('#google-map-container').height(sh);
    $('#povlist').height(sh);
    $('#reslist').height(sh);
}

function initGoogle(){
    coder = new google.maps.Geocoder();

    var pos = new google.maps.LatLng({ lat: 24.978606, lng: 121.539033 });

    glMap = new google.maps.Map(document.getElementById('google-map-container'), { center: pos, zoom: 16 });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = new google.maps.LatLng({  lat: position.coords.latitude,  lng: position.coords.longitude });
            glMap.setCenter(pos);
        }, function() {
            // Browser doesn't support Geolocation
        });
    } else {
        // Browser doesn't support Geolocation
    }

    glMap.addListener('rightclick', addNewPov);
    // glFView.addListener('position_changed', changePov);
}

function addNewPov(event)
{
    var idx = glPosList.length;
    var pos = event.latLng;
    var marker = new google.maps.Marker({
        position: pos,
        map: glMap,
        draggable: true,
        label: '' + (idx + 1)
    });
    marker.addListener('dragend', function(){ markerDragEnd(idx); });

    glPosList.push(pos);
    glPosMark.push(marker);

    coder.geocode({ location: pos }, function(result, status){
        if (status === google.maps.GeocoderStatus.OK) {
            var add = result[0].formatted_address;
            $('#povlist-ul').append(
                '<li class="list-group-item">' +
                (idx+1) + ' - ' + add +
				'		<span class="glyphicon glyphicon-remove" aria-hidden="true" />' +
				'		<span class="glyphicon glyphicon-arrow-down" aria-hidden="true" />' +
				'		<span class="glyphicon glyphicon-arrow-up" aria-hidden="true" />' +
				'		<span class="glyphicon glyphicon-pushpin" aria-hidden="true" />' +
                '</li>'
            );
            $('#povlist-init').remove();
        }
    });
}

function markerDragEnd(idx)
{
    var pos = glPosMark[idx].getPosition();
    glPosList[idx] = pos;

    coder.geocode({ location: pos }, function(result, status){
        if (status === google.maps.GeocoderStatus.OK) {
            var add = result[0].formatted_address;
            $('li.list-group-item').eq(idx).html(
                (idx+1) + ' - ' + add +
				'<span class="glyphicon glyphicon-remove" aria-hidden="true" />' +
				'<span class="glyphicon glyphicon-arrow-down" aria-hidden="true" />' +
				'<span class="glyphicon glyphicon-arrow-up" aria-hidden="true" />' +
				'<span class="glyphicon glyphicon-pushpin" aria-hidden="true" />'
            );
        }
    });
}

function clickRemove()
{
    $(this).closest('li.list-group-item').toggleClass('disabled');
}

function clickPin()
{
    $(this).closest('li.list-group-item').toggleClass('list-group-item-info');
}

function clickUp()
{
    var idx = $(this).closest('li.list-group-item').index();
    if (idx <= 0) return;

    var pos = glPosList[idx];
    glPosList[idx] = glPosList[idx - 1];
    glPosList[idx - 1] = pos;

    var marker = glPosMark[idx];
    glPosMark[idx] = glPosMark[idx - 1];
    glPosMark[idx - 1] = marker;
    glPosMark[idx].setLabel('' + (idx+1));
    glPosMark[idx-1].setLabel('' + idx);

    $('li.list-group-item').eq(idx).insertBefore($('li.list-group-item').eq(idx-1));
    var html = $('li.list-group-item').eq(idx-1).html();
    $('li.list-group-item').eq(idx-1).html(idx + ' - ' + html.substring(html.indexOf(' - ') + 3));
    html = $('li.list-group-item').eq(idx).html();
    $('li.list-group-item').eq(idx).html((idx+1) + ' - ' + html.substring(html.indexOf(' - ') + 3));
}

function clickDown()
{
    var idx = $(this).closest('li.list-group-item').index();
    if (idx >= $('li.list-group-item').length - 1) return;

    var pos = glPosList[idx];
    glPosList[idx] = glPosList[idx + 1];
    glPosList[idx + 1] = pos;

    var marker = glPosMark[idx];
    glPosMark[idx] = glPosMark[idx + 1];
    glPosMark[idx + 1] = marker;
    glPosMark[idx].setLabel('' + (idx+1));
    glPosMark[idx+1].setLabel('' + (idx+2));

    $('li.list-group-item').eq(idx).insertAfter($('li.list-group-item').eq(idx+1));
    var html = $('li.list-group-item').eq(idx).html();
    $('li.list-group-item').eq(idx).html((idx+1) + ' - ' + html.substring(html.indexOf(' - ') + 3));
    html = $('li.list-group-item').eq(idx+1).html();
    $('li.list-group-item').eq(idx+1).html((idx+2) + ' - ' + html.substring(html.indexOf(' - ') + 3));
}

function goPlan()
{
    stationCandidate = [];
    pathCandidate = [];

    $('li.list-group-item:not(".disabled")').each(function(){ stationCandidate.push($(this).index()); });
    if (stationCandidate.length <= 2) return;

    generatePossiblePaths(0, '');

    // start calculate travel times
    var directionsService = new google.maps.DirectionsService;
    var orig = null;
    var ways = null;
    var dest = null;
    var processed = 0;
    var minTime = Number.MAX_VALUE;
    var bestRes = null;
    for (var n=0; n<pathCandidate.length; ++n)
    {
        var stations = pathCandidate[n].split(',');

        //https://developers.google.com/maps/documentation/directions/intro?hl=zh-tw#RequestParameters
        // 原來 google 有 "最佳化路徑"

        orig = glPosList[eval(stations[0])];
        dest = glPosList[eval(stations[stations.length-1])];
        ways = [];
        for (var i=1; i<stations.length-1; ++i) {
            ways.push({location: glPosList[eval(stations[i])], stopover: true});
        }
        directionsService.route({
                origin: orig,
                waypoints: ways,
                destination: dest,
                travelMode: google.maps.TravelMode.DRIVING
            },
            function(response, status) {
                processed ++;
                if (status == 'OK') {
                    var tms = 0;
                    var legs = response.routes[0].legs;
                    for (var l=0; l<legs.length; ++l) {
                        tms += legs[l].duration.value;
                    }
                    if (minTime > tms) {
                        minTime = tms;
                        bestRes = response;
                    }
                }

                if (processed == pathCandidate.length) showResult(bestRes);
                // {
                //     $('#point-list').fadeOut(300, function(){
                //         $('#result-info').fadeIn(300);
                //     });
                //     gRender = new google.maps.DirectionsRenderer({
                //         directions: bestRes,
                //         draggable: false,
                //         panel: document.getElementById('result-info-panel'),
                //         map: glMap
                //     });
                // }
            }
        );
    }
}

function generatePossiblePaths(curSta, curPath)
{
    if (curSta >= stationCandidate.length)
    {
        pathCandidate.push(curPath.substring(1));
        return;
    }

    var testIdx = stationCandidate[curSta];
    if ($('li.list-group-item:eq("' + testIdx + '")').hasClass('list-group-item-info'))
    {
        // this station is fix, go revursive
        generatePossiblePaths(curSta + 1, curPath + ',' + testIdx);
    }else{
        // select one station from candidate
        for (var n=0; n<stationCandidate.length; ++n)
        {
            testIdx = stationCandidate[n];

            // skip this station if already selected
            if (curPath.indexOf(',' + testIdx) >= 0) continue;

            // skip this station if it's fix
            if ($('li.list-group-item:eq("' + testIdx + '")').hasClass('list-group-item-info')) continue;

            // go revursive
            generatePossiblePaths(curSta + 1, curPath + ',' + testIdx);
        }
    }
}

function showResult(result)
{
    $('#point-list').fadeOut(300, function(){
        $('#result-info').fadeIn(300);
    });
    for (var n=0; n<glPosMark.length; ++n) glPosMark[n].setMap(null);
    gRender = new google.maps.DirectionsRenderer({
        directions: result,
        draggable: false,
        panel: document.getElementById('result-info-panel'),
        map: glMap
    });
}

function clear()
{
    $('#result-info').fadeOut(300, function(){
        $('#point-list').fadeIn(300);
    });
    gRender.setMap(null);
    for (var n=0; n<glPosMark.length; ++n) glPosMark[n].setMap(glMap);
}

