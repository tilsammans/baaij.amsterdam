var centerFrance = { lat: 46.709735, lng: 1.719103 };

// Radius of the geofence in meters
var radius = 500000;

// Function to calculate the distance between two points
function getDistanceFromLatLonInKm(point1, point2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(point2.lat - point1.lat);
    var dLon = deg2rad(point2.lng - point1.lng);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distance = R * c; // Distance in km
    return distance * 1000; // Distance in meters
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

// Function to check if a point is inside the circle
function isInsideCircle(point, center, radius) {
    var distance = getDistanceFromLatLonInKm(center, point);
    return distance <= radius;
}

function getLocation() {
    if (navigator.geolocation) {
        document.getElementById('loadership').style.display = 'flex';
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    document.getElementById('loadership').style.display = 'none';

    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var isWithinFrance = isInsideCircle({lat: position.coords.latitude, lng: position.coords.longitude}, centerFrance, radius);

    const queryParams = new URLSearchParams(window.location.search);
    const preview = queryParams.get('preview') === 'true';

    if (preview || isWithinFrance) {
        document.getElementById('open').showModal();
    } else {
        document.getElementById('locked').showModal();
    }
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function closeDialog(id) {
    var dialog = document.getElementById(id);
    dialog.close();
}

function answer(value) {
    var dialog = document.getElementById('open');
    dialog.close();

    if(value === 'b') {
        var video = document.getElementById('answer_video');
        video.showModal();
    }
}
