var subunits=null;
var countries=null;
var grats=null;
var text=null;
var worldglob=null
var mockdataglob=null
            var width = 960, height = 960;
var dictGlobal={}
var svg = d3.select('body').append('svg')
            .attr({'width': width, 'height': height})
            .append('g');
var circles = svg.append("svg:g")
    .attr("id", "circles");
        $(document).ready(function() {

        $("#slider").slider({
            value:2000,
            min: 1971,
            max: 2006,
            step: 1,
            slide: function( event, ui ) {
                $("#year").val(ui.value);
                redraw(ui.value.toString());
            }
        });
        //$("#year").val($("#slider").slider("value") );

        localStorage.setItem("year",1990)
            /* JavaScript goes here. */
            // globals used in graph
            var mapdata = {};

            var palette = ['#009933','#669900','#99cc00','#cccc00','#c7dc09','#edf933','#ffcc00', '#ff9933', '#ff6600','#ff5050'];
            var minDocCount = 0, quantiles = {};
            // projection definitions
            var projection = d3.geo.mercator()
                .scale((width + 1) / 2 / Math.PI)
                .translate([width/2, height/2])
                .precision(.1);
            var path = d3.geo.path().projection(projection);
            var graticule = d3.geo.graticule();
            // SVG related definitions

            var filter = svg.append('defs')
                .append('filter')
                .attr({'x':0, 'y':0, 'width':1, 'height':1, 'id':'gray-background'});
            filter.append('feFlood')
                .attr('flood-color', '#f2f2f2')
                .attr('result', 'COLOR');
            filter.append('feMorphology')
                .attr('operator', 'dilate')
                .attr('radius', '.9')
                .attr('in', 'SourceAlpha')
                .attr('result', 'MORPHED');
            filter.append('feComposite')
                .attr('in', 'SourceGraphic')
                .attr('in2', 'MORPHED')
                .attr('result', 'COMP1');
            filter.append('feComposite')
                .attr('in', 'COMP1')
                .attr('in2', 'COLOR');

            svg.append("path")
                .datum(graticule)
                .attr("class", "graticule")
                .attr("d", path);

            d3.json('data/nations.json', function(error, mockdata) {
                if (error) return console.error(error);
                window.mockdataglob=mockdata
                console.log('mockdata',mockdata);
                dictG={}
                for (k in mockdata){
                dictCount={}
                for (yearIncome in mockdata[k]["income"]){
                    dictCount[mockdata[k]["income"][yearIncome][0]]=mockdata[k]["income"][yearIncome][1]

                    }
                    dictGlobal[mockdata[k]["name"]]=dictCount
                    }
                 localStorage.setItem("dict",dictG)
                 console.log("s",dictG)
                mapdata = mockdata;
                draw(mockdata)
            });

            function draw(data) {
                // var localstoreWorldData = localStorage.getItem('worldmapData');
                // if (localstoreWorldData && localstoreWorldData.length) {
                //     localstoreWorldData = JSON.parse(localstoreWorldData);
                //     console.log('localstoreWorldData',localstoreWorldData);
                //     if (localstoreWorldData) {
                //         processWorldD(localstoreWorldData, data);
                //         //no need proceed further
                //         return;
                //     }
                // }
                d3.json('data/world.json', function(error, world) {
                    if (error) return console.error(error);
                    console.log('world',world);
                    window.worldglob=world
                    processWorldD(world, data);
                    //localStorage.setItem('worldmapData', JSON.stringify(world));
                });
            }
            function selectIncome(d){
                    income=null;
                    //console.log(localStorage.getItem("year"))
                  for (inc in d.properties.income) {
                        if (d.properties.income[inc][0]==localStorage.getItem("year")){
                            income=d.properties.income[inc][1]
                        }
                        }

                       //console.log(income)

                        return income;


            }
            function processWorldD(world, data) {
                    ids={}
                    for (var ke  in world.objects.subunits.geometries)
                      ids[world.objects.subunits.geometries[ke]["properties"]["name"]]=ke
                    //console.log("xq",data)
                    for (var ke2  in data){
                      //console.log("1")
                      if (ke2 in data && ids[data[ke2]["name"]]!= undefined && data[ke2]["income"][39]){
                          //console.log("2")
                          income=null
                          for (inc in data[ke2]["income"]) {
                            if (data[ke2]["income"][inc][0]=localStorage.getItem("year")){
                                income=data[ke2]["income"][inc][1]
                            }
                            //onsole.log(inc);
                          }
                        //console.log("ke2",data[ke2]["income"])
                        world.objects.subunits.geometries[ids[data[ke2]["name"] ]].properties.income=data[ke2]["income"]
                        //console.log(world.objects.subunits.geometries[ids[data[ke2]["name"]]])
                        }
                      }
                    //console.log("xq2",world.objects.subunits.geometries)
                    //for
                    //for geom in world.objects.subunits.geometries:

                    //console.log(world.objects.subunits.geometries[0])
                    //global subunits;
                    window.subunits = topojson.feature(world, world.objects.subunits);
                    subunits.features = subunits.features.filter(function(d){ return d.id !== "ATA"; });
                    //console.log('subunits',subunits);
                    //minDocCount = d3.min(subunits.features, selectIncome);
                    //console.log('minDocCount',minDocCount);
                    var incomes = subunits.features.map(selectIncome);
                    incomes = incomes.filter(function(d){ return d; }).sort(d3.ascending);
                    //console.log('doc_counts',doc_counts);
                    quantiles['0.95'] = d3.quantile(incomes, '0.95');


                    window.countries = svg.selectAll('path.subunit')
                        .data(subunits.features)
                    window.countries.exit().remove();
                     countries2=window.countries.enter();

                    window.grats=countries2.insert('path', '.graticule')
                        .attr('class', function(d) { return 'subunit ca'+d.id; })
                        .style('fill', heatColor)
                        .attr('d', path)
                        .on('mouseover',mouseoverLegend).on('mouseout',mouseoutLegend)
                       .on('click', coutryclicked)
                       ;
                    //d3.selectAll('.subunit-label').remove()
                    if (window.text != null){
                    window.text.exit().remove()
                    }
                    window.text=countries2.append('svg:text')
                        .attr('class', function(d){ return 'subunit-label la'+d.id+d.properties.name.replace(/[ \.#']+/g,''); })
                        //.attr('transform', function(d) { return 'translate('+ path.centroid(d) +')'; })
                        .attr('transform', function(d) { return 'translate('+(width-(5*d.properties.name.length))+','+(15)+')'; })
                        .attr('dy', '.35em')
                        .attr('filter', 'url(#gray-background)')
                        .append('svg:tspan')
                        .attr('x', 0)
                        .attr('dy', 5)
                        .text(function(d) { return d.properties.name; });

                        window.text.append('svg:tspan')
                        .attr("id","tspaninc")
                        .attr('x', 0)
                        .attr('dy', 20)
                        .text(function(d) { return selectIncome(d) ? selectIncome(d) : ''; });

            }

            function mouseoverLegend(datum, index) {
                d3.selectAll('.subunit-label.la'+datum.id+datum.properties.name.replace(/[ \.#']+/g,''))
                    .style('display', 'inline-block');
                d3.selectAll('.subunit.ca'+datum.id)
                    .style('fill', '#cc6699');
            }

            function mouseoutLegend(datum, index) {
                d3.selectAll('.subunit-label.la'+datum.id+datum.properties.name.replace(/[ \.#']+/g,''))
                    .style('display', 'none');
                d3.selectAll('.subunit.ca'+datum.id)
                    .style('fill', heatColor(datum));
            }

            function coutryclicked(datum, index) {
                //filter event for this country should be applied here
                console.log('coutryclicked datum', datum);
            }
            function heatColor(d) {
                year=localStorage.getItem("year")
                //console.log(d)
                if (quantiles['0.95'] === 0 && minDocCount === 0) return '#F0F0F0';
                if (!d.properties.income) return '#F0F0F0';
                if (d.properties.income > quantiles['0.95']) return palette[(palette.length - 1)];
                if (quantiles['0.95'] == minDocCount) return palette[(palette.length-1)];
                var diffDocCount = quantiles['0.95'] - minDocCount;
                var paletteInterval = diffDocCount / palette.length;
                var diffDocCountDatum = quantiles['0.95'] - d.properties.income;
                var diffDatumDiffDoc = diffDocCount - diffDocCountDatum;
                var approxIdx = diffDatumDiffDoc / paletteInterval;
                if (!approxIdx || Math.floor(approxIdx) === 0) approxIdx = 0;
                else approxIdx = Math.floor(approxIdx) - 1;
                return palette[approxIdx];
            }



            function redraw(year) {
            console.log("hello")
            processWorldD(window.worldglob, window.dataglob);


                        }

            });