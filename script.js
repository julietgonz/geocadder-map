mapboxgl.accessToken =
  "pk.eyJ1IjoibGp1bGlldGdvbnoiLCJhIjoiY2toMmpreWlnMDRwczJwcHo3NmpvMnd2byJ9.tkOaB_P4mtWwjDPUKAVYnQ";

var filterGroup = document.getElementById("ll");
// var filterGroup = document.getElementById('filter-group');

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/ljulietgonz/clp1v16je00vw01qo4joc6dyt",
  center: [-98.41680517868062, 57.550480044655636],
  zoom: 5,
  preserveDrawingBuffer: true,
  customAttribution:
    '<a target="_blank" href=http://www.geocadder.bg/en>GEOCADDDER</a>',
});

var zoomButton = new mapboxgl.NavigationControl({ showCompass: false });
map.addControl(zoomButton, "bottom-left");

var bounds = new mapboxgl.LngLatBounds();

var markersAllIds = [];

var markersAllIdsLatsLongs = [];
var onlySelectedaccessibilityPoints = [];
var isinitialSelectedMarkerId = false;
var initialSelectedMarkerId = "";
var counter = 0;

var mainPointLatitude;
var mainPointLongitude;

/// loading POIs data from Google Sheets table///
$.getJSON("points.geojson", function (response) {
  console.log(response.features);
  response.features.forEach(function (marker) {
    var name = marker.properties.name;
    var address = marker.properties.address;
    var description = marker.properties.description;
    var markerId = marker.properties.id;
    var iconImage = marker.properties["icon-image"];

    var latitude = marker.geometry.coordinates[0];
    var longitude = marker.geometry.coordinates[1];

    bounds.extend([longitude, latitude]);
    mainPointLatitude = parseFloat(marker[3]);
    mainPointLongitude = parseFloat(marker[4]);

    var popupContent = "<div class='title'>" + name + "</div>";

    popupContent +=
      "<div class='address'>" +
      address +
      "</div><div class='description'>" +
      description +
      "</div>";

    popup = new mapboxgl.Popup({ closeOnClick: false }).setHTML(popupContent);

    // create a HTML element for each feature
    var el = document.createElement("div");
    el.className = "marker " + markerId;
    el.id = markerId;

    var markerObj = new mapboxgl.Marker(el)
      .setLngLat([longitude, latitude])
      .setPopup(popup)
      .addTo(map);

    el.style.backgroundImage = "url(" + iconImage + ")";

    $(el).click(function () {
      var currentZoom = map.getZoom();
      map.flyTo({
        center: [longitude, latitude],
        zoom: 8,
        offset: [0, -150],
        duration: 1000,
      });
    });

    $(el).hover(function () {
      new mapboxgl.Popup()
        .setLngLat([longitude, latitude])
        .setHTML(popupContent)
        .addTo(map);
    });
    $(el).mouseout(function () {
      $(".mapboxgl-popup").remove();
    });
  });

  // close all opened popups
  $(".marker").click(function () {
    $(".mapboxgl-popup").remove();
  });

  $(".mapboxgl-canvas").click(function () {
    $(".mapboxgl-popup").remove();
  });

  map.fitBounds(bounds, { padding: 80 });
});
