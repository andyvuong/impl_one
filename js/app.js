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

    $('#zoom-out').on('click', function () {
     
    });



    $('#search-user').on('click', function () {
        
    });

    d3.json("../testdata3.json", function(error, graph) {
        w = $("#content-area").width(),
        h = $("#content-area").height();

        var svg = d3.select("#content-area")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .append("g")
                .call(d3.behavior.zoom().scaleExtent([0, 8]).on("zoom", zoom))
                .append("g");
        
        var force = d3.layout.force()
            .size([w, h])
            .charge(-100)
            .nodes(graph.nodes)
            .links(graph.links)
            .linkDistance(100)
            .start();


        var link = svg.selectAll(".link")
                .data(graph.links)
                .enter().append("line")
                .attr("class", "link")
                .attr("transform", function(d) { return "translate(" + d + ")"; });

        var zoom = d3.behavior.zoom();
        var curTranslate = 0;
        var curScale = zoom.scale();

        function zoom() {
            curTranslate = d3.event.translate;
            curScale = d3.event.scale;
            console.log(curTranslate);
            console.log(curScale);
            svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        var node = svg.selectAll(".node")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("class", "node")
                .attr("r", 10)
                .call(force.drag);

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });

        $('#zoom-in').on('click', function () {
            console.log("zoom in");
            curTranslate[0] = curTranslate[0] - 1;
            curTranslate[1] = curTranslate[1] - 0.5;
            curScale = curScale + 0.5;
            zoomClicked(curTranslate, curScale);
        });

        $('#expand').on('click', function () {
            zoom.scale(1);
            zoom.translate([0, 0]);
            zoomClicked([0, 0], 1);
        });

        function zoomClicked(translate, scale) {
            svg.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
        }

/*
            var height = $("#content-area").width();
    var width = $("#content-area").height();
    var force = d3.layout.force();

    // zoom
    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

    var svg = d3.select("#content-area").append("svg")
        .attr("width", height)
        .attr("height", width)
     .append("g")
        .call(zoom);

    var container = svg.append("g");
        
    function zoomed() {
        console.log("helo");
      container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

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


        var force = d3.layout.force()
                .charge(-100)
                .linkDistance(100)
                .size([w, h]);

        force.nodes(graph.nodes)
            .links(graph.links)
            .start();
*/
    });

});
