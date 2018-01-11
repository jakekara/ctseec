var go_with_data = function(data){

    console.log("Going with data", data);

    var office = function(d){
	return d["Office Sought"];
    }

    var office_disp = function(d){
	
	var ret = d["Office Sought"];
	
	if (numeral(d["District"]).value() >= 1) {  ret += " " + numeral(d["District"]).format("0o") + " district"; }

	if (ret == "Undetermined") { ret += " office"; }
	return ret;
    }

    var offices = []

    data.forEach(function(d){
	if (offices.indexOf(office(d)) < 0) { offices.push(office(d)) }
    });

    console.log(offices)

    var aggregate = function(d){ return numeral(d["aggregate"]).value(); }

    var amounts = data.map(aggregate);

    var max = d3.max(amounts)

    console.log(max)
    
    var data = data.sort(function(a, b){
	if (numeral(a["aggregate"]).value() < numeral(b["aggregate"]).value()) return 1;
	return -1;
    }).filter(function(a){
	return aggregate(a) >= 1000;
    });

    var container = d3.select("#container");

    var boxes = container.selectAll(".candidate")
	.data(data)
	.enter()
	.append("div")
	.classed("box", true)

    boxes.append("div")
	.classed("candidate-name", true)
	.classed("box-head", true)
	.text(
	    function(d){
		return d["Candidate/Chairperson"]
	    }
	)

    boxes.append("div")
	.classed("office-sought", true)
	.text(function(d){ return "Running for " + office_disp(d) + "" });

    boxes.append("div")
	.classed("amount", true)
	.text(function(d){ return  numeral(d["aggregate"]).format("$0,0"); })

    var committee = function(d){
	return ""
	    + d["Committee Type"] + " committee: "
	    + d["Committee/Entity Name"]	
    }

    var subhed = boxes.append("div")
	.text(function(d){
	    return committee(d);
	})

    var link = boxes.append("div")
	.html(function(d){
	    return "<a target='_blank' href='" + d["link"] + "'>"
		+ d["Report Type"]
		+ "</a>"
	});
};

d3.csv("data/30/subtotals.csv", go_with_data);
console.log("OK");
