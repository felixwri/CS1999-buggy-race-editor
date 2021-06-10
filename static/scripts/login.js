const tl = gsap.timeline({ defaults: { ease: 'power1.out' } });

const auth = async (object) => {
    const rawResponse = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
    });
    // const content = await rawResponse.json();
    let response = await rawResponse.json();

    return response;
};

// !
// ! This needs server side validation
// !

async function loginAsGuest() {
    let obj = {
        username: 'guest',
        password: 'none',
        method: 'login'
    };

    let valid = await auth(obj);
    console.log(valid);
    if (valid.username === 'none') return;

    transition('guest');
}

async function tryLogin() {
    const inputs = document.getElementsByClassName('existing');

    let obj = {
        username: inputs[0].value,
        password: inputs[1].value,
        method: 'login'
    };
    let valid = await auth(obj);

    // ? login response

    console.log(valid);

    if (valid.username === 'none') return;

    username = valid.username;

    if (username == 'admin') {
        document.getElementById('admin').classList.remove('none');
    } else {
        if (!document.getElementById('admin').classList.contains('none')) {
            document.getElementById('admin').classList.add('none');
        }
    }

    color(valid.theme.primary, valid.theme.secondary);

    transition(valid.username);
}

function color(primary, secondary) {
    themeColorPrimary = primary;
    themeColorSecondary = secondary;

    document.getElementsByTagName('canvas')[0].style.backgroundColor = themeColorSecondary;
    hexThemeColor = themeColorPrimary.replace('#', '0x');
}

async function tryCreate() {
    const inputs = document.getElementsByClassName('new');

    let obj = {
        username: inputs[0].value,
        email: inputs[1].value,
        password: inputs[2].value,
        method: 'create'
    };
    let valid = await auth(obj);
    console.log(valid);
    if (valid.username === 'none') return;

    transition(valid.username);
}

async function showLogin() {
    newLogin = document.getElementById('new-account');
    if (!newLogin.classList.contains('none')) {
        tl.fromTo('#new-account', { opacity: '1' }, { opacity: '0', duration: 0.5 });
        await sleep(500);
        newLogin.classList.add('none');
    }

    login = document.getElementById('existing-account');
    login.classList.remove('none');

    tl.fromTo('#existing-account', { opacity: '0' }, { opacity: '1', duration: 0.5 });
}

async function showAccountCreation() {
    login = document.getElementById('existing-account');
    if (!login.classList.contains('none')) {
        tl.fromTo('#existing-account', { opacity: '1' }, { opacity: '0', duration: 0.5 });
        await sleep(500);
        login.classList.add('none');
    }

    newLogin = document.getElementById('new-account');
    newLogin.classList.remove('none');

    tl.fromTo('#new-account', { opacity: '0' }, { opacity: '1', duration: 0.5 });
}

function skipLogin() {
    if (alreadyLoggedIn.username != 'none') {
        if (username == 'admin') {
            document.getElementById('admin').classList.remove('none');
        } else {
            if (!document.getElementById('admin').classList.contains('none')) {
                document.getElementById('admin').classList.add('none');
            }
        }

        transition(alreadyLoggedIn.username);
        // console.log("continue");
    }
}

function transition(username) {
    const main = document.getElementsByClassName('opacity');
    const login = document.getElementsByClassName('login');
    const profile = document.getElementById('profile');
    const profile_name = document.getElementById('profile-name');
    const settings_name = document.getElementById('settings-name');

    const existingaccount = document.getElementById('existing-account');
    existingaccount.classList.add('none');

    const newaccount = document.getElementById('new-account');
    newaccount.classList.add('none');

    profile_name.innerText = username;
    settings_name.innerText = `Settings for ${username} `;

    // login[0].style.left = "70vw"
    login[0].classList.add('none');
    profile.style.opacity = '1';
    main[0].style.opacity = '1';
    loggedIn = true;
}

async function logout() {
    let obj = {
        method: 'logout'
    };

    let valid = await auth(obj);
    console.log(valid);

    const settingsMenu = document.getElementById('settings');
    if (!settingsMenu.classList.contains('none')) {
        await settings();
    }

    await clean();

    color('#ffffff', '#17191c');

    inverseTransition();
}

async function clean() {
    let inputs = document.getElementsByTagName('input');

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }
}

function inverseTransition() {
    const main = document.getElementsByClassName('opacity');
    const login = document.getElementsByClassName('login');
    const profile = document.getElementById('profile');
    const profile_name = document.getElementById('profile-name');

    const existingaccount = document.getElementById('existing-account');
    existingaccount.classList.add('none');

    const newaccount = document.getElementById('new-account');
    newaccount.classList.add('none');

    profile_name.innerText = 'login required';
    // login[0].style.left = "70vw"
    login[0].classList.remove('none');
    profile.style.opacity = '0';
    main[0].style.opacity = '0';
    reset = true;
}

async function settings() {
    const settingsMenu = document.getElementById('settings');
    const main = document.getElementsByClassName('opacity')[0];

    if (settingsMenu.classList.contains('none')) {
        settingsTransition = true;

        main.style.opacity = '0';

        settingsMenu.classList.remove('none');

        await sleep(500);

        settingsMenu.style.opacity = '100';
        settingsMenu.style.zIndex = '1';
    } else {
        settingsTransition = false;
        settingsMenu.style.opacity = '0';
        settingsMenu.style.zIndex = '-1';

        await sleep(500);
        settingsMenu.classList.add('none');

        main.style.opacity = '100';
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function themeChange() {
    colorInput = document.getElementsByName('theme_color');

    // ? Dumb error correction
    if (!(colorInput[0].value == '#000000' && colorInput[1].value == '#000000')) {
        themeColorPrimary = colorInput[0].value;
        themeColorSecondary = colorInput[1].value;
    }

    document.getElementsByTagName('canvas')[0].style.backgroundColor = themeColorSecondary;
    hexThemeColor = themeColorPrimary.replace('#', '0x');
}

function displayOption(option) {
    let col = document.getElementById('col');
    let forgot = document.getElementById('for');
    let pwd = document.getElementById('pwd');
    let del = document.getElementById('del');

    all = [col, forgot, pwd, del];

    for (let i = 0; i < all.length; i++) {
        if (all[i].id == option) {
            if (all[i].classList.contains('none')) {
                all[i].classList.remove('none');
            }
            continue;
        }

        if (!all[i].classList.contains('none')) {
            all[i].classList.add('none');
        }
    }
}

async function changeColor() {
    let obj = {
        method: 'changeColor',
        content: {
            primary: themeColorPrimary,
            secondary: themeColorSecondary
        }
    };

    let valid = await auth(obj);
    console.log(valid);
}

async function resetColor() {
    let obj = {
        method: 'changeColor',
        content: {
            primary: '#ffffff',
            secondary: '#17191c'
        }
    };

    let valid = await auth(obj);
    console.log(valid);

    colorInput = document.getElementsByName('theme_color');

    themeColorPrimary = '#ffffff';
    themeColorSecondary = '#17191c';

    document.getElementsByTagName('canvas')[0].style.backgroundColor = themeColorSecondary;
    hexThemeColor = themeColorPrimary.replace('#', '0x');
    console.log(hexThemeColor);
}

async function changePassword() {
    inputs = document.getElementsByName('new_password');

    if (inputs[1].value !== inputs[2].value) {
        inputs[1].style.backgroundColor = 'var(--dark-red)';
        inputs[2].style.backgroundColor = 'var(--dark-red)';

        await sleep(1000);

        inputs[0].style.backgroundColor = 'hsla(0, 0%, 0%, 0.2)';
        inputs[1].style.backgroundColor = 'hsla(0, 0%, 0%, 0.2)';
        inputs[2].style.backgroundColor = 'hsla(0, 0%, 0%, 0.2)';

        return;
    }

    let obj = {
        method: 'changePassword',
        content: {
            new: inputs[1].value,
            old: inputs[0].value
        }
    };

    let valid = await auth(obj);

    if (valid.success) {
        inputs[0].style.backgroundColor = 'var(--dark-green)';
        inputs[1].style.backgroundColor = 'var(--dark-green)';
        inputs[2].style.backgroundColor = 'var(--dark-green)';
    }

    await sleep(1000);

    inputs[0].style.backgroundColor = 'hsla(0, 0%, 0%, 0.2)';
    inputs[1].style.backgroundColor = 'hsla(0, 0%, 0%, 0.2)';
    inputs[2].style.backgroundColor = 'hsla(0, 0%, 0%, 0.2)';

    console.log(valid);
}

async function forgotPassword() {
    let inputs = document.getElementsByName('forgot_password');

    let obj = {
        method: 'forgotPassword',
        email: inputs[0].value
    };

    let valid = await auth(obj);

    if (valid.success == "sent") {
        inputs[0].style.backgroundColor = 'var(--dark-green)';
    } else {
        inputs[0].style.backgroundColor = 'var(--dark-red)';
    }

    await sleep(1000);

    inputs[0].style.backgroundColor = 'hsla(0, 0%, 0%, 0.2)';

    console.log(valid);
}

async function destroy() {
    inputs = document.getElementsByName('delete');

    if (inputs[0].value === '') {
        inputs[0].style.backgroundColor = 'var(--dark-red)';

        await sleep(500);

        inputs[0].style.backgroundColor = 'hsla(0, 0%, 0%, 0.2)';
        return;
    }

    let obj = {
        method: 'delete',
        content: inputs[0].value
    };

    let valid = await auth(obj);

    if (valid.success) {
        inputs[0].style.backgroundColor = 'var(--dark-green)';

        await sleep(500);

        inputs[0].style.backgroundColor = 'hsla(0, 0%, 0%, 0.2)';

        await logout();
    } else {
        inputs[0].style.backgroundColor = 'var(--red)';
    }

    console.log(valid);
}
