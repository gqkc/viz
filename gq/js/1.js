

// The svg
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 40])
    .range([ 0, width]);
 /* svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 400000])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

*/
// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
var data_gdp = d3.map();
var data_exp = d3.map();

var colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

// Load external data and boot
d3.queue()
  .defer(d3.csv, "../data/gdp.csv", function(d) { data_gdp.set(d.name, +d["1980"]);return d })
  .defer(d3.csv, "../data/lifeexpectancy.csv", function(d) { data_exp.set(d.name, +d["1980"]);return d })
  .await(ready);

function ready(error, gdp,exp) {
  // Add dots
  console.log(gdp)
//console.log(data_gdp)
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width )
    .attr("height", height )
  .append("g")

  svg.append('g')
    .selectAll("dot")
    .data(gdp)
    .enter()
    .append("circle")
      .attr("cx", function (d) { console.log(data_exp.get(d['name']));return data_exp.get(d['name']); } )
      .attr("cy", function (d) { return data_gdp.get(d['name']); } )
        .attr("r", 1.5)
     .style("fill", "#69b3a2")
}