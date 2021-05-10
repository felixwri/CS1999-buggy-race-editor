console.log('ready');

let inputs = document.getElementsByTagName("input");
let select = document.getElementsByTagName("select");

let cost = document.getElementById("cost-value");
let weight = document.getElementById("weight-value");

let c = 0;
let w = 0;

cost.innerText = c;
weight.innerText = w;



// for (let i = 0; i < inputs.length; i++) {
//     console.log(inputs[i].name);
//     console.log(inputs[i].value);
// }

calculate();

function calculate() {
    for (let i = 0; i < select.length; i++) {
        if (select[i].name == 'aux_power_type') {
            select[i].name = 'power_type'
        }
        if (prices[select[i].name] != undefined) {
            c = parseInt(c) + parseInt(prices[select[i].name][select[i].value].cost);
            w = parseInt(w) + parseInt(prices[select[i].name][select[i].value].weight);
        }
    }

    cost.innerText = c;
    weight.innerText = w;

    c = 0;
    w = 0;
}

// console.log(prices.power_type.wind.cost)

