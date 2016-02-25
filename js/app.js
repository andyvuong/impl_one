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

    $( "#search-reddit" ).autocomplete({
        maxResults: 5,
        source: availableWords
    });

    // on modal close, focus on reddit search box
    $('#myModal').on('hidden.bs.modal', function () {
        $('#search-reddit').focus();
    });

    d3.json("../testdata3.json", function(error, graph) {
        w = $("#content-area").width(),
        h = $("#content-area").height();

        var users = [];
        for (var n = 0; n < graph.nodes.length; n++) {
            users.push(graph.nodes[n].name);
        }
        console.log(users);

        // show tip
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(function(d) {
                var sim = "<ul class=\"sim-list\">"
                for (var sim_in = 0; sim_in < d.list.length; sim_in++) {
                    sim += "<li>" + d.list[sim_in] + "</li>";
                }
                sim += "</ul>";

                return "<strong>" + d.source.name + "</strong> and <strong>" + d.target.name + "</strong>" + sim;
                
            });

        var nodeTip = d3.tip()
            .attr('class', 'node-tip')
            .html(function(d) {
                return d.name;
            });

        var svg = d3.select("#content-area")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .append("g")
                .call(d3.behavior.zoom().scaleExtent([0, 8]).on("zoom", zoom))
                .call(tip)
                .call(nodeTip)
                .append("g");

        
        var force = d3.layout.force()
            .size([w, h])
            .charge(-100)
            .nodes(graph.nodes)
            .links(graph.links)
            .linkDistance(100)
            .start();

        var linkSelected;
        var link = svg.selectAll(".link")
                .data(graph.links)
                .enter().append("line")
                .attr("class", "link")
                .attr("transform", function(d) { return "translate(" + d + ")"; })
  
                .on("mouseover", function(d) {
                    console.log("yolo");
                    d3.select(this).attr("class", "link1")
                    tip.show(d)
                    //console.log(d.list);
                })
                .on("mouseout", function(d) {
                    console.log("out");
                    d3.select(this).attr("class", "link");
                    tip.hide(d)
                })
                .on("click", function(d) {
                    
                });

        var zoom = d3.behavior.zoom();

        function zoom() {
            curTranslate = d3.event.translate;
            curScale = d3.event.scale;
            console.log(curTranslate);
            console.log(curScale);
            svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        var selected;
        var node = svg.selectAll(".node")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("class", "node")
                .attr("id", function(d) { return d.name })
                .attr("r", 10)
                .call(force.drag)
                .on("mouseover", function(d) {
                    if (this != selected) {
                        d3.select(this).attr('r', 12);
                    }
                    nodeTip.show(d);
                })
                .on("mouseout", function(d) {
                    if (this != selected) {
                        d3.select(this).attr('r', 10);
                    }
                     nodeTip.hide(d);
                })
                .on("click", function(d) {
                    if (!selected) {
                        selected = this;
                        d3.select(this).attr('r', 15)
                        .style("fill","#7B6ED6")
                    }
                    else if (selected != this) {
                        d3.select(selected).attr('r', 10)
                        .style("fill","#703d6f");
                         selected = this;
                         d3.select(selected).attr('r', 15)
                        .style("fill","#7B6ED6");
                    }
                    
                    // similar users
                    $("#key-use ul").empty();
                    $("#key-cur").empty();
                    console.log(d.connectedusers);
                    list = d.connectedusers
                    console.log(list);
                    $("#key-cur").append(d.name);
                    for (var k = 0; k < list.length; k++) {
                        if (k > 12) {
                            break;
                        }
                        $("#key-use ul").append("<li>"+list[k]+"</li>"); //text(d.url);
                    }

                    // recommended
                    $("#key-rec ul").empty();
                    var username = d.name;
                    //console.log(username);
                    listRec = graph.recommendedsubs[username];
                    for (var k = 0; k < listRec.length; k++) {
                        if (k > 5) {
                            break;
                        }
                        $("#key-rec ul").append("<li>"+listRec[k]+"</li>"); //text(d.url);
                    }
                });

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });

        $('#zoom-in').on('click', function () {
        });

        $('#expand').on('click', function () {
            zoom.scale(1);
            zoom.translate([0, 0]);
            zoomClicked([0, 0], 1);
        });

        function zoomClicked(translate, scale) {
            svg.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
        }

        $('#search-user').on('click', function () {
            var input = $("#search-user-box").val();
            if (users.indexOf(input) != -1) {
                $("#"+input).d3Click();
            }
        });

        jQuery.fn.d3Click = function () {
          this.each(function (i, e) {
            var evt = new MouseEvent("click");
            e.dispatchEvent(evt);
          });
        };

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
