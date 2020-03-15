// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
    
// Adds the svg canvas
var svg = d3.select(".graph-card")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json("data/data2.json").then(function(data) {
    console.log(data)
    data.forEach(function(d) {
        d.date = new Date(d.date);
        d.duration = +d.duration;
    });

    var format = d3.timeFormat("%B %d %Y %I:%M:%S %p");
    var tooltipdiv = d3.select("#tooltip-section").append("div") 
                        .attr("class", "tooltip")       
                        .style("opacity", 1);

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.duration; })]);

    // Add the scatterplot
    svg.selectAll("mycircle")
        .data(data)
        .enter().append("circle")
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.duration); })
        .attr("r", 6)
        .attr("fill", "rgb(0,57,112)")
        .attr("stroke", "rgb(0,57,112)")
        .on("mouseover", function(d) {
            tooltipdiv
                .html('<b>Date:</b> ' + format(d.date) + '<br><br><b>Duration:</b> ' + d.duration + ' seconds')
                .style('opacity', .9);
            d3.select(this)
                .attr("fill", "rgb(111,212,77)");
        
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .attr("fill", "rgb(0,57,112)");
            tooltipdiv.style('opacity', 0);
        });

    // Lines
    svg.selectAll("myline")
      .data(data)
      .enter()
      .append("line")
        .attr("x1", function(d) { return x(d.date); })
        .attr("x2", function(d) { return x(d.date); })
        .attr("y1", function(d) { return y(d.duration) + 6.5; })
        .attr("y2", y(0))
        .attr("stroke", "grey")        

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("text")    
        .attr('class', 'std-lato-font') 
        .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("DATE");    

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr('class', 'std-lato-font')
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("DURATION (SECONDS)"); 
});