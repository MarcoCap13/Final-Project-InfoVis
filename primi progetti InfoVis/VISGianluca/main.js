var typedString = "";
document.addEventListener("keydown", function (event) {
    typedString += event.key;

    if (typedString === "vis") {
        document.body.style.backgroundImage = "url('sfondoVis.png')";
        typedString = "";
    }
    if (typedString === "back") {
        document.body.style.backgroundImage = "url('sfondo.png')";
        typedString = "";
    }
});
d3.json("formiche.json").then(function (data) {
    var svg = d3.select("svg");

    // Scala per l'asse x 
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.x; })])
        .range([0, 1500]);

    // Scala per l'asse y 
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.y; })])
        .range([0, 800]);

    // Scala per l'addome
    var addomeScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.addome; })])
        .range([0, 30]);

    // Scala per le antenne
    var antennaScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.antenna; })])
        .range([0, 15]);

    /*Selezione elementi g e ne creo di nuovi*/
    var formiche = svg.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function (d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; });

    /*Aggiunta del cerchio a ciascun elemnto g*/
    formiche.append("circle")
        .attr("r", function (d) { return addomeScale(d.addome); })
        .attr("fill", function (d) { return d.color; })
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    //stessa cosa ma per le antennte
    formiche.append("g")
        .attr("class", "antennae-group")
        .attr("transform", function (d) { return "translate(0," + (-addomeScale(d.addome)) + ")"; })
        .append("ellipse")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("rx", function (d) { return d.ellisse; })
        .attr("ry", function (d) { return addomeScale(d.addome) * 0.4; })
        .attr("fill", function (d) { return d.color; })
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    formiche.select(".antennae-group")
        .append("line")
        .attr("x1", -5)
        .attr("y1", function (d) { return -addomeScale(d.addome) * 0.4; })
        .attr("x2", -10)
        .attr("y2", function (d) { return -addomeScale(d.addome) * 0.8; })
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    formiche.select(".antennae-group")
        .append("line")
        .attr("x1", 5)
        .attr("y1", function (d) { return -addomeScale(d.addome) * 0.4; })
        .attr("x2", 10)
        .attr("y2", function (d) { return -addomeScale(d.addome) * 0.8; })
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    //gestione dell'evento del click    
    formiche.on("click", function (event, d) {
        var clickedAnt = d3.select(this);
        var isSelected = clickedAnt.classed("selected");

        if (!isSelected) {
            var selectedformiche = svg.selectAll(".selected");
            if (selectedformiche.size() < 2) {
                clickedAnt.classed("selected", true);
            } else {
                return;
            }
        } else {
            clickedAnt.classed("selected", false);
        }

        var selectedformiche = svg.selectAll(".selected");

        if (selectedformiche.size() === 2) {
            var ant1 = d3.select(selectedformiche.nodes()[0]).datum();
            var ant2 = d3.select(selectedformiche.nodes()[1]).datum();

            var tempaddome = ant1.addome;
            var tempAntenna = ant1.antenna;
            var tempellisse = ant1.ellisse;
            var tempColor = ant1.color;

            ant1.addome = ant2.addome;
            ant2.addome = tempaddome;

            ant1.antenna = ant2.antenna;
            ant2.antenna = tempAntenna;

            ant1.ellisse = ant2.ellisse;
            ant2.ellisse = tempellisse;

            ant1.color = ant2.color;
            ant2.color = tempColor;

            selectedformiche.classed("selected", false);
        }

        formiche.transition()
            .duration(500)
            .attr("transform", function (d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; });

        formiche.select("circle")
            .transition()
            .duration(500)
            .attr("r", function (d) { return addomeScale(d.addome); })
            .attr("fill", function (d) { return d.color; });

        formiche.select(".antennae-group")
            .transition()
            .duration(500)
            .attr("transform", function (d) { return "translate(0," + (-addomeScale(d.addome)) + ")"; });

        formiche.select(".antennae-group").select("ellipse")
            .transition()
            .duration(500)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("rx", function (d) { return d.ellisse; })
            .attr("ry", function (d) { return addomeScale(d.addome) * 0.4; })
            .attr("fill", function (d) { return d.color; });

        formiche.select(".antennae-group").selectAll("line")
            .transition()
            .duration(500)
            .attr("y1", function (d) { return -addomeScale(d.addome) * 0.4; })
            .attr("y2", function (d) { return -addomeScale(d.addome) * 0.8; });
    });
});
