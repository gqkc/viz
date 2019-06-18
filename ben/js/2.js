// The svg
var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

 var svg = d3.select("#divforbubble").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


// Add X axis
var x = d3.scaleLinear()
    .domain([40, 85])
    .range([0, width]);

 svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([150, 10000])
    .range([height,0 ]);

   // text label for the y axis
svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("GDP / Capita");

svg.append("text")
      .attr("y", 0 + height)
      .attr("x",0 + width/2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Life expectancy");

svg.append("g")
     // .attr("transform", "translate("+width+",0)")
   .call(d3.axisLeft(y));

var z = d3.scaleLinear()
    .domain([0, 1])
    .range([ 2,3]);

var Tooltip = d3.select("#divforbubble")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px")
.style("position","absolute")


var colorScale = d3.scaleSequential()
    .domain([-1,4]).interpolator(d3.interpolateReds);
    //.range(d3.schemeBlues[7]);

// Map and projection

// Data and color scale
var data_gdp = d3.map();
var data_exp = d3.map();
var data_hiv = d3.map();
var data_growth = d3.map();


// Load external data and boot
d3.queue()
    .defer(d3.csv, "../data/gdp.csv", function(d) {
   //console.log(d)
        data_gdp.set(d.name, +d["2010"]);
        return d
    })
    .defer(d3.csv, "../data/lifeexpectancy.csv", function(d) {
        //console.log(d)
        data_exp.set(d.name, +d["2010"]);
        return d
    })
    .defer(d3.csv, "../data/adults_with_hiv_percent_age_15_49.csv", function(d) {
    //console.log(d["1991"])
        data_hiv.set(d.country, +d["2010"]);
        return d
    })
    .defer(d3.csv, "../data/population_growth_annual_percent.csv", function(d) {
    //console.log(d["2010"])
        data_growth.set(d.country, +d["2010"]);
        return d
    })
    .await(ready);



function mouseoverLegend(datum, index) {

    Tooltip
      .style("opacity", 1)
      }


function mousemoveLegend(datum, index) {

//console.log(data_hiv.get(datum["name"]))
    Tooltip
      .html("Country: " + datum["name"]+
      "<br> Hiv: "+data_hiv.get(datum["name"])+
      "<br> Gdp: "+data_gdp.get(datum["name"])+
      "<br> Life expectancy: "+data_exp.get(datum["name"])

      )
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]+height) + "px")
}

function mouseoutLegend(datum, index) {
    Tooltip
      .style("opacity", 0)
      }

function ready(error, gdp, exp, hiv) {
    // Add dots
   // console.log("hiv",data_hiv)
    //console.log(data_gdp)
    /*var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
*/
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
            if (data_gdp.get(d['name'])!= undefined){
                //console.log(y(data_gdp.get(d['name'])))
                return y(data_gdp.get(d['name']));

                }
        })
        .attr("r", function(d) {
        //console.log(data_hiv.get(d['name']))
            if (data_hiv.get(d['name'])== undefined){
                //console.log(data_hiv.get(d['name']))
                return z(0)
                }
            return z(data_hiv.get(d['name']))
            //return 20
            })
        .style("fill", function(d) {
        //console.log(data_hiv.get(d['name']))
            if (data_growth.get(d['name'])== undefined){
                //console.log(data_hiv.get(d['name']))
                return colorScale(0)
                }
            return colorScale(data_growth.get(d['name']))
            //return 20
            })
         .on('mouseover',mouseoverLegend)
         .on("mousemove",mousemoveLegend)
         .on('mouseout',mouseoutLegend)
}



// The svg
var svg_map = d3.select("#my_dataviz2")

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(70)
  .center([0,20])
  //.translate([0, 0]);

// Data and color scale
var data = d3.map();
var colorScale2 = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

var allFeatures = ["gdp", "hiv", "life expectancy"]

    // add the options to the button
d3.select("#selectButton")
  .selectAll('myOptions')
 	.data(allFeatures)
  .enter()
	.append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button

// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .defer(d3.csv, "../data/population_total.csv",
  function(d) { data.set(d.country, +d["1980"]); })
  .await(ready2);


function ready2(error, topo,tes) {
    console.log(topo)
  // Draw the map
  svg_map.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
      //console.log(d.properties.name)
        d.total = data.get(d.properties.name) || 0;
        return colorScale2(d.total);
      });
    }
