//Mapbox Tiles
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGVzaGFtc2hhd3F5IiwiYSI6ImNrdnBvY2UwcTFkNDkzM3FmbTFhenM0M3MifQ.ZqIuL9khfbCyOF3DU_IH5w";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/heshamshawqy/cl444p0qq000514mx2f30mtom",
  center: [2.16, 41.39],
  zoom: 12.5,
  bearing: -45,
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
  // map.setLayoutProperty("centroids-layer", "visibility", "none");
});

// add tileset from mapbox
//https://docs.mapbox.com/mapbox-gl-js/example/vector-source/

map.on("load", () => {
  map.addSource("combined", {
    type: "geojson",
    // Use any Mapbox-hosted tileset using its tileset id.
    // Learn more about where to find a tileset id:
    // https://docs.mapbox.com/help/glossary/tileset-id/
    // https://github.com/mapnik/node-mapnik/issues/707#issuecomment-408474671
    data: "library/geodata/BCN_B_M.geojson",
    generateId: true,
    // url: "mapbox://heshamshawqy.a8akk9ft",
  });
  // how to fix duplicated buildings id
  //https://github.com/mapbox/mapbox-gl-js/issues/7038
  map.addLayer({
    id: "b-id",
    type: "fill-extrusion",
    source: "combined",
    // "source-layer": "combined",
    layout: {},
    paint: {
      "fill-extrusion-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "#ff0000",
        "#ddd",
      ],
      "fill-extrusion-height": ["get", "height"],
      "fill-extrusion-opacity": 0.8,
    },
  });

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
});
//
//
//
//
let hoveredStateId = null;

// Image nodes
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

  map.addSource("centroids", {
    type: "geojson",
    data: "library/geodata/BCN_C_M.geojson",
  });

  // The feature-state dependent fill-opacity expression will render the hover effect
  // when a feature's hover state is set to true.
  map.addLayer(
    {
      id: "centroids-layer",
      type: "circle",
      source: "centroids",
      layout: {},
      paint: {
        "circle-radius": {
          base: 1,
          stops: [
            [12, 1],
            [22, 7],
          ],
        },
        "circle-stroke-width": 0.5,
        "circle-color": "#678e4d",
        "circle-stroke-color": "white",
      },
    },
    firstSymbolId
  );

  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  map.on("mouseclick", "centroids-layer", (e) => {
    if (e.features.length > 0) {
      if (hoveredStateId !== null) {
        map.setFeatureState(
          { source: "centroids", id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = e.features[0].id;
      map.setFeatureState(
        { source: "centroids", id: hoveredStateId },
        { hover: false }
      );
    }
  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.on("mouseout", "centroids-layer", () => {
    if (hoveredStateId !== null) {
      map.setFeatureState(
        { source: "centroids", id: hoveredStateId },
        { hover: false }
      );
    }

    // Adding pop-ups
    var popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: true,
    });
    popup.addClassName("region-popup");

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on("mouseenter", "centroids-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "centroids-layer", () => {
      map.getCanvas().style.cursor = "";
    });

    // show feature on click
    map.on("click", "centroids-layer", (e) => {
      popup
        .setLngLat(e.lngLat)
        .setHTML(
          "<p>" +
            " TYPOLOGY: " +
            e.features[0].properties.currentUse +
            "</p>" +
            "<p>" +
            " AGE:" +
            e.features[0].properties.bld_age +
            "</p>" +
            "<img src=" +
            e.features[0].properties.documentLi +
            " class='pop-img'></img>" +
            "<p class='mat_p'>" +
            " CONCRETE: " +
            Math.round(e.features[0].properties.concrete * 100) +
            "%   |  " +
            " BRICKS: " +
            Math.round(e.features[0].properties.bricks * 100) +
            "%   |  " +
            " STONE: " +
            Math.round(e.features[0].properties.stone * 100) +
            "%   |  " +
            " GLASS: " +
            Math.round(e.features[0].properties.glass * 100) +
            "%   |  " +
            " METAL: " +
            Math.round(e.features[0].properties.metal * 100) +
            "%   |  " +
            " WOOD: " +
            Math.round(e.features[0].properties.wood * 100) +
            "%   |  " +
            "</p>"
        )
        .addTo(map);
    });

    map.on("mouseclick", "centroids-layer", () => {
      /*       map.getCanvas().style.cursor = ""; */
      popup.remove();
    });

    hoveredStateId = null;
  });
});

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
  map.setLayoutProperty("centroids-layer", "visibility", "visible");
});

map.on("load", () => {
  document.getElementById("l-views").addEventListener("change", () => {
    const clickedLayer = "centroids-layer";
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
    data: "library/geodata/BCN_B_M.geojson",
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
