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

async function loginAsGuest() {
    let obj =
    {
        "username": "guest",
        "password": "none",
        "method": "login"
    }

    let valid = await auth(obj)
    console.log(valid)
    if (valid.username === 'none') return;

    transition("guest")
}

async function tryLogin() {
    const inputs = document.getElementsByClassName('existing')

    let obj =
    {
        "username": inputs[0].value,
        "password": inputs[1].value,
        "method": "login"
    }
    let valid = await auth(obj)
    console.log(valid)
    if (valid.username === 'none') return;

    transition(valid.username)
}

async function tryCreate() {
    const inputs = document.getElementsByClassName('new')

    let obj =
    {
        "username": inputs[0].value,
        "password": inputs[1].value,
        "method": "create"
    }
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
    const settings_name = document.getElementById('settings-name')

    const existingaccount = document.getElementById('existing-account')
    existingaccount.classList.add("none")

    const newaccount = document.getElementById('new-account')
    newaccount.classList.add("none")

    profile_name.innerText = username
    settings_name.innerText = `Settings for ${username} `
    
    // login[0].style.left = "70vw"
    login[0].classList.add('none')
    profile.style.opacity = "1"
    main[0].style.opacity = "1"
    loggedIn = true;
}

async function logout() {
    let obj = {
        "method": "logout"
    }

    let valid = await auth(obj)
    console.log(valid)

    const settingsMenu = document.getElementById('settings')
    if (!settingsMenu.classList.contains("none")) {
        await settings()
    }

    let inputs = document.getElementsByTagName("input");
    
    for (let i = 0; i < inputs.length; i++ ) {
        inputs[i].value = "";
    }


    inverseTransition()
}

function inverseTransition() {
    const main = document.getElementsByClassName('opacity')
    const login = document.getElementsByClassName('login')
    const profile = document.getElementById('profile')
    const profile_name = document.getElementById('profile-name')

    const existingaccount = document.getElementById('existing-account')
    existingaccount.classList.add("none")

    const newaccount = document.getElementById('new-account')
    newaccount.classList.add("none")

    profile_name.innerText = "login required"
    // login[0].style.left = "70vw"
    login[0].classList.remove('none')
    profile.style.opacity = "0"
    main[0].style.opacity = "0"
    reset = true;
}

async function settings() {
    const settingsMenu = document.getElementById('settings')
    const main = document.getElementsByClassName('opacity')[0]

    if (settingsMenu.classList.contains("none")) {
        settingsTransition = true

        
        main.style.opacity = "0"

        settingsMenu.classList.remove("none")

        await sleep(500)

        settingsMenu.style.opacity = "100"
        settingsMenu.style.zIndex = "1"

    } else {
        settingsTransition = false
        settingsMenu.style.opacity = "0"
        settingsMenu.style.zIndex = "-1"

        await sleep(500)
        settingsMenu.classList.add("none")

        main.style.opacity = "100"   
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function themeChange(element) {
    themeColor = element.value.replace("#", "0x")
    console.log(themeColor)
}

function displayOption(option) {
    col = document.getElementById("col");
    pwd = document.getElementById("pwd");
    del = document.getElementById("del");

    all = [col, pwd, del];

    for (let i = 0; i < all.length; i ++ ) {
        if (all[i].id == option) {
            if (all[i].classList.contains("none")) {
                all[i].classList.remove("none")
            }
            continue;
        }
        
        if (!all[i].classList.contains("none")) {
            all[i].classList.add("none")
        }
    }  
}

async function changeColor() {
    let obj = {
        "method": "changeColor",
        "content": themeColor
    }

    let valid = await auth(obj)
    console.log(valid)
}

async function changePassword() {
    inputs = document.getElementsByName("new_password")

    if (inputs[1].value !== inputs[2].value) {
        inputs[1].style.backgroundColor = "var(--dark-red)"
        inputs[2].style.backgroundColor = "var(--dark-red)"

        await sleep(1000)

        inputs[0].style.backgroundColor = "hsla(0, 0%, 0%, 0.2)"
        inputs[1].style.backgroundColor = "hsla(0, 0%, 0%, 0.2)"
        inputs[2].style.backgroundColor = "hsla(0, 0%, 0%, 0.2)"

        return;
    }

    let obj = {
        "method": "changePassword",
        "content": {
            "new": inputs[1].value,
            "old": inputs[0].value
        }
    }

    let valid = await auth(obj)

    if (valid.success) {
        inputs[0].style.backgroundColor = "var(--dark-green)"
        inputs[1].style.backgroundColor = "var(--dark-green)"
        inputs[2].style.backgroundColor = "var(--dark-green)"
    }

    await sleep(1000)

    inputs[0].style.backgroundColor = "hsla(0, 0%, 0%, 0.2)"
    inputs[1].style.backgroundColor = "hsla(0, 0%, 0%, 0.2)"
    inputs[2].style.backgroundColor = "hsla(0, 0%, 0%, 0.2)"


    console.log(valid)
}

async function destroy() {
    inputs = document.getElementsByName("delete")

    if (inputs[0].value === "") {
        inputs[0].style.backgroundColor = "var(--dark-red)"

        await sleep(500)

        inputs[0].style.backgroundColor = "hsla(0, 0%, 0%, 0.2)"
        return;
    }

    let obj = {
        "method": "delete",
        "content": inputs[0].value
    }

    let valid = await auth(obj)

    if (valid.success) {
        inputs[0].style.backgroundColor = "var(--dark-green)"

        await sleep(500)

        inputs[0].style.backgroundColor = "hsla(0, 0%, 0%, 0.2)"

        await logout()
    } else {
        inputs[0].style.backgroundColor = "var(--red)"
    }

    console.log(valid)
}