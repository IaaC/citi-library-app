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
map.on("load", () => {
  map.setLayoutProperty("bcn-buildings", "visibility", "none");
  map.setLayoutProperty("bcn-stone", "visibility", "none");
  map.setLayoutProperty("bcn-wood", "visibility", "none");
  map.setLayoutProperty("bcn-metal", "visibility", "none");
  map.setLayoutProperty("bcn-brick", "visibility", "none");
  map.setLayoutProperty("bcn-concrete", "visibility", "none");
  map.setLayoutProperty("bcn-glass", "visibility", "none");
  map.setLayoutProperty("bcn-age", "visibility", "none");
});

//initiating a fake chart on mapload
//-------------------------------------------
map.on("load", () => {
  var options = {
    chart: {
      id: "Mchart",
      height: 290,
      type: "radar",
  
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
          strokeColors: "#9aeba3",
          fill: {
            colors: ["#f8f8f8", "#fff"],
          },
        },
      },
    },
    colors: ["#13678a"],
    markers: {
      size: 3,
      colors: ["#13678a"],
      strokeColor: "#012030",
      strokeWidth: 2,
    },
    fill: {
      opacity: 0.7,
    },
    xaxis: {
      categories: ["Concrete", "Brick", "Stone", "Glass", "Metal", "Wood"],
    },
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
  map.addSource("combined", {
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
    "#8fc6ce",
    1970,
    "#238f99",
    2015,
    "#186a71",
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


// Mapbox Controls
//-------------------------------------------

const nav = new mapboxgl.NavigationControl({
  visualizePitch: true,
  showZoom: true,
  showCompass: true,
});
map.addControl(nav, "top-right");
