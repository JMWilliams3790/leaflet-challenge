// API
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

var myMap = L.map("mapid", {
    center: [45.5, -122.67],
    zoom: 11
  });
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);


  d3.json(url).then(function(geoData){
    console.log(geoData);
    console.log(geoData.coordinates);

  });
