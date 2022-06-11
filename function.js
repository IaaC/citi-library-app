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

// Add buildings polygon tileset from mapbox
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
      layout: {},
      paint: {
        "fill-extrusion-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#96d96a",
          "#525d70",
        ],
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-opacity": 0.7,
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
  // Adding pop-ups
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true,
  });
  popup.addClassName("region-popup");

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
    document.getElementById("type").innerHTML =
      e.features[0].properties.currentUse;
    document.getElementById("age").innerHTML = e.features[0].properties.bld_age;
    document.getElementById("simg").innerHTML =
      "<img src=" +
      e.features[0].properties.documentLi +
      " class='pop-img'></img>";
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

    var options = {
      series: [m_concrete, m_brick, m_stone, m_glass, m_metal, m_wood],
      chart: {
        height: 350,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: true,
              label: "Total",
              formatter: function (w) {
                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                return 249;
              },
            },
          },
        },
      },
      labels: ["Concrete", "Brick", "Stone", "Glass", "Metal", "Wood"],
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  });

  hoveredStateId = null;
});
//
//
//
//

// Layers Visibility
//-------------------------------------------
document.getElementById("l-age").addEventListener("change", () => {
  const clickedLayer = "bcn-age";
  const visibility = map.getLayoutProperty(clickedLayer, "visibility");

  if (visibility === "visible") {
    map.setLayoutProperty(clickedLayer, "visibility", "none");
  } else {
    map.setLayoutProperty(clickedLayer, "visibility", "visible");
  }
});

map.on("load", () => {
  map.setLayoutProperty("bcn-stone", "visibility", "none");
  map.setLayoutProperty("bcn-wood", "visibility", "none");
  map.setLayoutProperty("bcn-metal", "visibility", "none");
  map.setLayoutProperty("bcn-brick", "visibility", "none");
  map.setLayoutProperty("bcn-concrete", "visibility", "none");
  map.setLayoutProperty("bcn-glass", "visibility", "none");
  map.setLayoutProperty("bcn-age", "visibility", "none");
});

map.on("load", () => {
  document.getElementById("l-age").addEventListener("change", () => {
    const clickedLayer = "bcn-age";
    const visibility = map.getLayoutProperty(clickedLayer, "visibility");

    if (visibility === "visible") {
      map.setLayoutProperty(clickedLayer, "visibility", "none");
    } else {
      map.setLayoutProperty(clickedLayer, "visibility", "visible");
    }
  });

  document.getElementById("l-age").addEventListener("change", () => {
    const clickedLayer = "bcn-age";
    const visibility = map.getLayoutProperty(clickedLayer, "visibility");

    if (visibility === "visible") {
      map.setLayoutProperty(clickedLayer, "visibility", "none");
    } else {
      map.setLayoutProperty(clickedLayer, "visibility", "visible");
    }
  });

  document.getElementById("l-glass").addEventListener("change", () => {
    const clickedLayer = "bcn-glass";
    map.setLayoutProperty(clickedLayer, "visibility", "visible");
    map.setLayoutProperty("bcn-stone", "visibility", "none");
    map.setLayoutProperty("bcn-wood", "visibility", "none");
    map.setLayoutProperty("bcn-metal", "visibility", "none");
    map.setLayoutProperty("bcn-brick", "visibility", "none");
    map.setLayoutProperty("bcn-concrete", "visibility", "none");
  });

  document.getElementById("l-stone").addEventListener("change", () => {
    const clickedLayer = "bcn-stone";
    map.setLayoutProperty(clickedLayer, "visibility", "visible");
    map.setLayoutProperty("bcn-wood", "visibility", "none");
    map.setLayoutProperty("bcn-metal", "visibility", "none");
    map.setLayoutProperty("bcn-brick", "visibility", "none");
    map.setLayoutProperty("bcn-concrete", "visibility", "none");
    map.setLayoutProperty("bcn-glass", "visibility", "none");
  });

  document.getElementById("l-wood").addEventListener("change", () => {
    const clickedLayer = "bcn-wood";
    map.setLayoutProperty(clickedLayer, "visibility", "visible");
    map.setLayoutProperty("bcn-stone", "visibility", "none");
    map.setLayoutProperty("bcn-metal", "visibility", "none");
    map.setLayoutProperty("bcn-brick", "visibility", "none");
    map.setLayoutProperty("bcn-concrete", "visibility", "none");
    map.setLayoutProperty("bcn-glass", "visibility", "none");
  });

  document.getElementById("l-metal").addEventListener("change", () => {
    const clickedLayer = "bcn-metal";
    map.setLayoutProperty(clickedLayer, "visibility", "visible");
    map.setLayoutProperty("bcn-stone", "visibility", "none");
    map.setLayoutProperty("bcn-wood", "visibility", "none");
    map.setLayoutProperty("bcn-brick", "visibility", "none");
    map.setLayoutProperty("bcn-concrete", "visibility", "none");
    map.setLayoutProperty("bcn-glass", "visibility", "none");
  });

  document.getElementById("l-brick").addEventListener("change", () => {
    const clickedLayer = "bcn-brick";
    map.setLayoutProperty(clickedLayer, "visibility", "visible");
    map.setLayoutProperty("bcn-stone", "visibility", "none");
    map.setLayoutProperty("bcn-wood", "visibility", "none");
    map.setLayoutProperty("bcn-metal", "visibility", "none");
    map.setLayoutProperty("bcn-concrete", "visibility", "none");
    map.setLayoutProperty("bcn-glass", "visibility", "none");
  });

  document.getElementById("l-concrete").addEventListener("change", () => {
    const clickedLayer = "bcn-concrete";
    map.setLayoutProperty(clickedLayer, "visibility", "visible");
    map.setLayoutProperty("bcn-stone", "visibility", "none");
    map.setLayoutProperty("bcn-wood", "visibility", "none");
    map.setLayoutProperty("bcn-metal", "visibility", "none");
    map.setLayoutProperty("bcn-brick", "visibility", "none");
    map.setLayoutProperty("bcn-glass", "visibility", "none");
  });

  document.getElementById("l-none").addEventListener("change", () => {
    map.setLayoutProperty("bcn-stone", "visibility", "none");
    map.setLayoutProperty("bcn-wood", "visibility", "none");
    map.setLayoutProperty("bcn-metal", "visibility", "none");
    map.setLayoutProperty("bcn-brick", "visibility", "none");
    map.setLayoutProperty("bcn-concrete", "visibility", "none");
    map.setLayoutProperty("bcn-glass", "visibility", "none");
  });
});
// Add Geojson file
/*
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

  map.addSource("buildings", {
    type: "geojson",
    // Use a URL for the value for the `data` property.
    data: "library/geodata/BCN_B_M_2.geojson",
  });

  map.addLayer(
    {
      id: "buildings-layer",
      type: "fill",
      source: "buildings",
      layout: {},
      paint: {
        "fill-color": "#adadad",
      },
    },
    firstSymbolId
  );
});
*/

// Mapbox Controls
//-------------------------------------------

const nav = new mapboxgl.NavigationControl({
  visualizePitch: true,
  showZoom: true,
  showCompass: true,
});
map.addControl(nav, "top-right");
