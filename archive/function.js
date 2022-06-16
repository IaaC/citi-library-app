//Mapbox Tiles
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGVzaGFtc2hhd3F5IiwiYSI6ImNrdnBvY2UwcTFkNDkzM3FmbTFhenM0M3MifQ.ZqIuL9khfbCyOF3DU_IH5w";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/heshamshawqy/cl444p0qq000514mx2f30mtom",
  center: [2.19, 41.39],
  zoom: 12,
  // bearing: -45,
});

// Hide embedded layers from a style
//-------------------------------------------
// map.on("load", () => {
//   map.setLayoutProperty("bcn-buildings", "visibility", "none");
//   map.setLayoutProperty("bcn-stone", "visibility", "none");
//   map.setLayoutProperty("bcn-wood", "visibility", "none");
//   map.setLayoutProperty("bcn-metal", "visibility", "none");
//   map.setLayoutProperty("bcn-brick", "visibility", "none");
//   map.setLayoutProperty("bcn-concrete", "visibility", "none");
//   map.setLayoutProperty("bcn-glass", "visibility", "none");
//   map.setLayoutProperty("bcn-age", "visibility", "none");
// });

//initiating a fake chart on mapload
//-------------------------------------------
map.on("load", () => {
  var options = {
    chart: {
      id: "Mchart",
      height: 290,
      type: "radar",
      foreColor: '#373d3f',
      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: "Percentage %",
        data: [0, 0, 0, 0, 0, 0],
      },
    ],
    plotOptions: {
      radar: {
        size: 90,
        polygons: {
          strokeColors: "#45c4b0",
          strokeWidth: 2,
        },
      },
    },
    
    colors: ["#13678a"],
    markers: {
      size: 3,
      colors: ["#9aeba3"],
      strokeColor: "#9aeba3",
      strokeWidth: 2,
    },
    fill: {
      opacity: 0.7,
    },
    xaxis: {
      categories: ["Concrete", "Brick", "Stone", "Glass", "Metal", "Wood"],

    },

    yaxis:{
      min: 0,
      max: 80,
      tickAmount: 4,

    }
  };
  
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
  
  });

  
// Add buildings shapes from geojson file
// show buildings information onclick
//-------------------------------------------
map.on("load", () => {
  // Find the index of the first symbol layer in the map style.
  const layers = map.getStyle().layers;
  // Find the index of the first symbol layer in the map style.
  let firstSymbolId;
  for (const layer of layers) {
    if (layer.type === "symbol") {
      firstSymbolId = layer.id;
      break;
    }
  }
  map.addSource("BCNbuildings", {
    type: "geojson",
    // Use any Mapbox-hosted tileset using its tileset id.
    // Learn more about where to find a tileset id:
    // https://docs.mapbox.com/help/glossary/tileset-id/
    // https://github.com/mapnik/node-mapnik/issues/707#issuecomment-408474671
    data: "library/geodata/BCN_B_M_2.geojson",
    generateId: true,
    // mode: "no-cors",
    // url: "mapbox://heshamshawqy.a8akk9ft",
  });
  // how to fix duplicated buildings id
  //https://github.com/mapbox/mapbox-gl-js/issues/7038
  map.addLayer(
    {
      id: "b-id",
      type: "fill-extrusion",
      source: "combined",
      // "source-layer": "combined",
      // color based on a feature https://stackoverflow.com/questions/63713703/mapbox-gl-js-coloring-individual-features-in-large-geojson

      layout: {},
      paint: {
        "fill-extrusion-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#96d96a",
          "#525d70",
        ],
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-opacity": 0.85,
      },
      
    },
    firstSymbolId
  );

  let hoveredFeatureId = null;

  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  map.on("mousemove", "b-id", (e) => {
    if (e.features.length > 0) {
      if (hoveredFeatureId !== null) {
        map.setFeatureState(
          {
            source: "combined",
            // sourceLayer: "combined",
            id: hoveredFeatureId,
          },
          { hover: false }
        );
      }
      hoveredFeatureId = e.features[0].id;
      map.setFeatureState(
        {
          source: "combined",
          // sourceLayer: "combined",
          id: hoveredFeatureId,
        },
        { hover: true }
      );
    }
  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.on("mouseleave", "b-id", () => {
    if (hoveredFeatureId !== null) {
      map.setFeatureState(
        {
          source: "combined",
          // sourceLayer: "combined",
          id: hoveredFeatureId,
        },
        { hover: false }
      );
    }
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on("mouseenter", "b-id", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  map.on("mouseleave", "b-id", () => {
    map.getCanvas().style.cursor = "";
  });

  // show feature on click
  map.on("click", "b-id", (e) => {



    document.getElementById("type").innerHTML = "<p class='info-box'><b>Building Typology</b></p>"+
      e.features[0].properties.currentUse;
    document.getElementById("age").innerHTML = "<p class='info-box'><b>Building Age</b></p>"+ e.features[0].properties.bld_age;
    document.getElementById("simg").innerHTML =
      "<img src=" + 
      e.features[0].properties.documentLi + 
      " class='f-img' ></img>";
    var m_concrete = Math.round(e.features[0].properties.concrete * 100);
    //-----
    var m_brick = Math.round(e.features[0].properties.bricks * 100);
    //-----
    var m_stone = Math.round(e.features[0].properties.stone * 100);
    //-----
    var m_glass = Math.round(e.features[0].properties.glass * 100);
    //-----
    var m_metal = Math.round(e.features[0].properties.metal * 100);
    //-----
    var m_wood = Math.round(e.features[0].properties.wood * 100);
    //-----

      ApexCharts.exec('Mchart', "updateSeries", [
        {
          data: [m_concrete, m_brick, m_stone, m_glass, m_metal, m_wood],
        }
      ]);
  });

  hoveredStateId = null;
});


// Change the color of the buildings layer
//https://docs.mapbox.com/mapbox-gl-js/example/color-switcher/
//-------------------------------------------

map.on("load", () => {
document.getElementById("l-none").addEventListener("click", () => {
  map.setPaintProperty("b-id", "fill-extrusion-color", [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    "#96d96a",
    "#525d70",
  ]);
});

document.getElementById("l-age").addEventListener("click", () => {
  map.setPaintProperty("b-id", "fill-extrusion-color", [
    "interpolate-hcl",
    ["linear"],
    ["get", "bld_age"],
    1900,
    "#044348",
    1930,
    "#8dc0c5",
    2015,
    "#e1f7fa",
  ]);
});

document.getElementById("l-concrete").addEventListener("click", () => {
  map.setPaintProperty("b-id", "fill-extrusion-color", [
    "interpolate-hcl",
    ["linear"],
    ["get", "concrete"],
    0.05,
    "#91c8f9",
    0.75,
    "#0c3c68",
  ]);
});

document.getElementById("l-brick").addEventListener("click", () => {
  map.setPaintProperty("b-id", "fill-extrusion-color", [
    "interpolate-hcl",
    ["linear"],
    ["get", "bricks"],
    0.05,
    "#d67de3",
    0.75,
    "#3a0342",
  ]);
});

document.getElementById("l-stone").addEventListener("click", () => {
  map.setPaintProperty("b-id", "fill-extrusion-color", [
    "interpolate-hcl",
    ["linear"],
    ["get", "stone"],
    0.05,
    "#cdacac",
    0.3,
    "#3e1b1b",
  ]);
});

document.getElementById("l-glass").addEventListener("click", () => {
  map.setPaintProperty("b-id", "fill-extrusion-color", [
    "interpolate-hcl",
    ["linear"],
    ["get", "glass"],
    0.05,
    "#ebb992",
    0.4,
    "#6d2100",
  ]);
});

document.getElementById("l-metal").addEventListener("click", () => {
  map.setPaintProperty("b-id", "fill-extrusion-color", [
    "interpolate-hcl",
    ["linear"],
    ["get", "metal"],
    0.01,
    "#cadfa9",
    0.15,
    "#3d4600",
  ]);
});

document.getElementById("l-wood").addEventListener("click", () => {
  map.setPaintProperty("b-id", "fill-extrusion-color", [
    "interpolate-hcl",
    ["linear"],
    ["get", "wood"],
    0.03,
    "#ffeb43",
    0.25,
    "#a15f00",
  ]);
});
});


// Create a draggable point
//https://docs.mapbox.com/mapbox-gl-js/example/drag-a-point/
//-------------------------------------------

const canvas = map.getCanvasContainer();
//function to create a circle based on real distance (km)
var createGeoJSONCircle = function(center, radiusInKm, points) {
  if(!points) points = 64;

  var coords = {
      latitude: center[1],
      longitude: center[0]
  };

  var km = radiusInKm;

  var ret = [];
  var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
  var distanceY = km/110.574;

  var theta, x, y;
  for(var i=0; i<points; i++) {
      theta = (i/points)*(2*Math.PI);
      x = distanceX*Math.cos(theta);
      y = distanceY*Math.sin(theta);

      ret.push([coords.longitude+x, coords.latitude+y]);
  }
  ret.push(ret[0]);

  return {
      "type": "geojson",
      "data": {
          "type": "FeatureCollection",
          "features": [{
              "type": "Feature",
              "geometry": {
                  "type": "Polygon",
                  "coordinates": [ret]
              }
          }]
      }
  };
};

//defining the initial query point
const queryPoint = {
'type': 'FeatureCollection',
'features': [
{
'type': 'Feature',
'geometry': {
'type': 'Point',
'coordinates': [2.19, 41.39]
}
}
]
};

function onMove(e) {
const coords = e.lngLat;
 
// Set a UI indicator for dragging.
canvas.style.cursor = 'grabbing';
 
// Update the Point feature in `geojson` coordinates
// and call setData to the source layer `point` on it.
queryPoint.features[0].geometry.coordinates = [coords.lng, coords.lat];
map.getSource('point').setData(queryPoint);

//update the circle feature
map.getSource('polygon').setData(createGeoJSONCircle((queryPoint.features[0].geometry.coordinates), 0.5).data);
}

function onUp(e) {
const coords = e.lngLat;
// Unbind mouse/touch events
map.off('mousemove', onMove);
map.off('touchmove', onMove);
}
 
map.on('load', () => {
// Add a single point to the map.
map.addSource('point', {
'type': 'geojson',
'data': queryPoint
});
 

//adding point/circle geojson layers
map.addLayer({
'id': 'point',
'type': 'circle',
'source': 'point',
'paint': {
'circle-radius': 10,
'circle-color': '#F84C4C' // red color
}
});

console.log(queryPoint)
map.addSource("polygon", createGeoJSONCircle((queryPoint.features[0].geometry.coordinates), 0.5));

map.addLayer({
    "id": "polygon",
    "type": "fill",
    "source": "polygon",
    "layout": {},
    "paint": {
        "fill-color": "blue",
        "fill-opacity": 0.6
    }
});

 
// When the cursor enters a feature in
// the point layer, prepare for dragging.
map.on('mouseenter', 'point', () => {
map.setPaintProperty('point', 'circle-color', '#3bb2d0');
canvas.style.cursor = 'move';
});
 
map.on('mouseleave', 'point', () => {
map.setPaintProperty('point', 'circle-color', '#3887be');
canvas.style.cursor = '';
});
 
map.on('mousedown', 'point', (e) => {
// Prevent the default map drag behavior.
e.preventDefault();
 
canvas.style.cursor = 'grab';
 
map.on('mousemove', onMove);
map.once('mouseup', onUp);
});
 
map.on('touchstart', 'point', (e) => {
if (e.points.length !== 1) return;
 
// Prevent the default map drag behavior.
e.preventDefault();
 
map.on('touchmove', onMove);
map.once('touchend', onUp);
});

//How to create a bbox based on a polygon
//https://bl.ocks.org/danswick/83a8ddff7fb9193176a975a02a896792
//Select multiple features
map.on('mouseup', 'point', () => {
  e= queryPoint.features[0].geometry.coordinates
  const bbox = [
  [e[0] - 50, e[1] - 50],
  [e[0] + 50, e[1] + 50]
  ];
  // Find features intersecting the bounding box.
  const selectedFeatures = map.queryRenderedFeatures(bbox, {
  layers: ['b-id']
  });
  const fips = selectedFeatures.map(
  (feature) => feature.properties.id
  );

  console.log(fips)
  // Set a filter matching selected features by FIPS codes
  // to activate the 'counties-highlighted' layer.

});

});







// Mapbox Controls
//-------------------------------------------

const nav = new mapboxgl.NavigationControl({
  visualizePitch: true,
  showZoom: true,
  showCompass: true,
});
map.addControl(nav, "top-left");
