const auth = async (object) => {
    const rawResponse = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
    });
    // const content = await rawResponse.json();
    let response = await rawResponse.json();

    return response
};

// !
// ! This needs server side validation 
// ! 

async function newToJson() {
    const inputs = document.getElementsByClassName('new')

    let obj =
    {
        "username": inputs[0].value,
        "password": inputs[1].value,
        "create": true
    }

    return obj;
}


async function existingToJson() {
    const inputs = document.getElementsByClassName('existing')

    let obj =
    {
        "username": inputs[0].value,
        "password": inputs[1].value,
        "create": false
    }

    return obj;
}

async function loginAsGuest() {
    let obj =
    {
        "username": "guest",
        "password": "none",
        "create": false
    }

    let valid = await auth(obj)
    console.log(valid)
    if (valid.username === 'none') return;

    transition("guest")
}

async function tryLogin() {
    let obj = await existingToJson()
    let valid = await auth(obj)
    console.log(valid)
    if (valid.username === 'none') return;

    transition(valid.username)
}

async function tryCreate() {
    let obj = await newToJson()
    let valid = await auth(obj)
    console.log(valid)
    if (valid.username === 'none') return;

    transition(valid.username)
}

function showLogin() {
    newLogin = document.getElementById("new-account")
    if (!newLogin.classList.contains("none")) {
        newLogin.classList.add("none")
    }

    login = document.getElementById("existing-account")
    login.classList.remove("none")
}

function showAccountCreation() {

    login = document.getElementById("existing-account")
    if (!login.classList.contains("none")) {
        login.classList.add("none")
    }

    newLogin = document.getElementById("new-account")
    newLogin.classList.remove("none")
}

function skipLogin() {
    if (alreadyLoggedIn.username != "none") {

        transition(alreadyLoggedIn.username)
        // console.log("continue");
    }
}

function transition(username) {
    const main = document.getElementsByClassName('opacity')
    const login = document.getElementsByClassName('login')
    const profile = document.getElementById('profile') 
    const profile_name = document.getElementById('profile-name')

    const existingaccount = document.getElementById('existing-account')
    existingaccount.classList.add("none")

    const newaccount = document.getElementById('new-account')
    newaccount.classList.add("none")

    profile_name.innerText = username
    // login[0].style.left = "70vw"
    login[0].style.display = "none"
    profile.style.opacity = "1"
    main[0].style.opacity = "1"
    loggedIn = true;
}