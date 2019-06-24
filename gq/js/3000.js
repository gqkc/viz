var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%b %Y");

var startDate = new Date("1990"),
    endDate = new Date("2011");

var xValue = $('#xAxis').val();
var yValue = $('#yAxis').val();
var rValue = $('#rAxis').val();

var currentValue = 0;

$('#xAxis').on('change', function() {
                xValue = $('#xAxis').val();
                console.log(xValue)
                fill_with_data(rValue, xValue, yValue, formatDateIntoYear(x_time_scale.invert(currentValue)));
            });

$('#yAxis').on('change', function() {
    yValue = $('#yAxis').val();
    fill_with_data(rValue, xValue, yValue, formatDateIntoYear(x_time_scale.invert(currentValue)));
});

$('#rAxis').on('change', function() {
    rValue = $('#rAxis').val();
    fill_with_data(rValue, xValue, yValue, formatDateIntoYear(x_time_scale.invert(currentValue)));
});

var margin = {
        top: 0,
        right: 50,
        bottom: 0,
        left: 50
    },
    width = 960 - margin.left - margin.right,
    width_slider = 960 - margin.left - margin.right,

    height_slider = 100,

    height = 500 - margin.top - margin.bottom;

var playButton = d3.select("#play-button");
var moving = false;
var targetValue = width_slider;

var svg11 = d3.select("#slider")
    .append("svg")
    .attr("width", width_slider + margin.left + margin.right)
    .attr("height", height_slider);

var x_time_scale = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, width_slider])
    .clamp(true);

var slider = svg11.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + 40 + ")");

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 10);

var label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDateIntoYear(startDate))
    .attr("transform", "translate(0," + (-25) + ")")

function hue(h) {
    fill_with_data(rValue, xValue, yValue, formatDateIntoYear(h))
    // console.log(formatDateIntoYear(h))
    handle.attr("cx", x_time_scale(h));
    label
        .attr("x", x_time_scale(h))
        .text(formatDateIntoYear(h));
    //svg11.style("background-color", d3.hsl(h / 1000000000, 0.8, 0.8));
}
slider.append("line")
    .attr("class", "track")
    .attr("x1", x_time_scale.range()[0])
    .attr("x2", x_time_scale.range()[1])
    .select(function() {
        return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-inset")
    .select(function() {
        return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() {
            slider.interrupt();
        })
        .on("start drag", function() {
          currentValue = d3.event.x;
            hue(x_time_scale.invert(d3.event.x));
        }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
    .data(x_time_scale.ticks(10))
    .enter()
    .append("text")
    .attr("x", x_time_scale)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatDateIntoYear(d); });

hue(startDate)

var svg = d3.select("#divforbubble").append("svg")
    .attr("width", 600)
    .attr("height", height )
    .append("g")
    .attr("transform",
        "translate(" + margin.left + ",50)");

var colours = d3.scaleOrdinal(d3.schemeCategory10)
.domain(["America", "Sub-Saharan Africa", "Europe & Central Asia", "Middle East & North Africa","South Asia","East Asia & Pacific"]);


var legend = svg.selectAll(".legend")
                .data(["America", "Sub-Saharan Africa", "Europe & Central Asia", "Middle East & North Africa","South Asia","East Asia & Pacific"] )
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) {
                    return "translate(-100," + i * 20 + ")";
                });

            legend.append("rect")
                .attr("x", 100)
                .attr("y", 329)
                .attr("width", 18)
                .attr("height", 18)
                .style("stroke", "black")
                .style("fill", colours);


            legend.append("text")
                .attr("x", 125)
                .attr("y", 340)
                .attr("dy", ".35em")
                .text(function(d) {
                    return d;
                })


// Add X axis



// Add Y axis
var x = d3.scaleLinear()
    .domain([40, 85])
    .range([0, 500]);
var y = d3.scaleLinear()
    .domain([0, 50000])
    .range([300, 0]);

var z = d3.scaleLinear()
    .domain([0, 1])
    .range([2, 3]);
var colorScale = d3.scaleSequential()
    .domain([-1, 4]).interpolator(d3.interpolateReds);


svg.append("g")
    .attr("id","axe_x")
    .attr("transform", "translate(0," +305 + ")")
    .call(d3.axisBottom(x));
// text label for the y axis
svg.append("text")
    .attr("id","idy")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left-3)
    .attr("x", 0 - 150)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(yValue);

svg.append("text")
    .attr("id","idx")
    .attr("y", 330)
    .attr("x", "50%")
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(xValue);

svg.append("g")
    .attr("id","axe_y")
    .call(d3.axisLeft(y));



var Tooltip = d3.select("#divforbubble")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute")



//.range(d3.schemeBlues[7]);
var first = true;
// Map and projection
function step() {
  hue(x_time_scale.invert(currentValue));
  currentValue = currentValue + (targetValue/151);
  // console.log(x_time_scale.invert(currentValue))
  if (currentValue > targetValue) {
    moving = false;
    currentValue = 0;
    clearInterval(timer);
    // timer = 0;
    playButton.text("Play");
    console.log("Slider moving: " + moving);
  }
}

function fill_with_data(k0, k1, k2, year) {
  // d3.selectAll("circle").remove()


  playButton
    .on("click", function() {
    var button = d3.select(this);
    if (button.text() == "Pause") {
      moving = false;
      clearInterval(timer);
      // timer = 0;
      button.text("Play");
    } else {
      moving = true;
      timer = setInterval(step, 100);
      button.text("Pause");
    }})
    // Data and color scale
    var data_gdp = d3.map();
    var data_exp = d3.map();
    var data_hiv = d3.map();
    var data_growth = d3.map();

    // Load external data and boot
    d3.queue()
        .defer(d3.csv, "../data/"+k2+".csv", function(d) {
            // console.log(k2)
            data_gdp.set(d.name, +d[year]);
            return d
        })
        .defer(d3.csv, "../data/"+k1+".csv", function(d) {
            // console.log(k1)
            data_exp.set(d.name, +d[year]);
            return d
        })
        .defer(d3.csv, "../data/"+k0+".csv", function(d) {
            //console.log(d["1991"])
            data_hiv.set(d.name, +d[year]);
            return d
        })
        .defer(d3.csv, "../data/population_growth_annual_percent.csv", function(d) {
            //console.log(d["2010"])
            data_growth.set(d.name, +d[year]);
            return d
        })
       .defer(d3.csv, "../data/continent.csv",
            function(d) {
            //console.log(d["group"])
                data_continent.set(d.name, d["group"]);
            })
        .await(ready);
    //data_hiv.

    // The svg
    var svg_map = d3.select("#my_dataviz2")
    .attr("transform", "translate(-150,0)")


    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
        .scale(70)
        .center([0, 20])
    //.translate([0, 0]);

    // Data and color scale
    var data = d3.map();
    var data2 = d3.map();
    var data_continent = d3.map();

    var colorScale2 = d3.scaleThreshold()
        .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
        .range(d3.schemeBlues[7]);

    // Load external data and boot
    d3.queue()
        .defer(d3.json, "../data/world.geojson")
        .defer(d3.csv, "../data/population_total.csv",
            function(d) {
                data.set(d.name, +d[year]);
            })
        .await(ready2);




    function mouseoverLegend(d, index) {
        // console.log(d)
        id = data2.get(d["name"])
        console.log(d.name)
        //console.log(datum["name"])
        // console.log(svg)
        //console.log(data2.get(id))
        svg.selectAll("#feature" + d.name)
            .style("stroke", "black")
            .style("stroke-width", 5)

        svg_map.selectAll("#feature" + id)
            .style('fill', '#cc6699');

        Tooltip
            .style("opacity", 1)
    }

    function mouseoverLegend2(d, index) {
        // console.log(d.id)
        // id = data2.get(d["id"])
        id = d.id
        // console.log(d.properties.name)
        //console.log(datum["name"])
        // console.log(id)
        //console.log(data2.get(id))
        // console.log(d)
        svg_map.selectAll("#feature" + id)
            .style('fill', '#cc6699');
        svg.selectAll("#feature" + d.properties.name)
            .style("stroke", "black")
            .style("stroke-width", 5)
        Tooltip
            .style("opacity", 1)
    }

    function mousemoveLegend(d, index) {
      // console.log(d)

        Tooltip
            .html("Country: " + d["name"] +
                "<br> Hiv: " + data_hiv.get(d["name"]) +
                "<br> Gdp: " + data_gdp.get(d["name"]) +
                "<br> Life expectancy: " + data_exp.get(d["name"])

            )
            .style("left", (d3.mouse(this)[0] + width-100) + "px")
            .style("top", (d3.mouse(this)[1] + 200) + "px")


    }

    function mousemoveLegend2(d, index) {
      var i = d.properties.name
        Tooltip
            .html("Country: " + i +
                "<br> Hiv: " + data_hiv.get(i) +
                "<br> Gdp: " + data_gdp.get(i) +
                "<br> Life expectancy: " + data_exp.get(i)

            )
            .style("left", x(data_exp.get(i))+700 + "px")
            .style("top", y(data_gdp.get(i))+180 + "px")


    }

    function mouseoutLegend(d, index) {

        id = data2.get(d["name"])
        svg_map.selectAll("#feature" + id)
            .style('fill', colorScale2(data.get(d["name"])));

        Tooltip
            .style("opacity", 0)

            svg.selectAll("#feature" + d.name)
                .style("stroke", "white")
                .style("stroke-width", 1)
    }

    function mouseoutLegend2(d, index) {

        id = d.id
        svg_map.selectAll("#feature" + id)
            .style('fill', colorScale2(data.get(d["name"])));

        Tooltip
            .style("opacity", 0)

            svg.selectAll("#feature" + d.properties.name)
                .style("stroke", "white")
                .style("stroke-width", 1)
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
*/              console.log(d3.extent(d3.values(data_exp)))
        x = d3.scaleLinear()
            .domain(d3.extent(d3.values(data_exp)))
            .range([0, 500]);
        y = d3.scaleLinear()
            .domain(d3.extent(d3.values(data_gdp)))
            .range([300, 0]);
        z = d3.scaleLinear()
            .domain(d3.extent(d3.values(data_hiv)))
            .range([2, 10]);
        svg.select("#axe_x")
            .transition()
            .call(d3.axisBottom(x))

        svg.select("#axe_y")
            .transition()
            .call(d3.axisLeft(y))

        if (first ==true){
        svg.append('g')
            .selectAll("dots")
            .data(gdp)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                if (data_exp.get(d['name']) != undefined)
                    return x(data_exp.get(d['name']));
            })
            .attr("cy", function(d) {
                if (data_gdp.get(d['name']) != undefined) {
                    //console.log(y(data_gdp.get(d['name'])))
                    return y(data_gdp.get(d['name']));

                }
            })
            .attr("r", function(d) {
                //console.log(data_hiv.get(d['name']))
                if (data_hiv.get(d['name']) == undefined) {
                    //console.log(data_hiv.get(d['name']))
                    // return z(0)
                }
                else return z(data_hiv.get(d['name']))
                //return 20
            })
            .attr("id", function(d) {
                // console.log("feature"+d.name)
                return "feature" + d.name;
            })
            .style("fill", function(d) {
                //console.log(data_hiv.get(d['name']))
                if (data_continent.get(d['name']) == undefined) {
                    //console.log(data_hiv.get(d['name']))
                }
                return colours(data_continent.get(d['name']))
                //return 20
            })
            .style("stroke", "white")
            .on('mouseover', mouseoverLegend)
            .on("mousemove", mousemoveLegend)
            .on('mouseout', mouseoutLegend)

    first = false
    }
    if (first == false){
      svg.selectAll("circle")
          .transition()
          .duration(20)
          .attr("cx", function(d) {
              if (data_exp.get(d['name']) != undefined)
                  return x(data_exp.get(d['name']));
          })
          .attr("cy", function(d) {
              if (data_gdp.get(d['name']) != undefined) {
                  //console.log(y(data_gdp.get(d['name'])))
                  return y(data_gdp.get(d['name']));

              }
          })
          .attr("r", function(d) {
              //console.log(data_hiv.get(d['name']))
              // if (data_hiv.get(d['name']) == undefined) {
              //     //console.log(data_hiv.get(d['name']))
              // }
              return z(data_hiv.get(d['name']))
              //return 20
          })
          .attr("id", function(d) {
              // console.log("feature"+d.name)
              return "feature" + d.name;
          })
          .style("fill", function(d) {
              //console.log(data_hiv.get(d['name']))
              if (data_continent.get(d['name']) == undefined) {
                  //console.log(data_hiv.get(d['name']))
                  // return colours(0)
              }
              else return colours(data_continent.get(d['name']))
              //return 20
          })
          // .style("stroke", "white")
          // .on('mouseover', mouseoverLegend)
          // .on("mousemove", mousemoveLegend)
          // .on('mouseout', mouseoutLegend)
          svg.selectAll("#idy")
              .text(yValue);

          svg.selectAll("#idx")
              .text(xValue);
  }}



    function ready2(error, topo, tes) {

     //console.log(topo)
        for (var feat in topo.features) {

            //console.log(topo.features[feat].properties.name)
            data2.set(topo.features[feat].properties.name, topo.features[feat].id)
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
            .attr("id", function(d) {
                // console.log("feature"+d.id)
                return "feature" + d.id;
            })
            // set the color of each country
            .attr("fill", function(d) {
                // console.log(data_continent)
                d.total = data.get(d.properties.name) || 0;
                return colorScale2(d.total);
            })
            .on('mouseover', mouseoverLegend2)
            .on("mousemove", mousemoveLegend2)
            .on('mouseout', mouseoutLegend2);

    }

}
