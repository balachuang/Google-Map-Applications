var glView = [0, 0, 0],
    glPos = [0, 0, 0],
    glMarker = [0, 0, 0],
    glPath = [0, 0, 0],
    glTarget = null,
    glTargetView = null;
var coder = null;

$(document).ready(function(){
    onReSize();
    initGoogle();
    setInterval(checkStatus, 1000);
});

$(window).resize(onReSize);

function onReSize(){
    var mar = 10;
    var sw = $(window).width();
    var sh = $(window).height();
    $('#google-map-container').width(sw/2 - 1.5*mar);
    $('#google-map-container').height(sh - 2*mar);
    $('#street-view-container-1').width(sw/2 - 1.5*mar);
    $('#street-view-container-1').height(sh/2 - 1.5*mar);
    $('#street-view-container-2').width(sw/2 - 1.5*mar);
    $('#street-view-container-2').height(sh/2 - 1.5*mar);
    $('#google-map-container').css({ 'left' : mar, 'top' : mar });
    $('#street-view-container-1').css({ 'left' : sw/2 + 0.5*mar, 'top' : mar });
    $('#street-view-container-2').css({ 'left' : sw/2 + 0.5*mar, 'top' : sh/2 + 0.5*mar });
    $('#aim-center-1').css({
        'left' : $('#street-view-container-1').position().left + $('#street-view-container-1').width()/2 - 15,
        'top' : $('#street-view-container-1').position().top + $('#street-view-container-1').height()/2 - 15 });
    $('#aim-center-2').css({
        'left' : $('#street-view-container-2').position().left + $('#street-view-container-2').width()/2 - 15,
        'top' : $('#street-view-container-2').position().top + $('#street-view-container-2').height()/2 - 15 });
}

function initGoogle(){
    coder = new google.maps.Geocoder();

    glPos[0] = new google.maps.LatLng({ lat: 24.978606, lng: 121.540033 });
    glPos[1] = new google.maps.LatLng({ lat: 24.978606, lng: 121.541033 });
    glPos[2] = new google.maps.LatLng({ lat: 24.978606, lng: 121.539033 });

    glView[0] = new google.maps.Map(document.getElementById('google-map-container'), { center: glPos[0], zoom: 16 });
    glView[1] = new google.maps.StreetViewPanorama(document.getElementById('street-view-container-1'), {position: glPos[1], pov: {heading: 0, pitch: 0}, disableDoubleClickZoom: true});
    glView[2] = new google.maps.StreetViewPanorama(document.getElementById('street-view-container-2'), {position: glPos[2], pov: {heading: 0, pitch: 0}, disableDoubleClickZoom: true});

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            resetPosByCenter(position.coords.latitude, position.coords.longitude);
            glView[0].setCenter(glPos[0]);
            glView[1].setPosition(glPos[1]);
            glView[2].setPosition(glPos[2]);
        }, function() {
            var infoWindow = new google.maps.InfoWindow({map: glView[0]});
            handleLocationError(true, infoWindow, glView[0].getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        var infoWindow = new google.maps.InfoWindow({map: glView[0]});
        handleLocationError(false, infoWindow, glView[0].getCenter());
    }

    glMarker[0] = new google.maps.Marker({
        position: glPos[0],
        map: glView[0],
        draggable: true,
        title:"Map Center",
        zIndex: 100,
        icon: {url: 'images/eyeCen.png', anchor: new google.maps.Point(12, 12)}
    });
    glMarker[1] = new google.maps.Marker({
        position: glPos[1],
        map: glView[0],
        draggable: true,
        title: 'View 1',
        zIndex: 50,
        label: {text: 'O', color: 'yellow', fontWeight: 'bolder'},
        icon: {url: 'images/eye1.png', anchor: new google.maps.Point(12, 12)}
    });
    glMarker[2] = new google.maps.Marker({
        position: glPos[2],
        map: glView[0],
        draggable: true,
        title: 'View 2',
        zIndexl: 50,
        label: {text: 'O', color: 'blue', fontWeight: 'bolder'},
        icon: {url: 'images/eye2.png', anchor: new google.maps.Point(12, 12)}
    });
    glTarget = new google.maps.Marker({
        position: glPos[0],
        map: glView[0],
        draggable: false,
        title:"Target",
        visible: true,
        clickable: true,
        zIndex: 70,
        icon: {url: 'images/eyeCen.png', anchor: new google.maps.Point(12, 12)}
    });

    glPath[0] = null;
    glPath[1] = new google.maps.Polyline({
        path: [glPos[1], glPos[1]],
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: 0.3,
        strokeWeight: 5,
        map: glView[0]
    });
    glPath[2] = new google.maps.Polyline({
        path: [glPos[2], glPos[2]],
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: 0.3,
        strokeWeight: 5,
        map: glView[0]
    });
    setDirectionLine(1);
    setDirectionLine(2);

    glMarker[0].addListener('dragend', function(){ markerDragEnd(0); });
    glMarker[1].addListener('dragend', function(){ markerDragEnd(1); });
    glMarker[2].addListener('dragend', function(){ markerDragEnd(2); });
    glView[1].addListener('position_changed', function(){ panoPosChange(1); });
    glView[2].addListener('position_changed', function(){ panoPosChange(2); });
    glView[1].addListener('pov_changed', function(){ panoPovChange(1); });
    glView[2].addListener('pov_changed', function(){ panoPovChange(2); });
    glTarget.addListener('click', onClickTarget);
}

function markerDragEnd(idx)
{
    switch(idx) {
        case 0:
            glPos[0] = glMarker[0].getPosition();
            glPos[1] = new google.maps.LatLng({lat: glPos[0].lat() + 0.001, lng: glPos[0].lng() + 0.001});
            glPos[2] = new google.maps.LatLng({lat: glPos[0].lat() - 0.001, lng: glPos[0].lng() - 0.001});
            glView[0].setCenter(glPos[0]);
            glView[1].setPosition(glPos[1]);
            glView[2].setPosition(glPos[2]);
            break;
        case 1:
        case 2:
            glPos[idx] = glMarker[idx].getPosition();
            glView[idx].setPosition(glPos[idx]);
           break;
        default:
            break;
    }
}

function panoPosChange(idx)
{
    switch(idx) {
        case 1:
        case 2:
            glPos[idx] = glView[idx].getPosition();
            glMarker[idx].setPosition(glPos[idx]);
            setDirectionLine(idx);

            var tpos = calTargetPoint();
            if (tpos != null) glTarget.setPosition(tpos);
            break;
        default:
            break;
    }
}

function panoPovChange(idx)
{
    if (idx == 0) return;
    setDirectionLine(idx);

    var tpos = calTargetPoint();
    if (tpos != null) {
        glTarget.setPosition(tpos);
        coder.geocode({ location: tpos }, function(result, status){
            if (status === google.maps.GeocoderStatus.OK)
                glTarget.setOptions({ title: result[0].formatted_address });
        });
    }
}

function setDirectionLine(idx)
{
    if (idx == 0) return;

    var heading = glView[idx].getPov().heading;
    var x = 0.1 * Math.sin(Math.PI * heading / 180);
    var y = 0.1 * Math.cos(Math.PI * heading / 180);

    glPath[idx].setPath([glPos[idx], {lat: glPos[idx].lat() + y, lng: glPos[idx].lng() + x}]);
}

function resetPosByCenter(lat, lng)
{
    glPos[0] = new google.maps.LatLng({ lat: lat, lng: lng });
    glPos[1] = new google.maps.LatLng({ lat: lat + 0.001, lng: lng + 0.001 });
    glPos[2] = new google.maps.LatLng({ lat: lat + 0.001, lng: lng - 0.001 });
    
}

function calTargetPoint()
{
    var x1 = [0, 0, 0];
    var x2 = [0, 0, 0];
    var y1 = [0, 0, 0];
    var y2 = [0, 0, 0];
    var vecX = [0, 0, 0];
    var vecY = [0, 0, 0];
    var length = [0, 0, 0];

    for (var n=1; n<=2; ++n)
    {
        var heading = glView[n].getPov().heading;
        var x = 0.1 * Math.sin(Math.PI * heading / 180);
        var y = 0.1 * Math.cos(Math.PI * heading / 180);

        x1[n] = glPos[n].lng();
        y1[n] = glPos[n].lat();
        x2[n] = glPos[n].lng() + x;
        y2[n] = glPos[n].lat() + y;
    }

    for (var n=1; n<=2; ++n)
    {
        vecX[n] = x2[n] - x1[n];
        vecY[n] = y2[n] - y1[n];
        length[n] = Math.sqrt(vecX[n] * vecX[n] + vecY[n] * vecY[n]);
        vecX[n] = vecX[n] / length[n];
        vecY[n] = vecY[n] / length[n];
    }

    var denominator = vecX[1] * vecY[2] - vecY[1] * vecX[2];
    var molecular1 = x1[2] - x1[1];
    var molecular2 = y1[2] - y1[1];
    var ta = (vecY[2] * molecular1 - vecX[2] * molecular2) / denominator;
    var tb = (vecY[1] * molecular1 - vecX[1] * molecular2) / denominator;
    if ((0 > ta) || (ta > 1) || (0 > tb) || (tb > 1)) {
        glTarget.setOpacity(0);
        return null;
    }

    glTarget.setOpacity(1 - 1 / (1 + Math.exp(6.5 - 100 * Math.max(ta, tb))));

    var tx1 = x1[1] + ta * vecX[1];
    var tx2 = x1[2] + tb * vecX[2];
    var ty1 = y1[1] + ta * vecY[1];
    var ty2 = y1[2] + tb * vecY[2];

    var targetPos = new google.maps.LatLng({ lat: (ty1+ty2)/2, lng: (tx1+tx2)/2 });
    return targetPos;
}

function onClickTarget()
{
    glTargetView = glView[0].getStreetView();
    glTargetView.setPosition(glTarget.getPosition());
    glTargetView.setVisible(true);
}

function checkStatus()
{
    for (var n=1; n<=2; ++n) {
        if (glView[n].getStatus() === google.maps.StreetViewStatus.OK)
        {
            glMarker[n].setOpacity(1);
            glPath[n].setOptions({strokeOpacity: 0.3});
            glView[n].setVisible(true);
        }else{
            glMarker[n].setOpacity(0.3);
            glPath[n].setOptions({strokeOpacity: 0});
            glView[n].setVisible(false);
        }
    }
}