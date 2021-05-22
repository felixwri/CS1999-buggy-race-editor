const rightResizer = document.getElementById('horizontalDragRight');
const leftResizer = document.getElementById('horizontalDragLeft');

// layer 1
const leftSideScaffold = document.getElementById('left-scaffold');
const leftSide = document.getElementById('left');

//layer 2
const rightSideScaffold = document.getElementById('right-scaffold');
const rightSide = document.getElementById('right');

// The current position of mouse for the right side
let rightX = 0;
let rightY = 0;

let leftX = 0;
let leftY = 0;

// Width of centerRight side
let centerWidth = 0;

// ? event handelers for the right hand side
// 
// 

const mouseDownHandlerRight = function(e) {
    console.log("rightside")
    // Get the current mouse position
    rightX = e.clientX;
    rightY = e.clientY;

    scaffoldWidth = rightSideScaffold.getBoundingClientRect().width;

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandlerRight);
    document.addEventListener('mouseup', mouseUpHandlerRight);
};

const mouseMoveHandlerRight = function(e) {
    // How far the mouse has been moved
    // console.log(`${e.clientX}, ${window.innerWidth}`)
    const limit = leftSide.getBoundingClientRect().width;
    const dx = e.clientX - rightX;
    // const dy = e.clientY - rightY;

    if (e.clientX > window.innerWidth) return;
    if (e.clientX + 150 > window.innerWidth) return;
    if (e.clientX - 20 < limit) return;

    const newScaffoldWidth = (scaffoldWidth + dx) * 100 / rightResizer.parentNode.getBoundingClientRect().width;
    // console.log(`${newcenterWidth}`)
    rightSideScaffold.style.width = `${newScaffoldWidth}%`;

    rightResizer.style.cursor = 'col-resize';

    rightSideScaffold.style.userSelect = 'none';
    rightSideScaffold.style.pointerEvents = 'none';

    rightSide.style.userSelect = 'none';
    rightSide.style.pointerEvents = 'none';
};

const mouseUpHandlerRight = function() {
    rightResizer.style.removeProperty('cursor');

    rightSideScaffold.style.removeProperty('user-select');
    rightSideScaffold.style.removeProperty('pointer-events');

    rightSide.style.removeProperty('user-select');
    rightSide.style.removeProperty('pointer-events');

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandlerRight);
    document.removeEventListener('mouseup', mouseUpHandlerRight);
};

// Attach the handler
rightResizer.addEventListener('mousedown', mouseDownHandlerRight);

// ? event handelers for the Left hand side
// 
// 

const mouseDownHandlerLeft = function(e) {
    console.log("leftside")
    // Get the current mouse position
    leftX = e.clientX;
    leftY = e.clientY;
    
    leftWidth = leftSide.getBoundingClientRect().width;

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandlerLeft);
    document.addEventListener('mouseup', mouseUpHandlerLeft);
};

const mouseMoveHandlerLeft = function(e) {
    // How far the mouse has been moved

    const limit = rightSide.getBoundingClientRect().left;
    const dx = e.clientX - leftX;
    // const dy = e.clientY - leftY;

    if (e.clientX < 0) return;
    if (e.clientX - 150 < 0) return;
    if (e.clientX + 20 > limit) return;

    const newScaffoldWidth = (leftWidth + dx) * 100 / leftResizer.parentNode.getBoundingClientRect().width;

    // console.log(`${newcenterWidth}`)
    leftSideScaffold.style.width = `${100 - newScaffoldWidth}%`;

    leftResizer.style.cursor = 'col-resize';

    leftSide.style.userSelect = 'none';
    leftSide.style.pointerEvents = 'none';

    leftSideScaffold.style.userSelect = 'none';
    leftSideScaffold.style.pointerEvents = 'none';
};

const mouseUpHandlerLeft = function() {
    leftResizer.style.removeProperty('cursor');

    leftSide.style.removeProperty('user-select');
    leftSide.style.removeProperty('pointer-events');

    leftSideScaffold.style.removeProperty('user-select');
    leftSideScaffold.style.removeProperty('pointer-events');

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandlerLeft);
    document.removeEventListener('mouseup', mouseUpHandlerLeft);
};

// Attach the handler
leftResizer.addEventListener('mousedown', mouseDownHandlerLeft);