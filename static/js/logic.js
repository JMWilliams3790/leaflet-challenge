// Creating map object
var myMap = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Use this link to get the geojson data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(mag) {
  switch (true) {
  case mag > 6.9:
    return "red";
  case mag > 6.4:
    return "orangered";
  case mag > 5.9:
    return "orange";
  case mag > 5.4:
    return "yellow";
  case mag > 4.9:
    return "yellowgreen";
  default:
    return "green";
  }
}

// Grabbing our GeoJSON data..
d3.json(link).then(function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.bindPopup("<h1>" + feature.properties.mag + "</h1> <hr> <h2>" + 
      feature.properties.place + 
      "</h1> <hr> <h2>" + 
      new Date(feature.properties.time) + 
      "</h2>"
     );
    },
    style: function(feature) {
      return {
        color: "black",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: chooseColor(feature.properties.mag),
        fillOpacity: 0.5,
        radius: feature.properties.mag * 4,
        weight: 1.5
      };
    }
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [4.5, 4.9, 5.4, 5.9, 6.4, 6.9],
        labels = [];
        colors = ["green", "yellowgreen", "yellow", "orange", "orangered", "red"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

});
