const map = document.getElementById('map');

const loadMap = (lat, lng, lv) => {
    lat ??= 35.864592;
    lng ??= 128.593334;
    lv ??= 3;
    map.instance = new kakao.maps.Map(map, {
        center: new kakao.maps.LatLng(lat, lng),
        level: lv
    });
    kakao.maps.event.addListener(map.instance, 'bounds_changed', () => {
        localStorage.setItem('lastLat', map.instance.getCenter().getLat());
        localStorage.setItem('lastLng', map.instance.getCenter().getLng());
        localStorage.setItem('level', map.instance.getLevel());
        loadPlaces();
    });
    kakao.maps.event.addListener(map.instance, 'dragend', () => {
        loadPlaces();
    });
    kakao.maps.event.addListener(map.instance, 'zoom_changed', () => {
        loadPlaces();
    });
    kakao.maps.event.addListener(map.instance, 'tilesloaded', () => {
        loadPlaces();
    });
};

if (!isNaN(parseFloat(localStorage.getItem('lastLat'))) &&
    !isNaN(parseFloat(localStorage.getItem('lastLng'))) &&
    !isNaN(parseInt(localStorage.getItem('level')))) {
    loadMap(
        parseFloat(localStorage.getItem('lastLat')),
        parseFloat(localStorage.getItem('lastLng')),
        parseInt(localStorage.getItem('level'))
    );
} else {
    navigator.geolocation.getCurrentPosition((data) => {
        loadMap(data.coords.latitude, data.coords.longitude);
    }, () => {
        loadMap();
    });
}