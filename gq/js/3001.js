var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%b %Y");

var startDate = new Date("1960"),
    endDate = new Date("2011");

var xValue = $('#xAxis').val();
var yValue = $('#yAxis').val();
var rValue = $('#rAxis').val();
var mapValue = $('#map').val();

var xmin
var xmax
var ymin
var ymax
var countries_clicked=[]

function remove(array, element) {
  return array.filter(el => el !== element);
}
$('#xmax').on('change', function() {
                xmin = $('#xmin').val();
                xmax = $('#xmax').val();
                fill_with_data(rValue, xValue, yValue, mapValue, formatDateIntoYear(x_time_scale.invert(currentValue)));
            });
$('#ymax').on('change', function() {
                ymin = $('#ymin').val();
                ymax = $('#ymax').val();
                fill_with_data(rValue, xValue, yValue, mapValue, formatDateIntoYear(x_time_scale.invert(currentValue)));
            });
console.log(xmin)
var currentValue = 0;

$('#xAxis').on('change', function() {
                xValue = $('#xAxis').val();
                console.log(xValue)
                fill_with_data(rValue, xValue, yValue, mapValue, formatDateIntoYear(x_time_scale.invert(currentValue)));
            });

$('#yAxis').on('change', function() {
    yValue = $('#yAxis').val();
    fill_with_data(rValue, xValue, yValue, mapValue, formatDateIntoYear(x_time_scale.invert(currentValue)));
});

$('#rAxis').on('change', function() {
    rValue = $('#rAxis').val();
    fill_with_data(rValue, xValue, yValue, mapValue, formatDateIntoYear(x_time_scale.invert(currentValue)));
});
$('#map').on('change', function() {
    mapValue = $('#map').val();
    fill_with_data(rValue, xValue, yValue, mapValue, formatDateIntoYear(x_time_scale.invert(currentValue)));
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
    fill_with_data(rValue, xValue, yValue, mapValue, formatDateIntoYear(h))
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
var colorScale;


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

function fill_with_data(k0, k1, k2, k3, year) {
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
    var data_y = d3.map();
    var data_x = d3.map();
    var data_r = d3.map();
    var data_growth = d3.map();

    // Load external data and boot
    d3.queue()
        .defer(d3.csv, "../data/"+k2+".csv", function(d) {
            // console.log(k2)
            data_y.set(d.name, +d[year]);
            return d
        })
        .defer(d3.csv, "../data/"+k1+".csv", function(d) {
            // console.log(k1)
            data_x.set(d.name, +d[year]);
            return d
        })
        .defer(d3.csv, "../data/"+k0+".csv", function(d) {
            //console.log(d["1991"])
            data_r.set(d.name, +d[year]);
            return d
        })
        .defer(d3.csv, "../data/"+k3+".csv", function(d) {
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
    //data_r.

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


    // Load external data and boot
    d3.queue()
        .defer(d3.json, "../data/world.geojson")
        .defer(d3.csv, "../data/"+k3+".csv",
            function(d) {
                data.set(d.name, +d[year]);
            })
        .await(ready2);


    function mouseclick(d, index) {
    if (d["properties"]== undefined){
    name_country=d.name
        }
        else{
        name_country=d.properties.name
        }
        id = data2.get(name_country)

        console.log(countries_clicked)

        if (!countries_clicked.includes(name_country)){
            countries_clicked.push(name_country)
            svg.selectAll("#feature" + name_country)
            .style("stroke", "black")
            .style("stroke-width", 5)

        svg_map.selectAll("#feature" + id)
            .style('fill', '#cc6699');
        }
        else{
            remove(countries_clicked,name_country);
            svg.selectAll("#feature" + name_country)
            .style("stroke", "white")
            .style("stroke-width", 1)
        svg_map.selectAll("#feature" + id)
            .style('fill', '#cc6699');
           svg_map.selectAll("#feature" + id)
            .style('fill', colorScale(data.get(name_country)));
        }
        // console.log(d)


    }

    function mouseoverLegend(d, index) {
        //countries_clicked.push(index)
        //console.log(countries_clicked)
        // console.log(d)
        id = data2.get(d["name"])
        svg.selectAll("#feature" + d.name)
            .style("stroke", "black")
            .style("stroke-width", 5)

        svg_map.selectAll("#feature" + id)
            .style('fill', '#cc6699');

        Tooltip
            .style("opacity", 1)
    }

    function mouseoverLegend2(d, index) {
        id = d.id

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

        console.log(d["name"])

        Tooltip
            .html("Country: " + d["name"] +
                "<br> "+rValue+": " + (data_r.get(d["name"])).toFixed(0) +
                "<br> "+yValue+": " + (data_y.get(d["name"]) ).toFixed(0)+
                "<br> "+xValue+": " + (data_x.get(d["name"])).toFixed(0)

            )
            .style("left", (d3.mouse(this)[0] + width-100) + "px")
            .style("top", (d3.mouse(this)[1] + 200) + "px")


    }

    function mousemoveLegend2(d, index) {
      var i = d.properties.name
        Tooltip
            .html("Country: " + i +
                "<br> "+rValue+": " + (data_r.get(i)).toFixed(0) +
                "<br> "+yValue+": " + (data_y.get(i)).toFixed(0) +
                "<br> "+xValue+": " + (data_x.get(i)).toFixed(0)

            )
            .style("left", x(data_x.get(i))+700 + "px")
            .style("top", y(data_y.get(i))+180 + "px")


    }

    function mouseoutLegend(d, index) {
        if (d["properties"]== undefined){
            name_country=d.name
        }
        else{
        name_country=d.properties.name
        }
        id = data2.get(name_country)
        // console.log(id)


        Tooltip
            .style("opacity", 0)
        if (!countries_clicked.includes(name_country)){
            svg.selectAll("#feature" + name_country)
                .style("stroke", "white")
                .style("stroke-width", 1)

         svg_map.selectAll("#feature" + id)
            .style('fill', colorScale(data.get(name_country)));
                }
    }
/*
    function mouseoutLegend2(d, index) {

        id = d.id
        console.log(d)
        svg_map.selectAll("#feature" + id)
            .style('fill', colorScale(data.get(d.properties.name)||0));

        Tooltip
            .style("opacity", 0)

            svg.selectAll("#feature" + d.properties.name)
                .style("stroke", "white")
                .style("stroke-width", 1)
    }
*/
    function ready(error, gdp, exp, hiv) {
        // Add dots
        // console.log("hiv",data_r)
        //console.log(data_y)
        /*var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
*/
 // console.log(d3.extent(d3.values(data_x)))
        if (xmin != undefined){
          x = d3.scaleLinear()
            .domain([xmin, xmax])
            .range([0, 500]).nice();}
        else {
        x = d3.scaleLinear()
            .domain(d3.extent(d3.values(data_x)))
            .range([0, 500]).nice();}
        if (ymin != undefined){
          y = d3.scaleLinear()
            .domain([ymin, ymax])
            .range([300, 0]).nice();}
        else {y = d3.scaleLinear()
          .domain(d3.extent(d3.values(data_y)))
          .range([300, 0]).nice();}
        z = d3.scaleLinear()
            .domain(d3.extent(d3.values(data_r)))
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
            .attr("id","bubble")
            .attr("cx", function(d) {
                if (data_x.get(d['name']) != undefined)
                    return x(data_x.get(d['name']));
            })
            .attr("cy", function(d) {
                if (data_y.get(d['name']) != undefined) {
                    console.log(y(data_y.get(d['name'])))
                    return y(data_y.get(d['name']));

                }
            })
            .attr("r", function(d) {
                //console.log(data_r.get(d['name']))
                if (data_r.get(d['name']) == undefined) {
                    //console.log(data_r.get(d['name']))
                    // return z(0)
                }
                else return z(data_r.get(d['name']))
                //return 20
            })
            .attr("id", function(d) {
                // console.log("feature"+d.name)
                return "feature" + d.name;
            })
            .style("fill", function(d) {
                //console.log(data_r.get(d['name']))
                if (data_continent.get(d['name']) == undefined) {
                    //console.log(data_r.get(d['name']))
                }
                return colours(data_continent.get(d['name']))
                //return 20
            })
            .style("stroke", function(d){
            if (countries_clicked.includes(data2.get(d.name))){
                return "black"
            }
            else return "white"
            })
            .style("stroke-width", function(d){

            if (countries_clicked.includes(d.name)){
                return 5
            }
            else return 1
            })
            .on('mouseover', mouseoverLegend)
            .on("mousemove", mousemoveLegend)
            .on("click", mouseclick)
            //.on('mouseout', mouseoutLegend)

    first = false
    }
    if (first == false){
      svg.selectAll("circle")
          .transition()
          .duration(5)
          .attr("cx", function(d) {
              if (data_x.get(d['name']) != undefined)
                  return x(data_x.get(d['name']));
          })
          .attr("cy", function(d) {
              if (data_y.get(d['name']) != undefined) {
                  //console.log(y(data_y.get(d['name'])))
                  return y(data_y.get(d['name']));

              }
          })
          .attr("r", function(d) {
              //console.log(data_r.get(d['name']))
              // if (data_r.get(d['name']) == undefined) {
              //     //console.log(data_r.get(d['name']))
              // }
              return z(data_r.get(d['name']))
              //return 20
          })
          .attr("id", function(d) {
              // console.log("feature"+d.name)
              return "feature" + d.name;
          })
          .style("fill", function(d) {
              //console.log(data_r.get(d['name']))
              if (data_continent.get(d['name']) == undefined) {
                  //console.log(data_r.get(d['name']))
                  // return colours(0)
              }
              else return colours(data_continent.get(d['name']))
              //return 20
          })
            .style("stroke", function(d){
            if (countries_clicked.includes(d.name)){
                return "black"
            }
            else return "white"
            })
            .style("stroke-width", function(d){

            if (countries_clicked.includes(d.name)){
                return 5
            }
            else return 1
            })


           svg.selectAll("circle").style("stroke", "white")
           .on('click', mouseoverLegend)
           .on("mousemove", mousemoveLegend)
           .on("click", mouseclick)

           .on('mouseout', mouseoutLegend)
          svg.selectAll("#idy")
              .text(yValue);

          svg.selectAll("#idx")
              .text(xValue);
  }}



    function ready2(error, topo, tes) {

     //console.log(topo)
     colorScale = d3.scaleSequential(d3.interpolateReds)
         .domain(d3.extent(d3.values(data)));
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
                if (countries_clicked.includes(d.properties.name)){
                    return "#cc6699"
                }
                // console.log(data_continent)
                d.total = data.get(d.properties.name) || 0;
                // console.log(d3.extent(d3.values(data)))
                return colorScale(d.total);
            })
            .on('mouseover', mouseoverLegend2)
            .on("mousemove", mousemoveLegend2)
            .on('mouseout', mouseoutLegend)
            .on('click', mouseclick)

    }

}
