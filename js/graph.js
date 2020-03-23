// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
    
// Adds the svg canvas
var svg = d3.select("div#chartId")
    .append("div")
    .classed("svg-container", true) 
    .append("svg")
    .attr("preserveAspectRatio", "none")
    .attr("viewBox", "0 0 900 350")
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

function prettySize(bytes, separator = '', postFix = '') {
    if (bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.min(parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10), sizes.length - 1);
        return `${(bytes / (1024 ** i)).toFixed(i ? 1 : 0)}${separator}${sizes[i]}${postFix}`;
    }
    return 'n/a';
}

var sizes = [];
var durations = [];
var f = d3.format(".3f");

// Get the data
d3.json("data/data2.json").then(function(data) {
    data.forEach(function(d) {
        d.date = new Date(d.date);
        durations.push(d.duration);
        d.duration = f(+d.duration);
        sizes.push(d.size);
        d.size = prettySize(d.size);
    });

    console.log(sizes);
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
                .html('<b>Date:</b> ' + format(d.date) + '<br><br><b>Duration:</b> ' + d.duration + ' seconds' +
                    '<br><br><b>Size:</b> ' + d.size)
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

    var meanCardTopNumber = document.getElementById("mean-averages-top-number");
    meanCardTopNumber.innerHTML = prettySize(d3.mean(sizes));
    var meanCardTopSentence = document.getElementById("mean-averages-top-sentence");
    meanCardTopSentence.innerHTML = "Average (mean) size of file";
    var meanCardBottomNumber = document.getElementById("mean-averages-bottom-number");
    meanCardBottomNumber.innerHTML = f(d3.mean(durations)) + "s";
    var meanCardBottomSentence = document.getElementById("mean-averages-bottom-sentence");
    meanCardBottomSentence.innerHTML = "Average (mean) time to upload file";

    var medianCardTopNumber = document.getElementById("median-averages-top-number");
    medianCardTopNumber.innerHTML = prettySize(d3.median(sizes));
    var medianCardTopSentence = document.getElementById("median-averages-top-sentence");
    medianCardTopSentence.innerHTML = "Average (median) size of file";
    var medianCardBottomNumber = document.getElementById("median-averages-bottom-number");
    medianCardBottomNumber.innerHTML = f(d3.median(durations)) + "s";
    var medianCardBottomSentence = document.getElementById("median-averages-bottom-sentence");
    medianCardBottomSentence.innerHTML = "Average (median) time to upload file";
});