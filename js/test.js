alert("hello");

const w=600;
const h=600;

//Create SVG element
let svg = d3.select("body")
           .append("svg")
               .attr("width", w)
               .attr("height",h);

let dataset =[];

d3.tsv("data/france.tsv")
   .row((d,i) =>{
       return{
           codePostal:+d["Postal Code"],
           inseeCode:+d.inseeCode,
           place: d.place,
           longitude: +d.x,
           latitude:+d.y,
           population:+d.population,
           density:+d.density
       };

       })
   .get((error, rows) => {
       console.log("Loaded" + rows.length + "rows");
       if (rows.length >0){
           console.log("First row: ", rows[0])
           console.log("Last row: ", rows[rows.length-1])
       x = d3.scaleLinear()
           .domain(d3.extent(rows, (row) => row.longitude))
           .range([0,w]);
       y = d3.scaleLinear()
           .domain(d3.extent(rows, (row) => row.latitude))
           .range([h,0]);
       svg.append("g")
               .attr("class","x axis")
               .attr("transform", "translate(0,"+h+")")
               .call(d3.axisTop(x));
       svg.append("g")
               .attr("class","y axis")
               .attr("transform", "translate(0,"+w+")")
               .call(d3.axisRight(y));
       dataset = rows;
       draw();

           }

});

function draw() {
   svg.selectAll("rect")
           .data(dataset)
           .enter()
           .append("rect")
           .attr("width", 1)
           .attr("height", 1)
           .attr("x", (d) => x(d.longitude))
           .attr("y", (d) => y(d.latitude))
           .on("mouseover", handleMouseOver)
           .on("mouseout", handleMouseOut);

};

function handleMouseOver(d, i) {  // Add interactivity
    console.log("helo")

   // Use D3 to select element, change color and size
   d3.select(this).attr({
     fill: "red",
     rx: 200,
     ry: 200

   });


 }

function handleMouseOut(d, i) {
   // Use D3 to select element, change color back to normal
   d3.select(this).attr({
     fill: "black",
     rx: 1,
     ry: 1

   });


 }