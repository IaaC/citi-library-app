window.onload = function () {
  var colorScale = d3
    .scaleLinear()
    .domain([0, 50, 100])
    .range(["#c1dee2", "#2eb1bd", "#2a767e"]);

  // append a defs (for definition) element to your SVG
  var svgLegend = d3.select("#legend").append("svg");
  var defs = svgLegend.append("defs");

  // append a linearGradient element to the defs and give it a unique id
  var linearGradient = defs
    .append("linearGradient")
    .attr("id", "linear-gradient");

  // horizontal gradient
  linearGradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

  // append multiple color stops by using D3's data/enter step
  linearGradient
    .selectAll("stop")
    .data([
      { offset: "0%", color: "#c1dee2" },
      { offset: "50%", color: "#2eb1bd" },
      { offset: "100%", color: "#2a767e" },
    ])
    .enter()
    .append("stop")
    .attr("offset", function (d) {
      return d.offset;
    })
    .attr("stop-color", function (d) {
      return d.color;
    });

  // append title
  svgLegend
    .append("text")
    .attr("class", "legendTitle")
    .attr("x", 0)
    .attr("y", 20)
    .style("text-anchor", "left")
    .text("Buildings Age");

  // draw the rectangle and fill with gradient
  svgLegend
    .append("rect")
    .attr("x", 0)
    .attr("y", 30)
    .attr("width", 300)
    .attr("height", 15)
    .style("fill", "url(#linear-gradient)");

  //create tick marks
  var xLeg = d3.scaleLinear().domain([0, 100]).range([10, 290]);

  var axisLeg = d3.axisBottom(xLeg);

  svgLegend
    .attr("class", "axis")
    .append("g")
    .attr("transform", "translate(0, 40)")
    .call(axisLeg);
};
