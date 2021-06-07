const tl = gsap.timeline({ defaults: { ease: 'power1.out' } });

let connect = async (user, index) => {
    let response = await fetch(`http://localhost:5000/api/${user}/${index}`);
    let message = await response.json();
    return message;
};

async function getBuggy(user, index, color) {
    message = await connect(user, index);
    showCar(message, color);
}

function showCar(data, color) {
    buttons = document.getElementsByTagName('button');

    buttons[0].setAttribute('onclick', `json("${data['owner']}", ${data['private']})`);
    buttons[1].setAttribute('onclick', `api("${data['owner']}", ${data['private']})`);

    parent = document.getElementsByClassName('active')[0];
    parent.innerHTML = '';
    for (key in data) {
        if (key === 'id' || key === 'owner' || key === 'buggy_name' || key === 'private' || key === 'total_cost') {
            continue;
        }

        let childTitle = document.createElement('DIV');
        childTitle.innerText = `${key}: `;
        childTitle.style.color = `${color}`;
        childTitle.style.textTransform = 'capitalize';
        let childKey = document.createElement('DIV');
        childKey.innerText = ` ${data[key]}`;
        childKey.style.color = 'white';

        let child = document.createElement('DIV');

        child.classList.add('child');
        child.classList.add(`${key}`);

        child.appendChild(childTitle);
        child.appendChild(childKey);

        parent.appendChild(child);

        tl.fromTo(`.${key}`, { opacity: '0' }, { opacity: '1', duration: 0.1 });
    }
}

async function json(user, index) {
    obj = await connect(user, index);
    navigator.clipboard.writeText(JSON.stringify(obj)).then(
        function () {
            console.log('Copied');
        },
        function (err) {
            console.log('Failed to copy JSON', err);
        }
    );
}

async function api(user, index) {
    obj = await connect(user, index);

    console.log(obj.buggy_name, obj.total_cost);

    await trim(obj);

    await post(obj);
}

async function trim(obj) {
    delete obj.id;
    delete obj.owner;
    delete obj.buggy_name;
    delete obj.private;
    delete obj.total_cost;

    return obj;
}

async function post(json) {
    console.log(json);

    const response = await fetch('http://localhost:5000/buggy', {
        method: 'POST',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    });

    const content = await response.text();

    console.log(content);
}

function buildProfiles() {
    let profiles = [];

    for (let i = 0; i < raw.length; i++) {
        profiles.push(JSON.parse(raw[i]));
    }

    return profiles;
}

function buildBuggies(profiles) {
    let availableBuggies = document.getElementsByClassName('gallery');

    for (let buggy = 0; buggy < availableBuggies.length; buggy++) {
        for (let i = 0; i < profiles.length; i++) {
            let node = document.createElement('DIV');
            node.classList.add('card');
            node.style.backgroundImage = `linear-gradient(to right, var(--primary) 60%, ${profiles[i].primary_color} 30%, ${profiles[i].secondary_color})`;

            let nameChild = document.createElement('DIV');
            let nameContent = document.createTextNode(`${profiles[i].name}`);
            nameChild.classList.add('card-name');
            nameChild.style.width = '50%';
            nameChild.appendChild(nameContent);

            let idChild = document.createElement('DIV');
            let idContent = document.createTextNode(`${profiles[i].privateID}`);
            idChild.classList.add('card-id');
            idChild.style.fontSize = '0.75em';
            idChild.appendChild(idContent);

            node.setAttribute('onclick', `getBuggy("${username}", ${profiles[i].privateID}, "${profiles[i].primary_color}")`);
            node.appendChild(nameChild);
            node.appendChild(idChild);
            availableBuggies[buggy].appendChild(node);
        }
    }
}
