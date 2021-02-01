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

var plateStyle = {
  color: "orange",
  weight: 1.5
};

var plates = d3.json("static/data/plates.json").then(function(data){
  console.log(data)
  L.geoJson(data, { 
    onEachFeature: function(feature, layer) {
        // Set mouse events to change map styling
        layer.on({
        
          // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
          click: function(event) {
            myMap.fitBounds(event.target.getBounds());
          }
        });
      }
    }
  )}
);


// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(value) {
  switch (true) {
  case value > 90:
    return "red";
  case value > 69:
    return "orangered";
  case value > 49:
    return "orange";
  case value > 29:
    return "yellow";
  case value > 9:
    return "yellowgreen";
  default:
    return "green";
  }
}

// Grabbing our GeoJSON data..
var quakeMarker = d3.json(link).then(function(data) {
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
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.5,
        radius: feature.properties.mag * 4,
        weight: 1.5
      };
    }
  }).addTo(myMap);

  var quakeLayer = L.layerGroup(quakeMarker);

  // Define variables for our tile layers
  var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });
  
  var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  
  // Only one base layer can be shown at a time
  var baseMaps = {
    Light: light,
    Dark: dark,
    Street: myMap
  };
  
  // Overlays that may be toggled on or off
  var overlayMaps = {
    Quakes: quakeLayer
  };
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
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

