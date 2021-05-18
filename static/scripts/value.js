let inputs = document.getElementsByTagName("input");
let select = document.getElementsByTagName("select");

let cost = document.getElementById("cost-value");
let weight = document.getElementById("weight-value");

let total = document.getElementById("total_cost");

let c = 0;
let w = 0;

cost.innerText = c;
weight.innerText = w;

calculate();

async function calculate() {
    for (let i = 0; i < select.length; i++) {
        //? armour special case
        if (select[i].name == 'armour' && select[i].value != 'None') {
            c = parseInt(c) + parseInt(prices[select[i].name][select[i].value].cost) * (((inputs[1].value - 4) / 10) + 1);
            w = parseInt(w) + parseInt(prices[select[i].name][select[i].value].weight) * (((inputs[1].value - 4) / 10) + 1);
        }

        //? all remaining values
        if (prices[select[i].name] != undefined && select[i].value != 'None') {
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

if (document.getElementById("fireproof").checked) {
    document.getElementById('fireproofHidden').disabled = true;
}


if (document.getElementById("insulated").checked) {
    document.getElementById('insulatedHidden').disabled = true;
}

if (document.getElementById("antibiotic").checked) {
    document.getElementById('antibioticHidden').disabled = true;
}

if (document.getElementById("banging").checked) {
    document.getElementById('bangingHidden').disabled = true;
}

let targetSpend = 1000
const totalSpend = 2000

let spendWeight = targetSpend / totalSpend 

async function automate() {
    for (let i = 0; i < select.length; i++) {
        // console.log(select[i].name)
        let randomIndex = Math.round(Math.random() * (select[i].length - 1));
        select[i].options[randomIndex].selected = 'selected';
        // select[i].style.backgroundColor = 'var(--muted-green)';

        if (prices[select[i].name] != undefined && select[i].value != 'None') {
            targetSpend = targetSpend - parseInt(prices[select[i].name][select[i].value].cost)
            // console.log(targetSpend)
        }
    }

    // console.log(targetSpend);

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'submit') {
            continue;
        }
        if (inputs[i].type === 'text') {
            // ? Random name generator
            console.log(inputs[i].name)
            names = ["old", "long", "new", "cold", "hot", "diesel", "oil", "electric", "solar", "prime", "light", "dark", "lost", "ruined", "grey", "blue", "spark"]

            fakeName = `${names[Math.round(Math.random() * (names.length - 1))]}  ${names[Math.round(Math.random() * (names.length - 1))]}`;

            console.log(fakeName)
            inputs[i].value = fakeName;
            continue;
        }
        if (inputs[i].type === 'color') {
            inputs[i].value = generateColor();
            continue;
        }
        if (inputs[i].type === 'checkbox') {
            let randomBool = Math.round(Math.random());
            if (randomBool) {
                inputs[i].checked = true;
            } else {
                inputs[i].checked = false;
            }
            continue;
        }
        if (inputs[i].name === 'qty_tyres') {
            let randomValue = Math.round(Math.random() * (inputs[i].max - inputs[i - 1].value)) + inputs[i - 1].value;
            inputs[i].value = randomValue;
            continue;
        }
        let randomValue = Math.round(Math.random() * (inputs[i].max - 1));
        if (randomValue > 100) randomValue = 100;
        inputs[i].value = randomValue;
        // select[i].style.backgroundColor = 'var(--muted-green)';

        await calculate();
    }
}

function generateColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function loadNewCar(message) {
    for (let i = 0; i < select.length; i++) {
        select[i].value = message[select[i].name]
    }
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type === "submit") continue;
        inputs[i].value = message[inputs[i].name]
    }
    let title = document.getElementById('head');

    title.innerText = `Developing: ${message['buggy_name']}`;
    title.style.fontSize = "2rem"
}

let active = "none"

function form(section) {
    sections = ['name', 'traction', 'drive', 'offensive', 'misc', 'algorithm', 'flag', 'submit']

    current = document.getElementById(section)
    current.classList.remove('hidden')

    console.log(current)

    return current;
}

