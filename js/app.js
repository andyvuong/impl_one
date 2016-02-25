$(document).ready(function() {
    $('#myModal').modal('show');
    window.availableWords = []

    function callback(data) {
        window.availableWords = data.split('\n');
        //console.log(window.availableWords);
        $( "#search-reddit" ).autocomplete({
            maxResults: 5,
            source: availableWords
        });
    }

    $.get("../subs.txt", callback);

    // on modal close, focus on reddit search box
    $('#myModal').on('hidden.bs.modal', function () {
        $('#search-reddit').focus();
    });

    $('#zoom-in').on('click', function () {

    });

    $('#zoom-out').on('click', function () {
     
    });

    $('#expand').on('click', function () {
        
    });

    $('#search-user').on('click', function () {
        
    });



    var height = $("#content-area").width();
    var width = $("#content-area").height();
    var force = d3.layout.force();
    var svg = d3.select("#content-area").append("svg")
    .attr("width", height)
    .attr("height", width);

    d3.json("../test.json", function(error, json) {
        svg.selectAll("*").remove();
        data = json;
        r = 10;
        
        var links = data.links;
        var nodes = data.nodes;

        // general force layout attributes
        var force = d3.layout.force()
            .size([width, height])
            .charge(-100)
            .nodes(nodes)
            .links(links)
            .linkDistance(100)
            .start();


        // svg component attributes
        var link = svg.selectAll(".link")
            .data(links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) { 
                console.log(d.list.length)
                return Math.sqrt(d.list.length); 
            });

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

            node.attr("cx", function(d) { d.x = Math.max(r, Math.min(width - r, d.x)); return d.x; })
                .attr("cy", function(d) { d.y = Math.max(r, Math.min(height - r, d.y)); return d.y });
          });
    });

});
