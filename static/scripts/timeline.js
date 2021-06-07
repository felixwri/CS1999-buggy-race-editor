const timeline = gsap.timeline({ defaults: { ease: 'power1.out' } });

// timeline.to(".line", { width: "100%", duration: 1});

async function build() {
    await fadeText('Buggy Developer', 'h1', 'welcome-text', 'first');
    await fadeText('CS1999', 'h2', 'welcome-text', 'second');
    await fadeText('By Felix Wright', 'h2', 'welcome-text', 'third');

    timeline.fromTo('.welcome-svg', { opacity: '0' }, { opacity: '1', duration: 2 });
    timeline.fromTo('.sky-svg', { opacity: '0' }, { opacity: '1', duration: 5 });

    timeline.staggerFromTo('.first', 1, { opacity: '0' }, { opacity: '1', stagger: 0.2 });
    timeline.staggerFromTo('.second', 1, { opacity: '0' }, { opacity: '1', stagger: 0.2 });
    timeline.staggerFromTo('.third', 1, { opacity: '0' }, { opacity: '1', stagger: 0.2 });

    timeline.fromTo('nav', { opacity: '0' }, { opacity: '1', duration: 1 });

    timeline.fromTo(
        '.sky-svg',
        { translateY: '10%', rotate: '0' },
        { translateY: '-50%', rotate: '5', duration: 60, repeat: -1, yoyo: true },
        '-=15'
    );
}

async function fadeText(text, nodeTag, parentId, className) {
    let parent = document.getElementById(parentId);
    let node = document.createElement(nodeTag);
    for (let i = 0; i < text.length; i++) {
        let letter = document.createElement('div');
        letter.style.display = 'inline';
        letter.classList.add(className);
        letter.textContent = text[i];
        node.appendChild(letter);
    }
    parent.appendChild(node);
}
