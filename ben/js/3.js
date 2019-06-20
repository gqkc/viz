
var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%b %Y");

var startDate = new Date("1990"),
    endDate = new Date("2010");

var margin = {top:0, right:50, bottom:0, left:50},
    width = 960 -margin.left - margin.right,
    height = 120 - margin.top - margin.bottom;
console.log(width)
var svg11 = d3.select("#slider")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height);

var x_time_scale = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, width])
    .clamp(true);

var slider = svg11.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);
 var label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDateIntoYear(startDate))
    .attr("transform", "translate(0," + (-25) + ")")
function hue(h) {
fill_with_data(xValue, yValue,formatDateIntoYear(h))
    console.log(formatDateIntoYear(h))
  handle.attr("cx", x_time_scale(h));
  label
    .attr("x", x_time_scale(h))
    .text(formatDateIntoYear(h));
}
slider.append("line")
    .attr("class", "track")
    .attr("x1", x_time_scale.range()[0])
    .attr("x2", x_time_scale.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { hue(x_time_scale.invert(d3.event.x)); }));


console.log("dqs")




 var svg = d3.select("#divforbubble").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
console.log(svg)


var xValue = $('#xAxis').val();
var yValue = $('#yAxis').val();
var year = $('#slider .label').val();


$('#xAxis').on('change', function() {
                xValue = $('#xAxis').val();
                fill_with_data(xValue, yValue, year);
            });

$('#yAxis').on('change', function() {
    yValue = $('#yAxis').val();
    fill_with_data(xValue, yValue, year);
});

// Add X axis


 // svg.append("g")
 //    .attr("transform", "translate(0," + height + ")")
 //    .call(d3.axisBottom(xScale));

  // Add Y axis
  // var y = d3.scaleLinear()
  //   .domain([150, 10000])
  //   .range([height,0 ]);

var z = d3.scaleLinear()
    .domain([0, 1])
    .range([ 2,3]);
var colorScale = d3.scaleSequential()
    .domain([-1,4]).interpolator(d3.interpolateReds);

   // text label for the y axis


// svg.append("g")
//      // .attr("transform", "translate("+width+",0)")
//    .call(d3.axisLeft(yScale));



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



    //.range(d3.schemeBlues[7]);

// Map and projection
function fill_with_data(key1, key2, year){
  // svg.transition()
	// 				.call(xAxis);

d3.selectAll("circle").remove()
    // Data and color scale
    var data_1 = d3.map();
    var data_2 = d3.map();
    var data_3 = d3.map();
    var data_4 = d3.map();

    // Load external data and boot
    d3.queue()
        .defer(d3.csv, "../data/"+key1+".csv", function(d) {
       //console.log(d)
            data_1.set(d.name, +d[year]);
            return d
        })
        .defer(d3.csv, "../data/"+key2+".csv", function(d) {
            //console.log(d)
            data_2.set(d.name, +d[year]);
            return d
        })
        .defer(d3.csv, "../data/adults_with_hiv_percent_age_15_49.csv", function(d) {
        //console.log(d["1991"])
            data_3.set(d.country, +d[year]);
            return d
        })
        .defer(d3.csv, "../data/population_growth_annual_percent.csv", function(d) {
        //console.log(d["2010"])
            data_4.set(d.country, +d[year]);
            return d
        })
        .await(ready);

        //data_3.
        var xScale = d3.scaleLinear()
                        .range([0, width - 200])
                        .domain([0, d3.max(data_1, function (d) { return d.name + 10; })])
                        .nice();

        var yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data_2, function (d) { return d.name + 10; })])
            .nice();
        // console.log(yScale)

        var xAxis = d3.axisBottom(xScale)
        var yAxis = d3.axisLeft(yScale)
        var svgXaxis = svg.append('g').attr("class", "x axis")
                                      .attr('transform', 'translate(0,' + height + ')')
                                      .call(xAxis);

        var svgYaxis = svg.append('g').attr("class", "y axis")
                                      .call(yAxis);


              svgXaxis.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left)
                    .attr("x",0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text(yValue);

              svgYaxis.append("text")
                    .attr("y", 0 + height)
                    .attr("x",0 + width/2)
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text(xValue);


              svgXaxis.transition().call(xAxis);
              svgYaxis.transition().call(yAxis);
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
    var data2 = d3.map();

    var colorScale2 = d3.scaleThreshold()
      .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
      .range(d3.schemeBlues[7]);

    // Load external data and boot
    d3.queue()
      .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .defer(d3.csv, "../data/population_total.csv",
      function(d) { data.set(d.country, +d[year]); })
      .await(ready2);




function mouseoverLegend(d, index) {

    id=data2.get(d["name"])
    //console.log(id)
    //console.log(datum["name"])
    //console.log(id)
    //console.log(data2.get(id))
      svg_map.selectAll("#feature"+id)
        .style('fill', '#cc6699');

    Tooltip
      .style("opacity", 1)
      }


function mousemoveLegend(d, index) {



    Tooltip
      .html("Country: " + d["name"]+
      "<br> Hiv: "+data_3.get(d["name"])+
      "<br> Gdp: "+data_1.get(d["name"])+
      "<br> Life expectancy: "+data_2.get(d["name"])

      )
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]+height) + "px")
}

function mouseoutLegend(d, index) {

    id=data2.get(d["name"])
    svg_map.selectAll("#feature"+id)
        .style('fill', colorScale2(data.get(d["name"])));

    Tooltip
      .style("opacity", 0)
      }

function ready(error, gdp, exp, hiv) {
    console.log('dd')
    svg.append('g')
        .selectAll("dot")
        .data(gdp)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
           if (data_1.get(d['name'])!= undefined)
            return xScale(data_1.get(d['name']));
        })
        .attr("cy", function(d) {
            if (data_2.get(d['name'])!= undefined){
                //console.log(y(data_1.get(d['name'])))
                return yScale(data_2.get(d['name']));

                }
        })
        .attr("r", function(d) {
        //console.log(data_3.get(d['name']))
            if (data_3.get(d['name'])== undefined){
                //console.log(data_3.get(d['name']))
                return z(0)
                }
            return z(data_3.get(d['name']))
            //return 20
            })
        .style("fill", function(d) {
        //console.log(data_3.get(d['name']))
            if (data_4.get(d['name'])== undefined){
                //console.log(data_3.get(d['name']))
                return colorScale(0)
                }
            return colorScale(data_4.get(d['name']))
            //return 20
            })
         .on('mouseover',mouseoverLegend)
         .on("mousemove",mousemoveLegend)
         .on('mouseout',mouseoutLegend)
}



function ready2(error, topo,tes) {
    //console.log(topo)
    for (var feat in topo.features){

        //console.log(topo.features[feat].properties.name)
        data2.set(topo.features[feat].properties.name,topo.features[feat].id)
    }
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
      .attr("id",function (d) {
     // console.log("feature"+d.id)
        return "feature"+d.id;})
      // set the color of each country
      .attr("fill", function (d) {
      //console.log(d.properties.name)
        d.total = data.get(d.properties.name) || 0;
        return colorScale2(d.total);
      });

    }

}
