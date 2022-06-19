//Mapbox Tiles
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGVzaGFtc2hhd3F5IiwiYSI6ImNrdnBvY2UwcTFkNDkzM3FmbTFhenM0M3MifQ.ZqIuL9khfbCyOF3DU_IH5w";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/heshamshawqy/cl444p0qq000514mx2f30mtom",
  center: [2.20, 41.40],
  zoom: 12,
  // bearing: -45,
});

map.on("load", () => {
// Disable default box zooming.
map.boxZoom.disable();
// disable map zoom when using scroll
map.scrollZoom.disable();
// disable map rotation using right click + drag
map.dragRotate.disable();
}); 


//01-INITIAL BUILDING MATERIAL RADAR CHART
//-------------------------------------------
map.on("load", () => {
  var options = {
    chart: {
      id: "Mchart",
      height: 350,
      type: "radar",
      foreColor: "#373d3f",
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
      colors: ["#56a356"],
      strokeColor: "#56a356",
      strokeWidth: 2,
    },
    fill: {
      opacity: 0.7,
    },
    xaxis: {
      categories: ["Concrete", "Brick", "Stone", "Glass", "Metal", "Wood"],
    },

    yaxis: {
      min: 0,
      max: 80,
      tickAmount: 4,
    },
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
});

//01-INITIAL MAP MATERIAL RADAR CHART
//-------------------------------------------
map.on("load", () => {
  var options = {
    chart: {
      id: "Mapchart",
      height: 400,
      type: 'bar',
      toolbar: {
        show: false,
      },
    },

    series: [
    {
      name: 'Percentage',
      data: [0,0,0,0,0,0],
    }
  ],

  plotOptions: {
    bar: {
      horizontal: true,
    }
  },
  colors: ['#56a356'],
  dataLabels: {
    style: {
      colors: ['#012030']
    },
    formatter: function(val, opt) {
      const goals =
        opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex]
          .goals
  
      if (goals && goals.length) {
        return `${val} / ${goals[0].value}`
      }
      return val
    }
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    customLegendItems: ['Material Percentage %'],
    markers: {
      fillColors: ['#56a356']
    }
  },
  xaxis: {
    min: 0,
    max: 40,
    labels: {
    },
    categories: ['Concrete','Brick','Stone','Glass','Metal','Wood'],
    tickPlacement: 'on'
  },
  yaxis: {
    labels: {
      rotate: 0,
      style: {
        colors: [],
        fontSize: '9px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 400,
        cssClass: 'apexcharts-xaxis-label',
    },
    },
  }
  };
  
  var chart = new ApexCharts(document.querySelector("#mapchart"), options);
  chart.render();
  
  });

  //01-INITIAL REGION MATERIAL RADAR CHART
//-------------------------------------------
map.on("load", () => {
  var options = {
    chart: {
      id: "Regionchart",
      height: 400,
      type: 'bar',
      toolbar: {
        show: false,
      },
    },

    series: [
    {
      name: 'Percentage',
      data: [0,0,0,0,0,0],
    }
  ],

  plotOptions: {
    bar: {
      horizontal: true,
    }
  },
  colors: ['#56a356'],
  dataLabels: {
    style: {
      colors: ['#012030']
    },
    formatter: function(val, opt) {
      const goals =
        opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex]
          .goals
  
      if (goals && goals.length) {
        return `${val} / ${goals[0].value}`
      }
      return val
    }
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    customLegendItems: ['Material Percentage %'],
    markers: {
      fillColors: ['#56a356']
    }
  },
  xaxis: {
    min: 0,
    max: 40,
    labels: {
    },
    categories: ['Concrete','Brick','Stone','Glass','Metal','Wood'],
    tickPlacement: 'on'
  },
  yaxis: {
    labels: {
      rotate: 0,
      style: {
        colors: [],
        fontSize: '9px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 400,
        cssClass: 'apexcharts-xaxis-label',
    },
    },
  }
  };
  
  var chart = new ApexCharts(document.querySelector("#Regionchart"), options);
  chart.render();
  
  });


//02-GEOJSON LAYERS - DIFFERENT SCENARIOS
//-------------------------------------------
map.on("load", () => {

  // place map labels on top of layers
  //----------------------------------------------------
  const layers = map.getStyle().layers;
  let firstSymbolId;
  for (const layer of layers) {
    if (layer.type === "symbol") {
      firstSymbolId = layer.id;
      break;
    }
  }

  // adding buildings layer
  //----------------------------------------------------
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
  map.addLayer(
      // how to fix duplicated buildings id
      //https://github.com/mapbox/mapbox-gl-js/issues/7038
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

  document.getElementById("defaultOpen").addEventListener("click", () => {
        //remove layers if they exist
        if (map.getLayer("2dBuildings-highlighted")) {
          map.removeLayer("2dBuildings-highlighted");
          }
      
          if (map.getSource("BCN")) {
          map.removeSource("BCN");
          }
      
        hoveredStateId = null;
        
        //fly to the original camera parameters
          map.getCanvas().style.cursor = "grab";
          map.flyTo({
            center: [2.20, 41.40],
            zoom: 12,
            pitch: 0,
            bearing: 0,
          });
  });
  // MAPPING SCENARIOS
  // 01-MAP
  //----------------------------------------------------
  document.getElementById("mapfilter").addEventListener("click", () => {
    //unique features https://stackoverflow.com/questions/57632629/how-to-get-unique-feature-properties-from-geojson-source-in-mapbox-gl-js
    //  query features from the geojson file

    //remove layers if they exist
    if (map.getLayer("2dBuildings-highlighted")) {
    map.removeLayer("2dBuildings-highlighted");
    }

    if (map.getSource("BCN")) {
    map.removeSource("BCN");
    }

  hoveredStateId = null;
  
  //fly to the original camera parameters
    map.getCanvas().style.cursor = "grab";
    map.flyTo({
      center: [2.20, 41.40],
      zoom: 12,
      pitch: 0,
      bearing: 0,
    });
  // disable map zoom when using scroll
  map.scrollZoom.enable();
  // disable map rotation using right click + drag
  map.dragRotate.disable();


  //unique features function to remove duplicated mapbox features
  function getUniqueFeatures(array, comparatorProperty) {
    var existingFeatureKeys = {};
    var uniqueFeatures = array.filter(function (el) {
      if (existingFeatureKeys[el.properties[comparatorProperty]]) {
        return false;
      } else {
        existingFeatureKeys[el.properties[comparatorProperty]] = true;
        return true;
      }
    });

    return uniqueFeatures;
  }
//using query source features to extract visible properties
  var Mfeatures = map.querySourceFeatures("combined", {
    sourceLayer: "b-id",
  });

  // console.log(Mfeatures);
  var uniqueFeatures = getUniqueFeatures(Mfeatures, "id");
  // console.log(uniqueFeatures);
  let i = 0;
  let Mconcrete = [];
  let Mbrick = [];
  let Mstone = [];
  let Mglass = [];
  let Mmetal = [];
  let Mwood = [];
  let Mid = [];
  let len = uniqueFeatures.length;
  for (; i < len; i++) {
    Mconcrete.push(uniqueFeatures[i].properties.concrete);
    Mbrick.push(uniqueFeatures[i].properties.bricks);
    Mstone.push(uniqueFeatures[i].properties.stone);
    Mglass.push(uniqueFeatures[i].properties.glass);
    Mmetal.push(uniqueFeatures[i].properties.metal);
    Mwood.push(uniqueFeatures[i].properties.wood);
    Mid.push(uniqueFeatures[i].properties.id);
  } 
  let count = (Mconcrete.filter( Boolean )).length;
  const Tconcrete = (Mconcrete.filter( Boolean )).reduce((a, b) => a + b, 0);
  const Tbrick = (Mbrick.filter( Boolean )).reduce((a, b) => a + b, 0);
  const Tstone = (Mstone.filter( Boolean )).reduce((a, b) => a + b, 0);
  const Tglass = (Mglass.filter( Boolean )).reduce((a, b) => a + b, 0);
  const Tmetal = (Mmetal.filter( Boolean )).reduce((a, b) => a + b, 0);
  const Twood = (Mwood.filter( Boolean )).reduce((a, b) => a + b, 0);

  const Pconcrete = Math.round(((Tconcrete/len)*100)*100)/100;
  const Pbrick = Math.round(((Tbrick/len)*100)*100)/100;
  const Pstone = Math.round(((Tstone/len)*100)*100)/100;
  const Pglass = Math.round(((Tglass/len)*100)*100)/100;
  const Pmetal = Math.round(((Tmetal/len)*100)*100)/100;
  const Pwood = Math.round(((Twood/len)*100)*100)/100;
  console.log(Pconcrete)
  console.log(Pbrick)
  console.log(Pstone)
  console.log(Pglass)
  console.log(Pmetal)
  console.log(Pwood)

  ApexCharts.exec("Mapchart", "updateSeries", [
    {
      data: [Pconcrete, Pbrick, Pstone, Pglass, Pmetal, Pwood],
    },
  ]);

  document.getElementById("Bcount").innerHTML = "Buildings Count =   "+69961;

});
  // 02-REGION
  //----------------------------------------------------
  document.getElementById("regionfilter").addEventListener("click", () => {
    hoveredStateId = null;
    map.boxZoom.disable ();

      //fly to the original camera parameters
      map.getCanvas().style.cursor = "grab";
      map.flyTo({
        center: [2.14, 41.40],
        zoom: 16,
        pitch: 0,
        bearing: 0,
      });
    // disable map zoom when using scroll
    map.scrollZoom.enable();
    // disable map rotation using right click + drag
    map.dragRotate.disable();


    // window.alert(
    //   "Hold Shift and drag the map to query features for multiple buildings"
    // );
    map.setPaintProperty("b-id", "fill-extrusion-color", [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      "#96d96a",
      "#525d70",
    ],
    
    );
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
    map.addSource("BCN", {
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

    map.addLayer(
      {
      id: "2dBuildings-highlighted",
      type: "fill",
      source: "BCN",
      paint: {
        "fill-color": "#96d96a",
        // 'fill-opacity': 0.75
      },
      filter: ["in", "id", ""],
    },
    firstSymbolId
    ); // Place polygon under these labels.

    // Set `true` to dispatch the event before other functions
    // call it. This is necessary for disabling the default map
    // dragging behaviour.
    canvas.addEventListener("mousedown", mouseDown, true);

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
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("keydown", onKeyDown);

      // Capture the first xy coordinates
      start = mousePos(e);
    }

    function onMouseMove(e) {
      // Capture the ongoing xy coordinates
      current = mousePos(e);

      // Append the box element if it doesnt exist
      if (!box) {
        box = document.createElement("div");
        box.classList.add("boxdraw");
        canvas.appendChild(box);
      }

      const minX = Math.min(start.x, current.x),
        maxX = Math.max(start.x, current.x),
        minY = Math.min(start.y, current.y),
        maxY = Math.max(start.y, current.y);

      // Adjust width and xy position of the box element ongoing
      const pos = `translate(${minX}px, ${minY}px)`;
      box.style.transform = pos;
      box.style.width = maxX - minX + "px";
      box.style.height = maxY - minY + "px";
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
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mouseup", onMouseUp);

      if (box) {
        box.parentNode.removeChild(box);
        box = null;
      }

      // If bbox exists. use this value as the argument for `queryRenderedFeatures`
      if (bbox) {
        const features = map.queryRenderedFeatures(bbox, {
          layers: ["b-id"],
        });

        if (features.length >= 5000) {
          return window.alert("Select a smaller number of features");
        }

        // Run through the selected features and set a filter
        // to match features with unique FIPS codes to activate
        // the `counties-highlighted` layer.
        const fips = features.map((feature) => feature.properties.id);
        console.log(fips);
        map.setFilter("2dBuildings-highlighted", ["in", "id", ...fips]);

        //unique features function to remove duplicated mapbox features

        // console.log(Mfeatures);
        // console.log(uniqueFeatures);

        const Mconcrete = features.map((feature) => feature.properties.concrete);
        const Mbrick = features.map((feature) => feature.properties.bricks);
        const Mstone = features.map((feature) => feature.properties.stone);
        const Mglass = features.map((feature) => feature.properties.glass);
        const Mmetal = features.map((feature) => feature.properties.metal);
        const Mwood = features.map((feature) => feature.properties.wood);

        console.log(Mconcrete)
        let Rcount = fips.length;
        const Tconcrete = (Mconcrete.filter( Boolean )).reduce((a, b) => a + b, 0);
        const Tbrick = (Mbrick.filter( Boolean )).reduce((a, b) => a + b, 0);
        const Tstone = (Mstone.filter( Boolean )).reduce((a, b) => a + b, 0);
        const Tglass = (Mglass.filter( Boolean )).reduce((a, b) => a + b, 0);
        const Tmetal = (Mmetal.filter( Boolean )).reduce((a, b) => a + b, 0);
        const Twood = (Mwood.filter( Boolean )).reduce((a, b) => a + b, 0);

        const Pconcrete = Math.round(((Tconcrete/Rcount)*100)*100)/100;
        const Pbrick = Math.round(((Tbrick/Rcount)*100)*100)/100;
        const Pstone = Math.round(((Tstone/Rcount)*100)*100)/100;
        const Pglass = Math.round(((Tglass/Rcount)*100)*100)/100;
        const Pmetal = Math.round(((Tmetal/Rcount)*100)*100)/100;  
        const Pwood = Math.round(((Twood/Rcount)*100)*100)/100;
        console.log(Pconcrete)
        console.log(Pbrick)
        console.log(Pstone)
        console.log(Pglass)
        console.log(Pmetal)
        console.log(Pwood)

        ApexCharts.exec("Regionchart", "updateSeries", [
          {
            data: [Pconcrete, Pbrick, Pstone, Pglass, Pmetal, Pwood],
          },
        ]);
      
        document.getElementById("BRcount").innerHTML = "Buildings Count =   "+Rcount;
      }


      map.dragPan.enable();
    }

    // map.on("mousemove", (e) => {
    //   const features = map.queryRenderedFeatures(e.point, {
    //     layers: ["2dBuildings-highlighted"],
    //   });

    //   // Change the cursor style as a UI indicator.
    //   map.getCanvas().style.cursor = features.length ? "pointer" : "";
    // });
  });
  // 03-BUILDING
  //----------------------------------------------------
  document.getElementById("buildingfilter").addEventListener("click", () => {
    map.flyTo({
      center: [2.14, 41.40],
      zoom: 17,
      pitch: 50,
      bearing: 0,
    });
    map.boxZoom.disable();
    // disable map zoom when using scroll
    map.scrollZoom.enable();
    // disable map rotation using right click + drag
    map.dragRotate.enable();

  let hoveredFeatureId = null;
  map.setPaintProperty("b-id", "fill-extrusion-color", [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    "#96d96a",
    "#525d70",
  ],
  
  );
  if (map.getLayer("2dBuildings-highlighted")) {
    map.removeLayer("2dBuildings-highlighted");
}

  if (map.getSource("BCN")) {
    map.removeSource("BCN");
}

  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse  .
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
    document.getElementById("type").innerHTML =
      "<p class='info-box'><b>Building Typology</b></p>" +
      e.features[0].properties.currentUse;
    document.getElementById("age").innerHTML =
      "<p class='info-box'><b>Building Age</b></p>" +
      e.features[0].properties.bld_age;
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

    ApexCharts.exec("Mchart", "updateSeries", [
      {
        data: [m_concrete, m_brick, m_stone, m_glass, m_metal, m_wood],

      },
    ]);
  });

  hoveredStateId = null;
});

});


//03-MATERIAL LAYERS
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

//04-Mapbox Controls
//-------------------------------------------
// const nav = new mapboxgl.NavigationControl({
//   visualizePitch: true,
//   showZoom: true,
//   showCompass: true,
// });
// map.addControl(nav, "top-left");
