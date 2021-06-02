async function updateFlag() {
    let colorOne = document.getElementsByClassName("cls-1")
    let colorTwo = document.getElementsByClassName("cls-2")
    let colorThree = document.getElementsByClassName("cls-3")

    const icons = document.getElementsByClassName("f-icon")

    let primary = document.getElementsByName("flag_color")
    let secondary = document.getElementsByName("flag_color_secondary")
    let pattern = document.getElementsByName("flag_pattern")

    for (let i = 0; i < colorOne.length; i++) {
        colorOne[i].style.fill = primary[0].value
    }
    for (let i = 0; i < colorTwo.length; i++) {
        colorTwo[i].style.fill = secondary[0].value
    }
    for (let i = 0; i < colorThree.length; i++) {
        colorThree[i].style.fill = primary[0].value
    }
    for (let i = 0; i < icons.length; i ++) {
        let name = icons[i].getAttribute("name")
        if (name == pattern[0].value) {
            if (icons[i].classList.contains("none")) {
                icons[i].classList.remove("none")
            }
        } else {
            if (!icons[i].classList.contains("none")) {
                icons[i].classList.add("none")
            }
        }
    }
}