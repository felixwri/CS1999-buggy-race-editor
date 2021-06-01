let currentIndex = 1;

const chapters = document.getElementsByTagName("li")
const pages = document.getElementsByTagName("section")

chapters[1].style.color = "cyan";
chapters[1].style.backgroundColor = "hsla(0, 0%, 0%, 0.2)"

for (let i = 0; i < chapters.length; i++) {
    chapters[i].onclick = () => {
        if (i === 0) {
            if (currentIndex > 1) {
                currentIndex = currentIndex - 1;

                giveAndRemove(currentIndex, currentIndex + 1)

                pages[currentIndex - 1].scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
            }
        } else if (i === 10) {
            if (currentIndex < 9) {
                currentIndex = currentIndex + 1;

                giveAndRemove(currentIndex, currentIndex - 1)

                pages[currentIndex - 1].scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
            }
        } else {
            pages[i - 1].scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
            giveAndRemove(i, currentIndex)
            currentIndex = i;
        }
    }
}

const giveAndRemove = (a, b) => {
    chapters[a].style.color = "cyan";
    chapters[a].style.backgroundColor = "hsla(0, 0%, 0%, 0.2)"
    chapters[b].style.color = "white";
    chapters[b].style.backgroundColor = "hsla(0, 0%, 0%, 0.1)"
}

