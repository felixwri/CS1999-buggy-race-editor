const timeline = gsap.timeline({ defaults: { ease: "power1.out" } });

// timeline.to(".line", { width: "100%", duration: 1});



async function build() {
    await fadeText("Buggy Developer" , "h1", "welcome-text", "first");
    await fadeText("CS1999" , "h2", "welcome-text", "second");
    await fadeText("By Felix Wright" , "h2", "welcome-text", "third");

    timeline.fromTo(".first", {opacity: "0"}, { opacity: "1", duration: 0.2, stagger: 0.2 });
    timeline.fromTo(".second", {opacity: "0"}, { opacity: "1", duration: 0.2, stagger: 0.2 }, "-=1");
    timeline.fromTo(".third", {opacity: "0"}, { opacity: "1", duration: 0.2, stagger: 0.2 }, "-=2");


    timeline.fromTo(".sky-svg", {translateY: "10%", rotate: "0"}, { translateY: "-50%", rotate: "5", duration: 60, repeat: -1, yoyo: true }, "-=5");

}

async function fadeText(text, nodeTag, parentId, className) {
    let parent = document.getElementById(parentId);
    let node = document.createElement(nodeTag);
    for (let i = 0; i < text.length; i++) {
        let letter = document.createElement("span");
        letter.classList.add(className);
        letter.textContent = text[i];
        node.appendChild(letter);
    }
    parent.appendChild(node);
}