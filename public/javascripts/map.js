mapboxgl.accessToken = mapToken;
    var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: camp.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
var marker1 = new mapboxgl.Marker()
.setLngLat(camp.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup()
    .setHTML(
        `<h4>${camp.title}</h4><p>${camp.location}</p>`
    )
)
.addTo(map);