$(document).ready(function() {
    $('#myModal').modal('show');

    // on modal close, focus on reddit search box
    $('#myModal').on('hidden.bs.modal', function () {
        $('#search-reddit').focus();
    });



    var height = 350;
    var width = 350;
    var force = d3.layout.force();
    var svg = d3.select("#content-area").append("svg")
    .attr("width", width)
    .attr("height", height);

    d3.json("../test.json", function(error, json) {
        svg.selectAll("*").remove();
        data = json;
        r = 5;
        
        var links = data.links;
        var nodes = data.nodes;

        var force = d3.layout.force()
            .size([width, height])
            .charge(-100)
            .nodes(nodes)
            .links(links)
            .start();

        var link = svg.selectAll(".link")
            .data(links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", r)
            .call(force.drag);

        force.on("tick", function() {

            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x = Math.max(r, Math.min(width - r, d.x)); })
                .attr("cy", function(d) { return d.y = Math.max(r, Math.min(height - r, d.y)); });
          });
    });
});
