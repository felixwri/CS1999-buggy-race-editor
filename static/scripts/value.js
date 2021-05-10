let inputs = document.getElementsByTagName("input");
let select = document.getElementsByTagName("select");

let cost = document.getElementById("cost-value");
let weight = document.getElementById("weight-value");

let total = document.getElementById("total_cost");

let c = 0;
let w = 0;

cost.innerText = c;
weight.innerText = w;

console.log(inputs)

calculate();

function calculate() {
    for (let i = 0; i < select.length; i++) {
        if (select[i].name == 'aux_power_type') {
            for (let j = 0; j < inputs.length; j++) {
                if (inputs[j].name == 'aux_power_units') {
                    c = parseInt(c) + parseInt(prices["power_type"][select[i].value].cost) * inputs[j].value;
                    w = parseInt(w) + parseInt(prices["power_type"][select[i].value].weight) * inputs[j].value;
                    break;
                }
            }
        }
        if (prices[select[i].name] != undefined) {
            for (let j = 0; j < inputs.length; j++) {
                if (prices[select[i].name].units == inputs[j].name) {
                    c = parseInt(c) + parseInt(prices[select[i].name][select[i].value].cost) * inputs[j].value;
                    w = parseInt(w) + parseInt(prices[select[i].name][select[i].value].weight) * inputs[j].value;
                    break;
                }
            }
        }
    }

    cost.innerText = c;
    total.innerText = c;
    total.value = c;
    weight.innerText = w;

    c = 0;
    w = 0;
}

if(document.getElementById("fireproof").checked) {
    document.getElementById('fireproofHidden').disabled = true;
}


if(document.getElementById("insulated").checked) {
    document.getElementById('insulatedHidden').disabled = true;
}

if(document.getElementById("antibiotic").checked) {
    document.getElementById('antibioticHidden').disabled = true;
}

if(document.getElementById("banging").checked) {
    document.getElementById('bangingHidden').disabled = true;
}

