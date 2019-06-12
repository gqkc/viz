const w = 600
const h = 600
let dataset = [];
var div = d3.select("#content").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
let svg = d3.select("#content")
            .append("svg")
            .attr("width",w)
            .attr("height",h)

rscale = d3.scaleLinear()
 .domain([0,10000000])
 .range([1,200])

colorScale = d3.scaleSequential(d3.interpolateInferno)
 .domain([0, 100]);


let svg_hist = d3.select("#content")
            .append("svg")
            .attr("width",700)
            .attr("height",200);



function draw() {

    svg.selectAll('circle')
         .data(dataset)
         .enter()
         .append("circle")
           .attr("r", (d) => rscale(d.population))
           .attr("cx", (d) => x(d.longitude))
           .attr("cy", (d) => y(d.latitude))
           .attr("class", "circles")
           .attr("opacity", .8)
           .attr("fill", (d) => colorScale(d.density))
           .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("population :" +d.population +" <br/> density: "  + d.density)
                .style("left", d3.mouse(this)[0] + "px")
                .style("top", d3.mouse(this)[1] + "px");
            })
            .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
            });

}

d3.tsv("data/france.tsv")
    .row((d,i) => {
        return {
            codePostal: +d["Postal Code"],
            inseeCode: +d.inseecode,
            place: d.place,
            longitude: +d.x,
            latitude: +d.y,
            population: +d.population,
            density: +d.density,
        };
    })
    .get((error, rows) => {

        console.log("Loaded" + rows.length + " rows");
        if (rows.length > 0) {
            console.log("First row: ",rows[0])
            console.log("Last row: ",rows[rows.length-1])
        x = d3.scaleLinear()
            .domain(d3.extent(rows, (row) => row.longitude))
            .range([0,w]);
        y = d3.scaleLinear()
            .domain(d3.extent(rows, (row) => row.latitude))
            .range([h,0]);

        svg.append("g").attr("class","x axis").attr("transform", "translate(0,"+h+")").call(d3.axisTop(x));
        svg.append("g").attr("class","y axis").attr("transform", "translate(0,"+w+")").call(d3.axisRight(y));

        dataset=rows;
        draw();
        hist()

        }
     });

function hist(){
    var a = d3.scaleLinear()
      .domain([0, 1000000])
      .range([0, 1000]);
    var b = d3.scaleLinear()
        .domain([0, 1000])
      .range([0,100]);
    var histo = d3.histogram()
        .value(function(d) { return a(d.population); })
        .domain(a.domain())
        .thresholds(a.ticks(20));

    var bins = histo(dataset);

    b.domain([0, d3.max(bins, function(d) { return d.length; })]);


    var u = svg_hist.selectAll("rect").data(bins)
    u.enter()
        .append("rect")
          .attr("x", 10)
          .attr("transform", function(d) { return "translate(" + a(d.x0) + "," + b(d.length) + ")"; })
          .attr("width", function(d) { return a(d.x1 - d.x0) -1 ; })
          .attr("height", function(d) { return 1000-b(d.length) })
          .style("fill", "#69b3a2")

        svg_hist.append("g").attr("class","x axis").attr("transform", "translate(0,"+h+")").call(d3.axisTop(a));
        svg_hist.append("g").attr("class","x axis").attr("transform", "translate(0,"+w+")").call(d3.axisRight(b));

    }




