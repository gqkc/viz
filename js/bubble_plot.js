var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/countries.csv").get( (error, rows) => {
  console.log("Loaded " + rows.length + " rows");
  if (rows.length > 0) {
    console.log("First row: ", rows[0])
    console.log("Last row ", rows[rows.length-1])
  }

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 40])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 400000])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain([1, 5300000])
    .range([ 1, 40]);

  var colorScale = d3.scaleSequential(d3.interpolatePlasma)
      .domain([1500000, 1000000000000])

  var tooltip = d3.select("#my_dataviz")
   .append("div")
     .style("opacity", 0)
     .attr("class", "tooltip")
     .style("background-color", "black")
     .style("border-radius", "5px")
     .style("padding", "10px")
     .style("color", "white")

 // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
 var showTooltip = function(d) {
   tooltip
     .transition()
     .duration(200)
   tooltip
     .style("opacity", 1)
     .html("Country: " + d.country)
     .style("left", (d3.mouse(this)[0]+30) + "px")
     .style("top", (d3.mouse(this)[1]+30) + "px")
     }
 var moveTooltip = function(d) {
   tooltip
     .style("left", (d3.mouse(this)[0]+30) + "px")
     .style("top", (d3.mouse(this)[1]+30) + "px")
 }
 var hideTooltip = function(d) {
   tooltip
     .transition()
     .duration(200)
     .style("opacity", 0)
   }
  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(rows)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d['HIV/AIDS - adult prevalence rate(%)']); } )
      .attr("cy", function (d) { return y(d['HIV/AIDS - deaths']); } )
      .attr("r", function (d) { return z(d['HIV/AIDS - people living with HIV/AIDS']); } )
      .style("fill", function (d) { return colorScale(d.GDP); } )
      .style("opacity", "0.7")
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )

})
