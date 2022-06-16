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

// Disable default box zooming.
map.boxZoom.disable();


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

// Change to region selection based on click
  document.getElementById("regionfilter").addEventListener("click", () => {

    window.alert('Hold Shift and drag the map to query features for multiple buildings')
    map.setPaintProperty("b-id", "fill-extrusion-color","#525d70");
    // map.setLayoutProperty("b-id", "visibility", "none");
    const canvas = map.getCanvasContainer();
     
    // Variable to hold the starting xy coordinates
    // when `mousedown` occured.
    let start;
     
    // Variable to hold the current xy coordinates
    // when `mousemove` or `mouseup` occurs.
    let current;
     
    // Variable for the draw box element.
    let box;
     
    map.addSource("BCNbuildings", {
      type: "geojson",
      data: "library/geodata/BCN_B_M_2.geojson",
      generateId: true,
    });
     
     
    map.addLayer(
    {
    'id': '2dBuildings-highlighted',
    'type': 'fill',
    'source': 'combined',
    'paint': {
    'fill-color': '#96d96a',
    // 'fill-opacity': 0.75
    },
    'filter': ['in', 'id', '']
    },
    ); // Place polygon under these labels.
     
    // Set `true` to dispatch the event before other functions
    // call it. This is necessary for disabling the default map
    // dragging behaviour.
    canvas.addEventListener('mousedown', mouseDown, true);
     
    // Return the xy coordinates of the mouse position
    function mousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return new mapboxgl.Point(
    e.clientX - rect.left - canvas.clientLeft,
    e.clientY - rect.top - canvas.clientTop
    );
    }
     
    function mouseDown(e) {
    // Continue the rest of the function if the shiftkey is pressed.
    if (!(e.shiftKey && e.button === 0)) return;
     
    // Disable default drag zooming when the shift key is held down.
    map.dragPan.disable();
     
    // Call functions for the following events
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keydown', onKeyDown);
     
    // Capture the first xy coordinates
    start = mousePos(e);
    }
     
    function onMouseMove(e) {
    // Capture the ongoing xy coordinates
    current = mousePos(e);
     
    // Append the box element if it doesnt exist
    if (!box) {
    box = document.createElement('div');
    box.classList.add('boxdraw');
    canvas.appendChild(box);
    }
     
    const minX = Math.min(start.x, current.x),
    maxX = Math.max(start.x, current.x),
    minY = Math.min(start.y, current.y),
    maxY = Math.max(start.y, current.y);
     
    // Adjust width and xy position of the box element ongoing
    const pos = `translate(${minX}px, ${minY}px)`;
    box.style.transform = pos;
    box.style.width = maxX - minX + 'px';
    box.style.height = maxY - minY + 'px';
    }
     
    function onMouseUp(e) {
    // Capture xy coordinates
    finish([start, mousePos(e)]);
    }
     
    function onKeyDown(e) {
    // If the ESC key is pressed
    if (e.keyCode === 27) finish();
    }
     
    function finish(bbox) {
    // Remove these events now that finish has been called.
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('mouseup', onMouseUp);
     
    if (box) {
    box.parentNode.removeChild(box);
    box = null;
    }
     
    // If bbox exists. use this value as the argument for `queryRenderedFeatures`
    if (bbox) {
    const features = map.queryRenderedFeatures(bbox, {
    layers: ['b-id']
    });
     
    if (features.length >= 5000) {
    return window.alert('Select a smaller number of features');
    }
     
    // Run through the selected features and set a filter
    // to match features with unique FIPS codes to activate
    // the `counties-highlighted` layer.
    const fips = features.map((feature) => feature.properties.id);
    console.log(fips) 
    map.setFilter('2dBuildings-highlighted', ['in', 'id', ...fips]);
    }
    
    map.dragPan.enable();
    }
     
    map.on('mousemove', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
    layers: ['2dBuildings-highlighted']
    });
    
    
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = features.length ? 'pointer' : '';
     
  
    });
    });
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








// Mapbox Controls
//-------------------------------------------

const nav = new mapboxgl.NavigationControl({
  visualizePitch: true,
  showZoom: true,
  showCompass: true,
});
map.addControl(nav, "top-left");
