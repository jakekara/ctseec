var draw = function(data){

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


    var subtotal = function(d){ return numeral(d["aggregate_subtotal"]).value(); }
    var cash = function(d){ return numeral(d["aggregate_cash"]).value(); }
    var unpaid = function(d){ return numeral(d["period_exp_unpaid"]).value(); }
    var paid = function(d){ return numeral(d["aggregate_exp_paid"]).value(); }    

    var amounts = data.map(subtotal);
    var max = d3.max(amounts)
    var sum = d3.sum(amounts)

    console.log(sum, max, data);

    var data = data.sort(function(a, b){
	if (subtotal(a) < subtotal(b)) return 1;
	return -1;
    }).filter(function(a){
	return subtotal(a) >= 1000;
    });

    var container = d3.select("#container");
    container.html("");

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
	.classed("big", true)
	.classed("number", true)
	.text(function(d){ return  numeral(subtotal(d)).format("$0,0"); })

    

    boxes.append("div")
	.classed("secondary-numbers", true)
	.html(function(d){
	    var ret = ""
		+ "<div class='small number'>"
		+ "<div class='value'>"
		+ numeral(cash(d)).format("$0,0")
		+ "</div>"
		+ "<div class='label sans'>"
		+ "Cash on hand"
		+ "</div>"
		+ "</div>"

		// + "<div class='small-number'>"
		// + d["aggregate_receipts"]
		// + "</div>"
	    

		+ "<div class='small number'>"
		+ "<div class='value'>"
		+ numeral(paid(d)).format("$0,0")
		+ "</div>"
		+ "<div class='label sans'>"
		+ "expenses paid"
		+ "</div>"
		+ "</div>"

		+ "<div class='small number'>"
		+ "<div class='value'>"	    
		+ numeral(unpaid(d)).format("$0,0")
		+ "</div>"
		+ "<div class='label sans'>"
		+ "expenses unpaid"
		+ "</div>"
		+ "</div>"
	    return ret
	    
	});

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
	    var ret =  "<a target='_blank' href='" + d["link"] + "'>"
		+ d["Report Type"];

	    if (d["Document Type"] != "Original") {
		ret += " *" + d["Document Type"]
	    }
	    
	    ret += "</a>"

	    return ret;
	});

}

var go_with_data = function(data){
    draw(data);

    var do_search = function(){
	var terms = d3.select("#search").node().value.split(" ");

	var filtered = data;

	for (t in terms){
	    var term = terms[t];
	    console.log("term", term);
	    filtered = filtered.filter(function(d){
		return JSON.stringify(d).toUpperCase()
		    .indexOf(term.toUpperCase()) >= 0;
	    });
	}

	draw(filtered);
    }

    d3.select("#search").on("keyup", do_search);
    d3.select("#search_botton").on("click", do_search);
}

d3.csv("data/combined-summary.csv", go_with_data);

