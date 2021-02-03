//Prepare data for drawing tectonic plates
var geoJsonPlates = null;
var plates = d3.json("static/data/plates.json").then((data) => {
  console.log(data);
  geoJsonPlates = data;

});

// Creating map object
var myMap = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 5
});

// Adding tile layer
var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Use this link to get the geojson data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";



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
d3.json(link).then(function(data) {
  // Creating a geoJSON layer with the retrieved data
  var quakeMarker = L.geoJson(data, {
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

  var USGS_USImageryTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
  });
  
  var topoMap = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
  });
  // Only one base layer can be shown at a time
  var baseMaps = {
    Street: streetMap,
    Topography: topoMap,
    Satellite: USGS_USImageryTopo
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

