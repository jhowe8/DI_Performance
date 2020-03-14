// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 1060 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the div for the tooltip
const div = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

    
// Adds the svg canvas
var svg = d3.select(".graph-card").append("svg")
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
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
        .on("mouseover", d => {
            div.transition()
                .duration(200)
                .style('opacity', 0.9);
            div
                .html(d.date + '<br/>' + d.duration + ' seconds')
                .style('left', d3.event.pageX + 'px')
                .style('top', d3.event.pageY - 28 + 'px');
        })
        .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style('opacity', 0);
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