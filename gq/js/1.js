// The svg
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Add X axis
var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);
 svg.append("g")
    //.attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 30000])
    .range([ height,0]);

  svg.append("g")
    //  .attr("transform", "translate("+width+",0)")
   .call(d3.axisLeft(y));

   var z = d3.scaleLinear()
    .domain([0, 1])
    .range([ 0,0.5]);


// Map and projection

// Data and color scale
var data_gdp = d3.map();
var data_exp = d3.map();
var data_hiv = d3.map();

var colorScale = d3.scaleThreshold()
    .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
    .range(d3.schemeBlues[7]);

// Load external data and boot
d3.queue()
    .defer(d3.csv, "../data/gdp2.csv", function(d) {
   //console.log(d["1980"])
        data_gdp.set(d.name, +d["1980"]);
        return d
    })
    .defer(d3.csv, "../data/lifeexpectancy.csv", function(d) {
        data_exp.set(d.name, +d["1980"]);
        return d
    })
    .defer(d3.csv, "../data/adults_with_hiv_percent_age_15_49.csv", function(d) {
    //console.log(d["1991"])
        data_hiv.set(d.country, d["1991"]);
        return d
    })
    .await(ready);

function ready(error, gdp, exp, hiv) {
    // Add dots
   // console.log("hiv",data_hiv)
    //console.log(data_gdp)
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")

    svg.append('g')
        .selectAll("dot")
        .data(gdp)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
           if (data_exp.get(d['name'])!= undefined)
            return x(data_exp.get(d['name']));
        })
        .attr("cy", function(d) {
            if (data_gdp.get(d['name'])!= undefined)
            return y(data_gdp.get(d['name']));
        })
        .attr("r", function(d) {
        //console.log(data_hiv.get(d['name']))
            if (data_hiv.get(d['name'])== undefined){
                //console.log(data_hiv.get(d['name']))
                return 0.01
                }
            return z(data_hiv.get(d['name']))})
        .style("fill", "#69b3a2")
}