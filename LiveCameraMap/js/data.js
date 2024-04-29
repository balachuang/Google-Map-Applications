var camePos = [
    {'title': '新北市碧潭', 'position': {'lng': 24.95592248953202, 'lat': 121.53516184925392}, 'angle': -20, 'url': 'https://www.youtube.com/watch?v=6wDmAmr7Lqg' },
    {'title': '墾丁大灣',   'position': {'lng': 21.94604182674932, 'lat': 120.79554740193250}, 'angle': 80,  'url': 'https://www.youtube.com/watch?v=0V_9uQhdibU' },
    {'title':  '', 'position': {'lng': 0.0, 'lat': 0.0}, 'angle': 0, 'url': 'url' }
];


// pre-defined camera icon marker
var svgCamMarker1 = {
    path: 'M 4 0 A 1 1 0 0 0 -4 0 A 1 1 0 0 0 4 0 Z',
    fillColor: 'blue',
    fillOpacity: 1,
    strokeColor: 'blue',
    strokeOpacity: 0,
    scale: 2,
    anchor: new google.maps.Point(0, 0)
};

var svgCamMarker2 = {
    path: 'M 0 0 L 20 -8 C 21 -3 21 3 20 8 Z',
    fillColor: 'yellow',
    fillOpacity: 0.6,
    strokeColor: 'blue',
    strokeWeight: 3,
    strokeOpacity: 0.6,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(0, 0)
};

